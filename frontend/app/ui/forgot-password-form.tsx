/**
 * @file frontend/app/ui/forgot-password-form.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols ForgotPasswordForm
 */

'use client';

import { useActionState } from 'react';
import { AtSymbolIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { lusitana } from '@/app/ui/fonts';
import { forgotPassword } from '@/app/lib/actions';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordForm() {
  const [message, formAction, isPending] = useActionState(
    forgotPassword,
    undefined,
  );
  const t = useTranslations('forgotPassword');
  const tLogin = useTranslations('login');

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-2 text-2xl`}>
          {t('title')}
        </h1>
        <p className="mb-4 text-sm text-gray-600">{t('subtitle')}</p>

        <label
          className="mb-3 mt-1 block text-xs font-medium text-gray-900"
          htmlFor="forgot-email"
        >
          {t('email')}
        </label>
        <div className="relative">
          <input
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            id="forgot-email"
            type="email"
            name="email"
            placeholder={t('emailPlaceholder')}
            required
            autoComplete="email"
          />
          <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>

        <Button className="mt-4 h-11 w-full justify-center rounded-xl text-base font-semibold" aria-disabled={isPending} disabled={isPending}>
          {isPending ? t('submitPending') : t('submit')}
        </Button>

        <div
          className="mt-3 flex min-h-6 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {message && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{message}</p>
            </>
          )}
        </div>

        <Link
          href="/signup"
          className="mt-2 flex h-11 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-100"
        >
          {tLogin('createAccountButton')}
        </Link>
      </div>
    </form>
  );
}
