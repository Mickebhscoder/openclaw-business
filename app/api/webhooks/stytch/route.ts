import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { event_type, data } = body;

  if (event_type === 'organization.created' || event_type === 'organization.updated') {
    await supabase
      .from('organizations')
      .upsert({
        stytch_org_id: data.organization_id,
        name: data.organization_name,
        slug: data.organization_slug,
      }, { onConflict: 'stytch_org_id' });
  }

  if (event_type === 'member.created' || event_type === 'member.updated') {
    // First ensure org exists
    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .eq('stytch_org_id', data.organization_id)
      .single();

    if (org) {
      await supabase
        .from('members')
        .upsert({
          stytch_member_id: data.member_id,
          org_id: org.id,
          email: data.email_address,
          role: data.roles?.[0] || 'member',
        }, { onConflict: 'stytch_member_id' });
    }
  }

  return NextResponse.json({ received: true });
}
