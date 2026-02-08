import { redirect } from 'next/navigation';
import { getAuthenticatedMember } from '@/lib/auth';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { SidebarProvider } from '@/components/ui/sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const auth = await getAuthenticatedMember();
  if (!auth) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar organization={auth.organization} member={auth.member} />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6"><div className="max-w-6xl mx-auto w-full">{children}</div></main>
        </div>
      </div>
    </SidebarProvider>
  );
}
