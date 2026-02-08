import Link from 'next/link';
import { getAuthenticatedMember } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  Bot,
  Zap,
  Shield,
  ArrowRight,
  Home,
  UtensilsCrossed,
  Users,
  Megaphone,
  ShoppingBag,
  GraduationCap,
  Star,
  Github,
  Clock,
  MessageCircle,
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
            <span className="font-semibold text-lg">OpenClaw Business</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
            >
              Pricing
            </Link>
            <Link
              href="#use-cases"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
            >
              Use Cases
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
              <Star className="h-3.5 w-3.5 fill-indigo-500 text-indigo-500" />
              <span>176K+ GitHub stars &middot; Open source &middot; Powered by Claude</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Your AI assistant.{' '}
              <br className="hidden sm:block" />
              On Telegram.{' '}
              <span className="text-primary">In 60 seconds.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Save hours every week with your own AI assistant that handles scheduling,
              follow-ups, customer questions, and daily busywork — all through Telegram.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md text-base font-medium h-12 px-8 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors gap-2 w-full sm:w-auto"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-sm text-muted-foreground">
                No credit card required &middot; $9/mo after trial
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span><strong className="text-foreground">176K+</strong> GitHub Stars</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span><strong className="text-foreground">500+</strong> Contributors</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>Runs on <strong className="text-foreground">Telegram</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Powered by <strong className="text-foreground">Claude</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Built for how you actually work
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Business owners, freelancers, and teams use OpenClaw to automate the tasks
              that eat up their day.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <UseCaseCard
              icon={<Home className="h-5 w-5" />}
              title="Real Estate"
              description="Draft follow-up messages to leads, summarize property details, and manage showing reminders — all from Telegram."
            />
            <UseCaseCard
              icon={<UtensilsCrossed className="h-5 w-5" />}
              title="Restaurants"
              description="Handle reservation confirmations, respond to online reviews, and post daily specials to social media."
            />
            <UseCaseCard
              icon={<GraduationCap className="h-5 w-5" />}
              title="Coaches & Consultants"
              description="Send session prep questions, follow up with action items, and handle scheduling — hands-free."
            />
            <UseCaseCard
              icon={<Megaphone className="h-5 w-5" />}
              title="Marketing Agencies"
              description="Spin up a dedicated AI assistant for each client. Maintain brand voice across accounts."
            />
            <UseCaseCard
              icon={<ShoppingBag className="h-5 w-5" />}
              title="E-Commerce"
              description="Answer shipping questions, handle return policies, and manage customer support 24/7."
            />
            <UseCaseCard
              icon={<Users className="h-5 w-5" />}
              title="Teams"
              description="Give every department their own AI assistant — sales, support, ops, engineering."
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
              description="Click one button. Your AI assistant is live on Telegram in under 60 seconds."
            />
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Clock className="h-5 w-5" />}
              title="Save hours every week"
              description="Stop doing repetitive tasks manually. Your AI assistant handles follow-ups, scheduling, and customer questions around the clock."
            />
            <ValueCard
              icon={<Shield className="h-5 w-5" />}
              title="Secure & isolated"
              description="Each instance runs in its own container on AWS. API keys are encrypted. No shared resources between customers."
            />
            <ValueCard
              icon={<Zap className="h-5 w-5" />}
              title="Always on"
              description="Your assistant runs 24/7 on enterprise-grade infrastructure. No server to babysit, no downtime to worry about."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-28 bg-muted/30 border-y">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Simple pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              One plan. Everything included. Scale as you grow.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="rounded-xl border bg-white shadow-lg p-8">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Per instance</p>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold tracking-tight">$9</span>
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Free trial included</p>
              </div>
              <ul className="mt-8 space-y-3 text-sm">
                <PricingFeature text="Instant deployment on AWS" />
                <PricingFeature text="Isolated secure container" />
                <PricingFeature text="Encrypted API key storage" />
                <PricingFeature text="24/7 uptime" />
                <PricingFeature text="Web dashboard to manage instances" />
                <PricingFeature text="Launch multiple instances" />
                <PricingFeature text="Start, stop, reconfigure anytime" />
              </ul>
              <div className="mt-8">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors w-full gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                You bring your own Anthropic API key. Usage costs billed directly by Anthropic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to save hours every week?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Join thousands of business owners, freelancers, and teams who use OpenClaw
            to get more done with less effort.
          </p>
          <div className="mt-10">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md text-base font-medium h-12 px-8 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors gap-2"
            >
              Get Started Free
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
            <span>OpenClaw Business</span>
          </div>
          <p>Built by Molinar AI</p>
        </div>
      </footer>
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

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center px-4">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
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
