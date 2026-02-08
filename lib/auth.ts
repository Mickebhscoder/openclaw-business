import { cookies } from 'next/headers';
import { getStytchClient } from './stytch';

export async function getAuthenticatedMember() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('stytch_session')?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const stytch = getStytchClient();
    const { member, organization } = await stytch.sessions.authenticate({
      session_token: sessionToken,
    });
    return { member, organization };
  } catch {
    return null;
  }
}
