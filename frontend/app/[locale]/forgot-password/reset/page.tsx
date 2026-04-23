/**
 * @file frontend/app/[locale]/forgot-password/reset/page.tsx
 * @description Pagina de Next.js para la ruta '/forgot-password/reset'.
 * @symbols ResetPasswordPage
 */

import AcmeLogo from '@/app/ui/acme-logo';
import AuthBackLink from '@/app/ui/auth/back-link';
import ResetPasswordForm from '@/app/ui/reset-password-form';
import { getTranslations } from 'next-intl/server';

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    email?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const t = await getTranslations('common');
  const resolvedSearchParams = await searchParams;
  const initialEmail =
    typeof resolvedSearchParams?.email === 'string'
      ? resolvedSearchParams.email
      : '';

  return (
    <main className="flex min-h-screen items-start justify-center p-4 md:items-center">
      <div className="relative mx-auto flex w-full max-w-[420px] flex-col space-y-2.5">
        <AuthBackLink href="/forgot-password" label={t('back')} />
        <div className="flex h-16 w-full items-end rounded-lg bg-blue-500 px-4 pb-3 md:h-28">
          <div className="w-28 text-white md:w-32">
            <AcmeLogo />
          </div>
        </div>
        <ResetPasswordForm initialEmail={initialEmail} />
      </div>
    </main>
  );
}
