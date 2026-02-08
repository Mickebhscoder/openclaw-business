'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Zap } from 'lucide-react';

export function ButtonCheckout({
  priceId,
  mode = 'subscription',
}: {
  priceId: string;
  mode?: 'payment' | 'subscription';
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          successUrl: window.location.href,
          cancelUrl: window.location.href,
          mode,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  return (
    <Button className="w-full" size="lg" onClick={handlePayment} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Zap className="mr-2 h-4 w-4" />
      )}
      Subscribe
    </Button>
  );
}
