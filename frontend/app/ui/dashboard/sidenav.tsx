/**
 * @file frontend/app/ui/dashboard/sidenav.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols N/A
 */

import NavLinks from '@/app/ui/dashboard/nav-links';
import { LogOut, User } from 'lucide-react';
import { signOut } from '@/auth';
import OmipsIcon from '@/app/ui/omips-icon';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '@/app/ui/language-switcher';

export default async function SideNav({ role, username }: { role: string; username: string }) {
  const t = await getTranslations('common');
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
      <div className="mb-2 rounded-lg bg-blue-600/90 p-2 md:hidden">
        <LanguageSwitcher />
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:flex md:flex-1 md:flex-col md:gap-2">
        <NavLinks role={role} />
      </div>
      <div className="mt-2 hidden h-auto w-full grow rounded-lg bg-gray-50 md:block">
        <div className="p-3">
          <LanguageSwitcher />
        </div>
      </div>
      {/* User info + Sign out */}
      <div className="mt-2 flex flex-col gap-1">
        {username && (
          <div className="hidden items-center gap-2 rounded-lg bg-gray-50 p-2 px-3 md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="truncate">
              <p className="truncate text-sm font-medium text-gray-900">{username}</p>
              <p className="text-xs capitalize text-gray-500">{role}</p>
            </div>
          </div>
        )}
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button className="flex h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 md:justify-start md:p-2 md:px-3">
            <LogOut className="w-6 flex-shrink-0" />
            <div className="hidden md:block">{t('signOut')}</div>
            <div className="md:hidden">{t('signOut')}</div>
          </button>
        </form>
      </div>
    </div>
  );
}
