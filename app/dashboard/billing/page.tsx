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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Subscribe to start launching AI agents</p>
      </div>
      <Pricing />
    </div>
  );
}
