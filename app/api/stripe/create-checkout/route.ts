import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedMember } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { createCheckout } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.priceId) {
    return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
  }
  if (!body.successUrl || !body.cancelUrl) {
    return NextResponse.json({ error: 'Success and cancel URLs are required' }, { status: 400 });
  }
  if (!body.mode) {
    return NextResponse.json({ error: 'Mode is required' }, { status: 400 });
  }

  try {
    const auth = await getAuthenticatedMember();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, mode, successUrl, cancelUrl } = body;

    // Look up the org to get any existing Stripe customer ID
    const { data: org } = await supabase
      .from('organizations')
      .select('*')
      .eq('stytch_org_id', auth.organization.organization_id)
      .single();

    const stripeSessionURL = await createCheckout({
      priceId,
      mode,
      successUrl,
      cancelUrl,
      clientReferenceId: auth.organization.organization_id,
      user: {
        email: auth.member.email_address,
        customerId: org?.customer_id,
      },
    });

    return NextResponse.json({ url: stripeSessionURL });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: (e as Error)?.message }, { status: 500 });
  }
}
