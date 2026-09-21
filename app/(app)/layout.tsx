import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { MobileNav } from '@/components/mobile-nav';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (!session.storeId) {
    redirect('/setup');
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {children}
      <MobileNav />
    </div>
  );
}
