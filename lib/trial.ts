import type { Organization } from '@/types/organization';

export const TRIAL_DURATION_DAYS = 7;
export const TRIAL_MAX_INSTANCES = 1;
export const TRIAL_MODEL = 'claude-haiku-4-5-20251001';

export function isOnTrial(org: Organization): boolean {
  if (!org.trial_ends_at) return false;
  if (org.customer_id) return false;
  return new Date(org.trial_ends_at) > new Date();
}

export function isTrialExpired(org: Organization): boolean {
  if (!org.trial_ends_at) return false;
  if (org.customer_id) return false;
  return new Date(org.trial_ends_at) <= new Date();
}

export function trialDaysRemaining(org: Organization): number {
  if (!org.trial_ends_at) return 0;
  const diff = new Date(org.trial_ends_at).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function hasAccess(org: Organization): boolean {
  return org.has_access === true || isOnTrial(org);
}
