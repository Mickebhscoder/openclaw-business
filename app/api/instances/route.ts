import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedMember } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { putSecret } from '@/lib/aws/ssm';

// GET /api/instances - List instances for authenticated org
export async function GET() {
  const auth = await getAuthenticatedMember();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('stytch_org_id', auth.organization.organization_id)
    .single();

  if (!org) return NextResponse.json([]);

  const { data: instances } = await supabase
    .from('openclaw_instances')
    .select('*')
    .eq('org_id', org.id)
    .order('created_at', { ascending: false });

  return NextResponse.json(instances || []);
}

// POST /api/instances - Create a new instance
export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedMember();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, system_prompt, model, anthropic_api_key, telegram_bot_token } = body;

  if (!name || !anthropic_api_key) {
    return NextResponse.json({ error: 'Name and API key are required' }, { status: 400 });
  }

  // Upsert organization
  const { data: org } = await supabase
    .from('organizations')
    .upsert({
      stytch_org_id: auth.organization.organization_id,
      name: auth.organization.organization_name,
      slug: auth.organization.organization_slug,
    }, { onConflict: 'stytch_org_id' })
    .select()
    .single();

  if (!org) return NextResponse.json({ error: 'Failed to sync organization' }, { status: 500 });

  // Create instance record
  const { data: instance, error } = await supabase
    .from('openclaw_instances')
    .insert({
      org_id: org.id,
      name,
      system_prompt: system_prompt || null,
      model: model || 'claude-sonnet-4-5-20250929',
    })
    .select()
    .single();

  if (error || !instance) {
    return NextResponse.json({ error: 'Failed to create instance' }, { status: 500 });
  }

  // Store secrets in SSM
  await putSecret(`/openclaw/${org.id}/${instance.id}/anthropic-key`, anthropic_api_key);
  if (telegram_bot_token) {
    await putSecret(`/openclaw/${org.id}/${instance.id}/telegram-token`, telegram_bot_token);
  }

  return NextResponse.json(instance, { status: 201 });
}
