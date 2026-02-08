import * as stytch from 'stytch';

let client: stytch.B2BClient | undefined;

export function getStytchClient(): stytch.B2BClient {
  if (!client) {
    client = new stytch.B2BClient({
      project_id: process.env.STYTCH_PROJECT_ID || '',
      secret: process.env.STYTCH_SECRET || '',
    });
  }
  return client;
}
