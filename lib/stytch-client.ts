'use client';

import { createStytchB2BUIClient } from '@stytch/nextjs/b2b/ui';

export const stytchClient = createStytchB2BUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || ''
);
