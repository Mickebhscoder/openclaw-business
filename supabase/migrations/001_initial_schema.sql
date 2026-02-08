-- OpenClaw Business B2B Schema
-- This runs in a SEPARATE Supabase project from the game

-- Organizations (synced from Stytch on login/webhook)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stytch_org_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Members (synced from Stytch on login/webhook)
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stytch_member_id TEXT UNIQUE NOT NULL,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- OpenClaw AI Agent Instances
CREATE TABLE openclaw_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'stopped' CHECK (status IN ('stopped', 'starting', 'running', 'error')),
  system_prompt TEXT,
  model TEXT DEFAULT 'claude-sonnet-4-5-20250929',
  ecs_task_arn TEXT,
  started_at TIMESTAMPTZ,
  stopped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_organizations_stytch_org_id ON organizations(stytch_org_id);
CREATE INDEX idx_members_stytch_member_id ON members(stytch_member_id);
CREATE INDEX idx_members_org_id ON members(org_id);
CREATE INDEX idx_openclaw_instances_org_id ON openclaw_instances(org_id);
CREATE INDEX idx_openclaw_instances_status ON openclaw_instances(status);

-- Updated_at trigger for openclaw_instances
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON openclaw_instances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
