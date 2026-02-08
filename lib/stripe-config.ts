export interface StripePlan {
  priceId: string;
  name: string;
  description: string;
  price: number;
  priceAnchor?: number;
  isFeatured?: boolean;
  mode: 'subscription';
  features: { name: string }[];
}

export const stripeConfig = {
  plans: [
    {
      priceId:
        process.env.NODE_ENV === 'development'
          ? 'price_dev_starter'
          : 'price_prod_starter',
      name: 'Starter',
      description: 'For small teams getting started with AI agents',
      price: 49,
      mode: 'subscription' as const,
      features: [
        { name: 'Up to 3 AI agent instances' },
        { name: 'Claude Haiku model' },
        { name: 'Telegram integration' },
        { name: 'Email support' },
      ],
    },
    {
      priceId:
        process.env.NODE_ENV === 'development'
          ? 'price_dev_pro'
          : 'price_prod_pro',
      name: 'Pro',
      description: 'For growing teams that need more power',
      price: 149,
      priceAnchor: 199,
      isFeatured: true,
      mode: 'subscription' as const,
      features: [
        { name: 'Unlimited AI agent instances' },
        { name: 'Claude Sonnet & Haiku models' },
        { name: 'Telegram integration' },
        { name: 'Priority support' },
        { name: 'Custom system prompts' },
        { name: 'Advanced analytics (coming soon)' },
      ],
    },
  ] satisfies StripePlan[],
};
