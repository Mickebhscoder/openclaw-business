import { NextRequest, NextResponse } from 'next/server';
import { getStytchClient } from '@/lib/stytch';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const tokenType = request.nextUrl.searchParams.get('stytch_token_type');

  if (!token || tokenType !== 'discovery') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const stytchClient = getStytchClient();

  try {
    // Authenticate the discovery magic link
    const authResp = await stytchClient.magicLinks.discovery.authenticate({
      discovery_magic_links_token: token,
    });

    const ist = authResp.intermediate_session_token;
    let sessionToken: string;

    const firstOrg = authResp.discovered_organizations[0];
    if (firstOrg) {
      // Exchange IST into existing org
      const exchangeResp = await stytchClient.discovery.intermediateSessions.exchange({
        intermediate_session_token: ist,
        organization_id: firstOrg.organization!.organization_id,
        session_duration_minutes: 60 * 24 * 7,
      });
      sessionToken = exchangeResp.session_token;
    } else {
      // Create new org
      const createResp = await stytchClient.discovery.organizations.create({
        intermediate_session_token: ist,
        session_duration_minutes: 60 * 24 * 7,
      });
      sessionToken = createResp.session_token;
    }

    // Set session cookie and redirect to dashboard
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    const secure = process.env.NODE_ENV === 'production';
    response.cookies.set('stytch_session', sessionToken, {
      path: '/',
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  } catch (error) {
    console.error('Stytch authentication error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
