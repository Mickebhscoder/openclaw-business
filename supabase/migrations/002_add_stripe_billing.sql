-- Add Stripe billing columns to organizations table
ALTER TABLE organizations
  ADD COLUMN customer_id TEXT,
  ADD COLUMN price_id TEXT,
  ADD COLUMN has_access BOOLEAN DEFAULT false;

-- Index for webhook lookups by Stripe customer ID
CREATE INDEX idx_organizations_customer_id ON organizations(customer_id);
