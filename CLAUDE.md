# OpenClaw Business - CLAUDE.md

## Project Overview
B2B SaaS platform where businesses launch isolated OpenClaw AI agents on AWS ECS Fargate. Dashboard at `business.molinar.ai`, built with Next.js 14 App Router + TypeScript.

## Tech Stack
- **Framework**: Next.js 14 App Router, TypeScript
- **Auth**: Stytch B2B (Discovery flow, magic links, organizations)
- **UI**: shadcn/ui + Tailwind CSS
- **Database**: Supabase (project ID: `crjgcefmdlnbcowppxqc`, region: us-west-1)
- **Container Runtime**: AWS ECS Fargate (FARGATE_SPOT), us-west-2
- **Docker Image**: `coollabsio/openclaw` (env-based config)
- **Secrets**: AWS SSM Parameter Store (SecureString)
- **Hosting**: Vercel

## Build & Dev Commands
```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build (also runs type checking)
npm run lint         # ESLint
```

## Project Structure
```
app/
  layout.tsx                    # Root layout with StytchProvider
  login/page.tsx                # Stytch B2B Discovery flow login
  authenticate/page.tsx         # Stytch callback redirect handler
  dashboard/
    layout.tsx                  # Sidebar + auth-protected layout
    page.tsx                    # Instance list (server component)
    instances/
      new/page.tsx              # Create instance wizard
      [id]/page.tsx             # Instance detail (client, polls every 5s)
    settings/page.tsx           # Placeholder
  api/
    auth/callback/route.ts      # Server-side Stytch token exchange
    instances/route.ts          # GET list, POST create
    instances/[id]/route.ts     # GET detail (with ECS sync), PATCH, DELETE
    instances/[id]/start/route.ts  # POST -> ECS RunTask
    instances/[id]/stop/route.ts   # POST -> ECS StopTask
    webhooks/stytch/route.ts    # Org/member sync webhook

components/
  dashboard-sidebar.tsx         # Sidebar nav + logout
  dashboard-header.tsx          # Mobile-only sidebar trigger (md:hidden)
  create-instance-form.tsx      # 3-step wizard with step indicator
  instance-card.tsx             # Card for instance grid
  instance-status-badge.tsx     # Status badge with colored dots
  stytch-provider.tsx           # Client-side StytchB2BProvider wrapper
  ui/                           # shadcn/ui components

lib/
  auth.ts                       # getAuthenticatedMember() - reads stytch_session cookie
  stytch.ts                     # Server-side Stytch B2B client
  stytch-client.ts              # Browser-side Stytch B2B UI client
  supabase.ts                   # Supabase client (service role key)
  aws/ecs.ts                    # RunTask, StopTask, DescribeTasks
  aws/ssm.ts                    # PutParameter, GetParameter, DeleteParameter
```

## Key Architectural Decisions

### Authentication Flow (Stytch B2B Discovery)
1. User visits `/login` -> Stytch B2B UI component renders
2. Stytch redirects to `/authenticate?token=...&stytch_token_type=discovery`
3. `/authenticate` (client page) forwards to `/api/auth/callback` (server route)
4. Server route exchanges the discovery token, sets `stytch_session` cookie, redirects to `/dashboard`

**CRITICAL**: The Stytch redirect URL must be set to `{domain}/authenticate` in Stytch dashboard. The `/authenticate` page MUST wrap `useSearchParams()` in a `<Suspense>` boundary or Next.js build will fail.

### Stytch Discovery Token Exchange
The Stytch `discovered_organizations` array items have an optional `organization` property. Always use optional chaining or null assertion:
```typescript
const firstOrg = authResp.discovered_organizations[0];
if (firstOrg) {
  // firstOrg.organization may still be undefined per the types
  organization_id: firstOrg.organization!.organization_id,
}
```

### Stytch Domain Allowlist
Stytch requires all domains (including localhost) to be registered in the Stytch dashboard under SDK Configuration > Authorized Domains. If you see "This website has not been registered as an allowed domain", the domain needs to be added there.

### Cookie-Based Auth (Not Stytch Session SDK)
We use a simple `stytch_session` cookie set server-side, NOT the Stytch frontend session SDK. The `middleware.ts` checks for this cookie on `/dashboard/*` routes and redirects to `/login` if missing. The `lib/auth.ts` `getAuthenticatedMember()` function reads this cookie and calls `stytch.sessions.authenticate()` server-side.

### Instance Lifecycle
- Create: POST /api/instances -> stores in Supabase + secrets in SSM
- Start: POST /api/instances/[id]/start -> reads SSM secrets, calls ECS RunTask
- Stop: POST /api/instances/[id]/stop -> calls ECS StopTask
- Delete: DELETE /api/instances/[id] -> deletes Supabase row + SSM secrets
- Detail page polls GET /api/instances/[id] every 5s, which syncs ECS task status back to Supabase

### SSM Secret Paths
Secrets are stored at: `/openclaw/{org_id}/{instance_id}/{key_name}`
Keys: `anthropic-key`, `telegram-bot-token`

## Database Schema (Supabase)
Three tables: `organizations`, `members`, `openclaw_instances`
- Migration file: `supabase/migrations/001_initial_schema.sql`
- `openclaw_instances.status` CHECK constraint: stopped | starting | running | error

## Common Gotchas

1. **`useSearchParams` requires Suspense**: Any page using `useSearchParams()` must extract that into a child component wrapped in `<Suspense>`. Next.js 14 static generation fails otherwise.

2. **Stytch types are deeply optional**: The Stytch SDK types have many optional fields even on objects that logically should exist (like `discovered_organizations[0].organization`). Use non-null assertions (`!`) after runtime checks.

3. **Mobile sidebar**: The sidebar is hidden on mobile by default. `dashboard-header.tsx` provides a `SidebarTrigger` visible only below md breakpoint (`md:hidden`).

4. **Model name mapping**: Raw model IDs like `claude-sonnet-4-5-20250929` are mapped to friendly names via a `MODEL_NAMES` record in `instance-card.tsx` and the instance detail page. Update both when adding new models.

5. **shadcn/ui Select vs native select**: Always use shadcn `<Select>` component, not native `<select>`. The `onValueChange` prop (not `onChange`) is used for value updates.

6. **CSS theme**: Primary color is indigo (`238 76% 54%`), set in `globals.css` `:root` section. All UI components use `bg-primary`/`text-primary` tokens.

## AWS Infrastructure
- **ECS Cluster**: `openclaw-production` (FARGATE_SPOT)
- **Task Definition**: `openclaw-agent` (256 CPU / 512 MB)
- **Security Group**: Egress-only (no ingress - bots only make outbound calls)
- **Subnets**: subnet-REPLACE_ME_1, subnet-REPLACE_ME_2
- **Account**: ACCOUNT_ID, us-west-2
- **Terraform**: In `Molinar-AI/molinar` repo, branch `infra/ecs-migration`, module `infra/modules/openclaw/`

## Stripe Billing Integration
- **Library**: `stripe` npm package, core functions in `lib/stripe.ts`
- **Config**: `lib/stripe-config.ts` — plan definitions with environment-aware price IDs
- **API Routes**:
  - `POST /api/stripe/create-checkout` — Creates Stripe Checkout session (requires auth)
  - `POST /api/stripe/create-portal` — Opens Stripe Customer Portal for billing management
  - `POST /api/webhook/stripe` — Handles Stripe webhook events
- **Components**:
  - `components/pricing.tsx` — Pricing cards with plan features
  - `components/button-checkout.tsx` — Subscribe button that redirects to Stripe Checkout
  - `components/button-portal.tsx` — Manage Billing button that opens Stripe portal
- **Pages**: `/dashboard/billing` — Shows pricing (if no subscription) or current plan + manage button
- **Database**: `organizations` table extended with `customer_id`, `price_id`, `has_access` (migration: `002_add_stripe_billing.sql`)
- **Webhook Events**: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`
- **Flow**: Billing is per-organization (B2B). `client_reference_id` is the Stytch org ID, used in webhooks to match organizations.

## Environment Variables (.env.local)
```
STYTCH_PROJECT_ID          # Stytch B2B project ID
STYTCH_SECRET              # Stytch B2B API secret
NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN  # Stytch public token (exposed to client)
SUPABASE_URL               # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY  # Supabase service role key (NOT anon key)
AWS_ACCESS_KEY_ID          # IAM credentials for ECS/SSM
AWS_SECRET_ACCESS_KEY
AWS_REGION                 # us-west-2
ECS_CLUSTER_ARN            # Full ARN of openclaw-production cluster
ECS_TASK_DEFINITION        # Task definition name (openclaw-agent)
ECS_SUBNETS                # Comma-separated subnet IDs
ECS_SECURITY_GROUP         # Security group ID for tasks
STRIPE_SECRET_KEY          # Stripe API secret key
STRIPE_WEBHOOK_SECRET      # Stripe webhook signing secret
```
