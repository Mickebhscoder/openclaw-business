'use client';

import { stripeConfig } from '@/lib/stripe-config';
import { ButtonCheckout } from './button-checkout';
import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function Pricing() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Plans & Pricing</h2>
        <p className="text-muted-foreground">Choose the plan that fits your team</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {stripeConfig.plans.map((plan) => (
          <Card
            key={plan.priceId}
            className={plan.isFeatured ? 'border-primary shadow-lg relative' : 'relative'}
          >
            {plan.isFeatured && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                POPULAR
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                {plan.priceAnchor && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${plan.priceAnchor}
                  </span>
                )}
                <span className="text-4xl font-extrabold">${plan.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <ButtonCheckout priceId={plan.priceId} mode={plan.mode} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
