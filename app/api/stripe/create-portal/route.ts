import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedMember } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { createCustomerPortal } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedMember();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.returnUrl) {
      return NextResponse.json({ error: 'Return URL is required' }, { status: 400 });
    }

    const { data: org } = await supabase
      .from('organizations')
      .select('*')
      .eq('stytch_org_id', auth.organization.organization_id)
      .single();

    if (!org?.customer_id) {
      return NextResponse.json(
        { error: "You don't have a billing account yet. Subscribe to a plan first." },
        { status: 400 }
      );
    }

    const stripePortalUrl = await createCustomerPortal({
      customerId: org.customer_id,
      returnUrl: body.returnUrl,
    });

    return NextResponse.json({ url: stripePortalUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: (e as Error)?.message }, { status: 500 });
  }
}
