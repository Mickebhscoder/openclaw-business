'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Organization } from '@/types/organization';

export function TrialBanner() {
  const [org, setOrg] = useState<Organization | null>(null);

  useEffect(() => {
    fetch('/api/organization')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setOrg(data))
      .catch(() => {});
  }, []);

  if (!org) return null;
  if (org.customer_id) return null;

  const trialEndsAt = org.trial_ends_at ? new Date(org.trial_ends_at) : null;
  if (!trialEndsAt) return null;

  const now = new Date();
  const isExpired = trialEndsAt <= now;
  const diff = trialEndsAt.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

  if (isExpired) {
    return (
      <Card className="border-red-500/50 bg-red-500/10 p-4 flex items-center justify-between">
        <span className="text-sm font-medium text-red-700 dark:text-red-400">
          ⚠️ Your free trial has expired.
        </span>
        <Button size="sm" asChild>
          <Link href="/dashboard/billing">Upgrade Now</Link>
        </Button>
      </Card>
    );
  }

  const colorClass =
    daysRemaining > 3
      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
      : daysRemaining >= 2
        ? 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400'
        : 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400';

  return (
    <Card className={`${colorClass} p-4`}>
      <span className="text-sm font-medium">
        🎉 Your 7-day free trial is active — {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining. 1 agent, Haiku model included.
      </span>
    </Card>
  );
}
