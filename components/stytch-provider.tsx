'use client';

import { StytchB2BProvider } from '@stytch/nextjs/b2b';
import { stytchClient } from '@/lib/stytch-client';

export function StytchProvider({ children }: { children: React.ReactNode }) {
  return (
    <StytchB2BProvider stytch={stytchClient}>
      {children}
    </StytchB2BProvider>
  );
}
