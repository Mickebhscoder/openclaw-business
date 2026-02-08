'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function AuthenticateHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const tokenType = searchParams.get('stytch_token_type');

    if (token && tokenType) {
      window.location.href = `/api/auth/callback?token=${token}&stytch_token_type=${tokenType}`;
    }
  }, [searchParams]);

  return null;
}

export default function AuthenticatePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
      <Suspense>
        <AuthenticateHandler />
      </Suspense>
    </div>
  );
}
