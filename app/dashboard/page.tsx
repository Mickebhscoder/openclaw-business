import { getAuthenticatedMember } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bot, Plus, Lock } from 'lucide-react';
import { InstanceCard } from '@/components/instance-card';
import { NewInstanceShortcut } from '@/components/new-instance-shortcut';
import { TrialBanner } from '@/components/trial-banner';
import { isOnTrial, isTrialExpired, TRIAL_MAX_INSTANCES } from '@/lib/trial';
import type { OpenClawInstance } from '@/types/instance';
import type { Organization } from '@/types/organization';

export default async function DashboardPage() {
  const auth = await getAuthenticatedMember();
  if (!auth) redirect('/login');

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('stytch_org_id', auth.organization.organization_id)
    .single();

  let instances: OpenClawInstance[] = [];
  if (org) {
    const { data } = await supabase
      .from('openclaw_instances')
      .select('*')
      .eq('org_id', org.id)
      .order('created_at', { ascending: false });
    instances = (data as OpenClawInstance[]) || [];
  }

  const fullOrg = org as Organization | null;
  const onTrial = fullOrg ? isOnTrial(fullOrg) : false;
  const trialExpired = fullOrg ? isTrialExpired(fullOrg) : false;
  const atTrialLimit = onTrial && instances.length >= TRIAL_MAX_INSTANCES;
  const canCreate = !trialExpired && !atTrialLimit;

  return (
    <div className="space-y-6">
      <TrialBanner />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your AI Agents</h1>
          <p className="text-muted-foreground">Manage your AI agent instances</p>
        </div>
        {canCreate ? (
          <NewInstanceShortcut />
        ) : atTrialLimit ? (
          <Button asChild variant="outline">
            <Link href="/dashboard/billing">
              <Lock className="mr-2 h-4 w-4" />
              Upgrade for more agents
            </Link>
          </Button>
        ) : trialExpired ? (
          <Button asChild variant="outline">
            <Link href="/dashboard/billing">
              <Lock className="mr-2 h-4 w-4" />
              Upgrade to create agents
            </Link>
          </Button>
        ) : (
          <NewInstanceShortcut />
        )}
      </div>
      {instances.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No instances yet</h3>
          <p className="mt-2 text-muted-foreground">Create your first AI agent to get started.</p>
          {canCreate ? (
            <Button asChild className="mt-4">
              <Link href="/dashboard/instances/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Instance
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="mt-4">
              <Link href="/dashboard/billing">Upgrade to get started</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {instances.map((instance) => (
            <InstanceCard key={instance.id} instance={instance} />
          ))}
        </div>
      )}
    </div>
  );
}
