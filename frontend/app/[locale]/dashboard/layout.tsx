/**
 * @file frontend/app/[locale]/dashboard/layout.tsx
 * @description Layout de Next.js para la ruta '/dashboard'.
 * @symbols N/A
 */

import SideNav from '@/app/ui/dashboard/sidenav';

import { auth } from '@/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role || 'student';
  const username = session?.user?.username || '';

  return (
    <div className="flex min-h-screen flex-col md:h-screen md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav role={role} username={username} />
      </div>
      <div className="grow p-4 sm:p-6 md:overflow-y-auto md:p-10 lg:p-12">{children}</div>
    </div>
  );
}
