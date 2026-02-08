import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { findCheckoutSession } from '@/lib/stripe';
import { stripeConfig } from '@/lib/stripe-config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();

  const headersList = headers();
  const signature = headersList.get('stripe-signature');

  let event: Stripe.Event;

  // Verify Stripe webhook signature
  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${(err as Error).message}`);
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        // First payment successful — grant access
        const stripeObject = event.data.object as Stripe.Checkout.Session;
        const session = await findCheckoutSession(stripeObject.id);

        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price?.id;
        const stytchOrgId = stripeObject.client_reference_id;
        const plan = stripeConfig.plans.find((p) => p.priceId === priceId);

        if (!plan || !stytchOrgId) break;

        // Update the organization with Stripe billing info
        await supabase
          .from('organizations')
          .update({
            customer_id: customerId,
            price_id: priceId,
            has_access: true,
          })
          .eq('stytch_org_id', stytchOrgId);

        break;
      }

      case 'checkout.session.expired': {
        // User didn't complete payment — no action needed
        break;
      }

      case 'customer.subscription.updated': {
        // Subscription changed (upgrade/downgrade/cancel pending)
        // We wait for customer.subscription.deleted for final cancellation
        break;
      }

      case 'customer.subscription.deleted': {
        // Subscription ended — revoke access
        const stripeObject = event.data.object as Stripe.Subscription;
        const subscription = await stripe.subscriptions.retrieve(stripeObject.id);

        await supabase
          .from('organizations')
          .update({ has_access: false })
          .eq('customer_id', subscription.customer);

        break;
      }

      case 'invoice.paid': {
        // Recurring payment successful — grant access
        const stripeObject = event.data.object as Stripe.Invoice;
        const lineItem = stripeObject.lines.data[0];
        const priceDetails = lineItem?.pricing?.price_details;
        const priceId = typeof priceDetails?.price === 'string'
          ? priceDetails.price
          : priceDetails?.price?.id;
        const customerId = stripeObject.customer;

        const { data: org } = await supabase
          .from('organizations')
          .select('*')
          .eq('customer_id', customerId)
          .single();

        // Ensure the invoice matches the org's plan
        if (org?.price_id !== priceId) break;

        await supabase
          .from('organizations')
          .update({ has_access: true })
          .eq('customer_id', customerId);

        break;
      }

      case 'invoice.payment_failed': {
        // Payment failed — Stripe will auto-retry via Smart Retries
        // Final revocation happens via customer.subscription.deleted
        break;
      }

      default:
        // Unhandled event type
        break;
    }
  } catch (e) {
    console.error('Stripe webhook error:', (e as Error).message);
  }

  return NextResponse.json({});
}
