import Link from 'next/link';
import { getAuthenticatedMember } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  Bot,
  Zap,
  Shield,
  ShieldCheck,
  ArrowRight,
  Home,
  UtensilsCrossed,
  Users,
  Megaphone,
  ShoppingBag,
  GraduationCap,
  Github,
  Clock,
  Lock,
  Server,
  KeyRound,
  Container,
  AlertTriangle,
  ChevronDown,
  Quote,
  Search,
  PenTool,
  Send,
  MessageCircle,
  BarChart3,
  Target,
} from 'lucide-react';

export default async function LandingPage() {
  const auth = await getAuthenticatedMember();
  if (auth) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <span className="font-semibold text-lg">Molinar Business</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#agents"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
            >
              The Stack
            </Link>
            <Link
              href="#use-cases"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
            >
              Use Cases
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-sm text-indigo-700 mb-8">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
              <span>6 AI agents &middot; 1 platform &middot; Your entire business on autopilot</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Six AI agents.{' '}
              <br className="hidden sm:block" />
              Zero employees.{' '}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Most founders build the product and wonder why nobody notices.
              Molinar deploys a team of AI agents that research your market, create content,
              post it, engage your audience, analyze what works, and hunt down leads — 24/7.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md text-base font-medium h-12 px-8 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors gap-2 w-full sm:w-auto"
              >
                Launch Your Agent Stack
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-sm text-muted-foreground">
                No credit card required &middot; Deploy in 60 seconds
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="border-y bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              You shipped the product. Now what?
            </h2>
            <p className="mt-4 text-muted-foreground">
              You need someone to research what&apos;s working in your market. Write content that actually resonates.
              Post it at the right times. Reply to every comment and DM. Track what&apos;s converting.
              Find and qualify leads. Follow up relentlessly.
            </p>
            <p className="mt-4 text-base font-medium text-foreground">
              That&apos;s 6 full-time jobs. Or 6 AI agents that never sleep.
            </p>
          </div>
        </div>
      </section>

      {/* The 6-Agent Stack */}
      <section id="agents" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              The 6-Agent Stack
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Each agent is specialized. Each one feeds data to the next.
              Together, they run your entire go-to-market — from research to revenue.
            </p>
          </div>

          {/* Visual flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AgentCard
              icon={<Search className="h-5 w-5" />}
              step="1"
              name="Scout"
              role="Research & Trends"
              description="Sweeps your market every few hours. Tracks competitors, finds trending content, spots pain points your customers are expressing. Feeds intel to Writer."
              color="blue"
            />
            <AgentCard
              icon={<PenTool className="h-5 w-5" />}
              step="2"
              name="Writer"
              role="Content Creation"
              description="Drafts posts, threads, and emails in your brand voice — based on real market data from Scout, not guesswork. A/B tests hooks automatically."
              color="violet"
            />
            <AgentCard
              icon={<Send className="h-5 w-5" />}
              step="3"
              name="Poster"
              role="Distribution"
              description="Publishes approved content across platforms at optimal times. Handles scheduling, hashtags, and media. Never misses a posting window."
              color="emerald"
            />
            <AgentCard
              icon={<MessageCircle className="h-5 w-5" />}
              step="4"
              name="Engage"
              role="Community & Replies"
              description="Monitors mentions, replies to comments, answers DMs, and joins relevant conversations. Builds real relationships while you sleep."
              color="amber"
            />
            <AgentCard
              icon={<BarChart3 className="h-5 w-5" />}
              step="5"
              name="Analyst"
              role="Metrics & Optimization"
              description="Tracks engagement, conversions, and growth. Identifies what's working and feeds winning patterns back to Writer. Your strategy gets smarter daily."
              color="rose"
            />
            <AgentCard
              icon={<Target className="h-5 w-5" />}
              step="6"
              name="Hunter"
              role="Lead Gen & Sales"
              description="Finds people struggling with problems you solve. Qualifies prospects, drafts personalized outreach, and builds your sales pipeline on autopilot."
              color="indigo"
            />
          </div>

          <div className="mt-12 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 p-8 text-center">
            <p className="text-lg font-semibold text-foreground">
              Scout researches → Writer creates → Poster distributes → Engage builds relationships → Analyst optimizes → Hunter converts
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              A complete flywheel. Running 24/7. Getting smarter every day.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-16 sm:py-20 bg-muted/30 border-y">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl bg-white border p-6">
              <Quote className="h-5 w-5 text-primary/40 mb-3" />
              <p className="text-sm text-foreground leading-relaxed italic">
                &ldquo;It designed my entire go-to-market strategy, manages my PR pipeline, and replaced what would&apos;ve been a 5-person team.&rdquo;
              </p>
              <p className="mt-3 text-xs text-muted-foreground">— OpenClaw user running on a single machine</p>
            </div>
            <div className="rounded-xl bg-white border p-6">
              <Quote className="h-5 w-5 text-primary/40 mb-3" />
              <p className="text-sm text-foreground leading-relaxed italic">
                &ldquo;I fully autonomized money making. I have not physically touched any marketing for my apps for a week. Money is coming in.&rdquo;
              </p>
              <p className="mt-3 text-xs text-muted-foreground">— AI-first founder, 29 days autonomous</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Works for every business that needs customers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you&apos;re a solo founder or a growing team,
              the 6-Agent Stack handles the work that keeps you from growing.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <UseCaseCard
              icon={<Home className="h-5 w-5" />}
              title="Real Estate"
              description="Scout finds active buyers. Writer drafts follow-ups. Engage handles inquiries. Hunter qualifies leads — all from Telegram."
            />
            <UseCaseCard
              icon={<UtensilsCrossed className="h-5 w-5" />}
              title="Restaurants"
              description="Poster shares daily specials. Engage responds to reviews. Analyst tracks which promotions drive reservations."
            />
            <UseCaseCard
              icon={<GraduationCap className="h-5 w-5" />}
              title="Coaches & Consultants"
              description="Writer creates thought leadership. Poster distributes it. Hunter finds prospects who need your expertise."
            />
            <UseCaseCard
              icon={<Megaphone className="h-5 w-5" />}
              title="Marketing Agencies"
              description="Spin up a 6-Agent Stack for each client. Maintain brand voice. Report results. Scale without hiring."
            />
            <UseCaseCard
              icon={<ShoppingBag className="h-5 w-5" />}
              title="E-Commerce"
              description="Scout tracks trends. Writer creates product content. Engage handles support 24/7. Analyst optimizes conversion."
            />
            <UseCaseCard
              icon={<Users className="h-5 w-5" />}
              title="SaaS & Startups"
              description="The full vibe marketing stack. Research, content, distribution, engagement, analytics, and lead gen — while you build."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28 bg-muted/30 border-y">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Three steps. Sixty seconds.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No servers. No Docker. No terminal. Just click and go.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StepCard
              step="1"
              title="Sign up"
              description="Create your account in seconds with email or Google."
            />
            <StepCard
              step="2"
              title="Enter your keys"
              description="Add your Anthropic API key and Telegram bot token. We encrypt and store them securely."
            />
            <StepCard
              step="3"
              title="Launch"
              description="Click one button. Your AI agent stack is live on Telegram in under 60 seconds."
            />
          </div>
        </div>
      </section>

      {/* Why Not DIY */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              &ldquo;Can&apos;t I just set this up myself?&rdquo;
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              You can. Most people try. Here&apos;s what they discover.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-6 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-600 mb-4">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Setup takes hours</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                VPS, SSH, Docker, Tailscale, SSL certs, firewall rules. One wrong config and your agent crashes at 3am.
              </p>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-6 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-600 mb-4">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Security is your problem</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Shared VPS hosts are already getting exploited. Your client data on a $9 server with no isolation? That&apos;s a liability.
              </p>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-6 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-600 mb-4">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Maintenance never ends</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Updates break things. Cron jobs fail silently. SSH tunnels drop. You wanted an AI team, not a second job.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-lg font-medium text-foreground">
              We handle all of this. You just click &ldquo;Launch.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 sm:py-28 bg-muted/30 border-y">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Enterprise-grade security, startup-friendly pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Every agent stack runs in its own isolated environment.
              Your data never touches anyone else&apos;s.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SecurityCard
              icon={<Container className="h-5 w-5" />}
              title="Isolated containers"
              description="Each stack runs in its own dedicated container on AWS Fargate. No shared compute, no noisy neighbors."
            />
            <SecurityCard
              icon={<KeyRound className="h-5 w-5" />}
              title="Encrypted secrets"
              description="API keys stored with AWS SSM SecureString encryption. Never logged, never shared, never exposed."
            />
            <SecurityCard
              icon={<Shield className="h-5 w-5" />}
              title="Egress-only networking"
              description="No inbound connections to your agents. They reach out to APIs — nothing reaches in."
            />
            <SecurityCard
              icon={<Lock className="h-5 w-5" />}
              title="Your keys, your control"
              description="Bring your own API key. Stop or delete anytime. We never access your conversations."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A full AI team for less than one freelancer&apos;s hourly rate.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Starter */}
            <div className="rounded-xl border bg-white shadow p-8">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Starter</p>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold tracking-tight">$49</span>
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">For small teams getting started</p>
              </div>
              <ul className="mt-8 space-y-3 text-sm">
                <PricingFeature text="Up to 3 AI agent instances" />
                <PricingFeature text="Claude Haiku model" />
                <PricingFeature text="Telegram integration" />
                <PricingFeature text="Isolated containers on AWS" />
                <PricingFeature text="Encrypted API key storage" />
                <PricingFeature text="Email support" />
              </ul>
              <div className="mt-8">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 border border-primary text-primary hover:bg-primary/5 transition-colors w-full gap-2"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            {/* Pro */}
            <div className="rounded-xl border-2 border-primary bg-white shadow-lg p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">Most Popular</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pro</p>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold tracking-tight">$149</span>
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">For growing teams that need the full stack</p>
              </div>
              <ul className="mt-8 space-y-3 text-sm">
                <PricingFeature text="Unlimited AI agent instances" />
                <PricingFeature text="Claude Sonnet & Haiku models" />
                <PricingFeature text="Full 6-Agent Stack templates" />
                <PricingFeature text="Telegram integration" />
                <PricingFeature text="Custom system prompts" />
                <PricingFeature text="Priority support" />
              </ul>
              <div className="mt-8">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors w-full gap-2"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            You bring your own Anthropic API key. Usage costs billed directly by Anthropic.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28 bg-muted/30 border-y">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-4">
            <FaqItem
              question="Do I need technical knowledge?"
              answer="No. If you can create a Telegram bot (we walk you through it) and paste an API key, you're good. No servers, no Docker, no terminal."
            />
            <FaqItem
              question="What does the 6-Agent Stack actually do?"
              answer="Scout monitors your market and competitors. Writer drafts content in your voice. Poster publishes at optimal times. Engage replies to comments and DMs. Analyst tracks what's working. Hunter finds and qualifies leads. All running 24/7, all feeding data to each other."
            />
            <FaqItem
              question="What are the API costs on top of the subscription?"
              answer="You bring your own Anthropic API key (BYOK). API usage is billed directly by Anthropic — typically $5-50/month depending on how active your agents are. We never mark up your API costs."
            />
            <FaqItem
              question="Is my business data safe?"
              answer="Each stack runs in its own isolated container on AWS Fargate with egress-only networking. Your API keys are encrypted with AWS SSM. We never access your conversations or data."
            />
            <FaqItem
              question="Can I start with fewer agents and add more later?"
              answer="Absolutely. Start with Scout and Writer to get content flowing, then add Engage, Analyst, and Hunter as you grow. The stack is modular."
            />
            <FaqItem
              question="How is this different from ChatGPT or Claude.ai?"
              answer="ChatGPT and Claude are chat interfaces you talk to. Molinar Business is a team of always-on agents that work autonomously — researching, writing, posting, engaging, analyzing, and selling while you focus on your product."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            You built the product.{' '}
            <br className="hidden sm:block" />
            Let your agents sell it.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Six AI agents. Zero employees. Your entire go-to-market on autopilot.
            Launch in 60 seconds.
          </p>
          <div className="mt-10">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md text-base font-medium h-12 px-8 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors gap-2"
            >
              Launch Your Agent Stack
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-primary text-primary-foreground">
              <Bot className="h-3 w-3" />
            </div>
            <span>Molinar Business</span>
          </div>
          <p>Built by Molinar AI</p>
        </div>
      </footer>
    </div>
  );
}

const AGENT_COLORS = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
};

function AgentCard({
  icon,
  step,
  name,
  role,
  description,
  color,
}: {
  icon: React.ReactNode;
  step: string;
  name: string;
  role: string;
  description: string;
  color: keyof typeof AGENT_COLORS;
}) {
  const c = AGENT_COLORS[color];
  return (
    <div className={`rounded-xl border ${c.border} bg-white p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${c.bg} ${c.text}`}>
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">0{step}</span>
            <h3 className="font-semibold text-lg">{name}</h3>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{role}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function UseCaseCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 hover:shadow-md transition-shadow">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-lg font-bold mb-4">
        {step}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function SecurityCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-xl border bg-white p-6 cursor-pointer">
      <summary className="flex items-center justify-between font-semibold text-foreground list-none">
        {question}
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{answer}</p>
    </details>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <svg className="h-4 w-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      <span>{text}</span>
    </li>
  );
}
