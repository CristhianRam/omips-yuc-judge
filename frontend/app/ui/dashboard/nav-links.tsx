'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  BookOpen,
  Trophy,
  LayoutDashboard,
  PaperclipIcon,
  SendIcon,
} from 'lucide-react';
import clsx from 'clsx';

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Problems', href: '/dashboard/problems', icon: BookOpen },
  { name: 'Contests', href: '/dashboard/contests', icon: Trophy },
  { name: 'Users', href: '/dashboard/users', icon: Users, trainerOnly: true },
  { name: 'Submissions', href: '/dashboard/submissions', icon: SendIcon }
];

export default function NavLinks({ role }: { role: string }) {
  const pathname = usePathname();
  return (
    <>
      {links
        .filter(link => !link.trainerOnly || (role === 'admin' || role === 'coach'))
        .map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'flex h-[48px] grow items-center justify-center gap-2 rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors md:flex-none md:justify-start md:p-2 md:px-3',
                {
                  'bg-blue-50 text-blue-600': pathname === link.href,
                },
              )}
            >
              <LinkIcon className="w-6 flex-shrink-0" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
          );
        })}
    </>
  );
}
