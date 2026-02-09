export interface Organization {
  id: string;
  stytch_org_id: string;
  name: string;
  slug: string;
  created_at: string;
  customer_id: string | null;
  price_id: string | null;
  has_access: boolean;
  trial_started_at: string | null;
  trial_ends_at: string | null;
}
