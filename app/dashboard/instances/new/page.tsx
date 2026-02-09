import { getAuthenticatedMember } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { isOnTrial, isTrialExpired, TRIAL_MAX_INSTANCES } from '@/lib/trial';
import { CreateInstanceForm } from '@/components/create-instance-form';
import type { Organization } from '@/types/organization';

export default async function NewInstancePage() {
  const auth = await getAuthenticatedMember();
  if (!auth) redirect('/login');

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('stytch_org_id', auth.organization.organization_id)
    .single();

  if (org) {
    const fullOrg = org as Organization;

    if (isTrialExpired(fullOrg)) {
      redirect('/dashboard/billing');
    }

    if (isOnTrial(fullOrg)) {
      const { count } = await supabase
        .from('openclaw_instances')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', fullOrg.id);

      if ((count ?? 0) >= TRIAL_MAX_INSTANCES) {
        redirect('/dashboard/billing');
      }
    }
  }

  return <CreateInstanceForm />;
}
