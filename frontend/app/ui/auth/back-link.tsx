/**
 * @file frontend/app/ui/auth/back-link.tsx
 * @description Componente reutilizable para volver a la pantalla anterior de auth.
 * @symbols AuthBackLink
 */

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from '@/i18n/navigation';

type AuthBackLinkProps = {
  href: string;
  label: string;
};

export default function AuthBackLink({ href, label }: AuthBackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 self-start rounded-md px-1 py-1 text-sm font-medium text-gray-600 transition-colors hover:text-blue-700"
      aria-label={label}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}
