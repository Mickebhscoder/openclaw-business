import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedMember } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { describeOpenClawTask } from '@/lib/aws/ecs';
import { deleteSecret } from '@/lib/aws/ssm';

// GET /api/instances/[id]
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const auth = await getAuthenticatedMember();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('stytch_org_id', auth.organization.organization_id)
    .single();

  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: instance } = await supabase
    .from('openclaw_instances')
    .select('*')
    .eq('id', id)
    .eq('org_id', org.id)
    .single();

  if (!instance) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Update status from ECS if task is running/starting
  if (instance.ecs_task_arn && (instance.status === 'starting' || instance.status === 'running')) {
    try {
      const task = await describeOpenClawTask(instance.ecs_task_arn);
      let newStatus = instance.status;
      if (task?.lastStatus === 'RUNNING') newStatus = 'running';
      else if (task?.lastStatus === 'STOPPED') newStatus = 'stopped';
      else if (task?.lastStatus === 'PENDING' || task?.lastStatus === 'PROVISIONING') newStatus = 'starting';

      if (newStatus !== instance.status) {
        await supabase
          .from('openclaw_instances')
          .update({
            status: newStatus,
            ...(newStatus === 'running' ? { started_at: new Date().toISOString() } : {}),
            ...(newStatus === 'stopped' ? { stopped_at: new Date().toISOString(), ecs_task_arn: null } : {}),
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
        instance.status = newStatus;
      }
    } catch {
      // ECS describe failed, keep current status
    }
  }

  return NextResponse.json(instance);
}

// PATCH /api/instances/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const auth = await getAuthenticatedMember();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('stytch_org_id', auth.organization.organization_id)
    .single();

  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await request.json();
  const { name, system_prompt, model } = body;

  const { data: instance, error } = await supabase
    .from('openclaw_instances')
    .update({
      ...(name && { name }),
      ...(system_prompt !== undefined && { system_prompt }),
      ...(model && { model }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('org_id', org.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  return NextResponse.json(instance);
}

// DELETE /api/instances/[id]
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const auth = await getAuthenticatedMember();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('stytch_org_id', auth.organization.organization_id)
    .single();

  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Clean up SSM secrets
  await deleteSecret(`/openclaw/${org.id}/${id}/anthropic-key`);
  await deleteSecret(`/openclaw/${org.id}/${id}/telegram-token`);

  await supabase
    .from('openclaw_instances')
    .delete()
    .eq('id', id)
    .eq('org_id', org.id);

  return NextResponse.json({ ok: true });
}
