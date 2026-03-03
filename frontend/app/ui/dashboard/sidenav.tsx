import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { LogOut } from 'lucide-react';
import { signOut } from '@/auth';
import OmipsIcon from '@/app/ui/omips-icon';

export default function SideNav({ role }: { role: string }) {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-lg bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-full text-white flex items-center gap-3">
          <OmipsIcon className="w-12 md:w-28" />
          <span className="text-2xl font-bold tracking-tight">BeeperCode</span>
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks role={role} />
        <div className="hidden h-auto w-full grow rounded-lg bg-gray-50 md:block"></div>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors md:flex-none md:justify-start md:p-2 md:px-3">
            <LogOut className="w-6 flex-shrink-0" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}