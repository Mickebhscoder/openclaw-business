import { redirect } from 'next/navigation';
import { getAuthenticatedMember } from '@/lib/auth';

export default async function Home() {
  const auth = await getAuthenticatedMember();
  if (auth) {
    redirect('/dashboard');
  }
  redirect('/login');
}
