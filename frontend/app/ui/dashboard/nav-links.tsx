/**
 * @file frontend/app/ui/dashboard/nav-links.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols NavLinks
 */

'use client';
import { usePathname } from 'next/navigation';
import {
  Users,
  BookOpen,
  Trophy,
  LayoutDashboard,
  SendIcon,
} from 'lucide-react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NavLinks({ role }: { role: string }) {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const normalizedPathname = pathname.replace(/^\/(en|es)(?=\/)/, '');

  const links = [
    { name: t('dashboard'), href: '/dashboard' as const, icon: LayoutDashboard },
    { name: t('problems'), href: '/dashboard/problems' as const, icon: BookOpen },
    { name: t('contests'), href: '/dashboard/contests' as const, icon: Trophy },
    { name: t('users'), href: '/dashboard/users' as const, icon: Users, trainerOnly: true },
    { name: t('submissions'), href: '/dashboard/submissions' as const, icon: SendIcon },
  ];

  return (
    <>
      {links
        .filter(link => !link.trainerOnly || (role === 'admin' || role === 'coach'))
        .map((link) => {
          const LinkIcon = link.icon;
          const isActive =
            link.href === '/dashboard'
              ? normalizedPathname === '/dashboard'
              : normalizedPathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600 md:justify-start md:p-2 md:px-3',
                {
                  'bg-blue-50 text-blue-600': isActive,
                },
              )}
            >
              <LinkIcon className="w-6 flex-shrink-0" />
              <p className="hidden truncate md:block">{link.name}</p>
            </Link>
          );
        })}
    </>
  );
}
