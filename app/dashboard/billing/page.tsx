import { getAuthenticatedMember } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { Pricing } from '@/components/pricing';
import { ButtonPortal } from '@/components/button-portal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { stripeConfig } from '@/lib/stripe-config';

export default async function BillingPage() {
  const auth = await getAuthenticatedMember();
  if (!auth) redirect('/login');

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('stytch_org_id', auth.organization.organization_id)
    .single();

  const hasAccess = org?.has_access === true;
  const currentPlan = stripeConfig.plans.find((p) => p.priceId === org?.price_id);

  if (hasAccess && currentPlan) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-muted-foreground">Manage your subscription and billing</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle>Current Plan</CardTitle>
              <Badge variant="default">Active</Badge>
            </div>
            <CardDescription>You&apos;re on the {currentPlan.name} plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">${currentPlan.price}</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <ButtonPortal />
          </CardContent>
        </Card>
      </div>
    );
  }

  const trialEndsAt = org?.trial_ends_at ? new Date(org.trial_ends_at) : null;
  const onTrial = trialEndsAt && trialEndsAt > new Date() && !org?.customer_id;
  const trialExpired = trialEndsAt && trialEndsAt <= new Date() && !org?.customer_id;
  const daysLeft = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">
          {trialExpired
            ? 'Your free trial has expired. Upgrade to keep your agents running.'
            : onTrial
              ? `You're on a free trial — ${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining. Upgrade anytime for more agents and models.`
              : 'Subscribe to start launching AI agents'}
        </p>
      </div>
      {trialExpired && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="pt-6">
            <p className="text-sm text-red-700 dark:text-red-400">
              ⚠️ Your trial ended. Your agents have been paused. Upgrade to resume service and unlock unlimited agents + Claude Sonnet.
            </p>
          </CardContent>
        </Card>
      )}
      <Pricing />
    </div>
  );
}
