import { NextResponse } from 'next/server';
import { getStytchClient } from '@/lib/stytch';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('stytch_session')?.value;

  if (sessionToken) {
    try {
      const stytchClient = getStytchClient();
      await stytchClient.sessions.revoke({ session_token: sessionToken });
    } catch (e) {
      // Session may already be expired, that's fine
      console.error('Failed to revoke Stytch session:', e);
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('stytch_session', '', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });
  return response;
}
