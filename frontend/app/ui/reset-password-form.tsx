/**
 * @file frontend/app/ui/reset-password-form.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols ResetPasswordForm
 */

'use client';

import { useActionState } from 'react';
import { AtSymbolIcon, ExclamationCircleIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { Button } from '@/app/ui/button';
import { lusitana } from '@/app/ui/fonts';
import { resendPasswordResetCode, resetPassword } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type ResetPasswordFormProps = {
  initialEmail?: string;
};

export default function ResetPasswordForm({ initialEmail = '' }: ResetPasswordFormProps) {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email')?.trim() || '';
  const sent = searchParams.get('sent') === '1';
  const effectiveEmail = (initialEmail || emailFromQuery).trim();
  const hasEmail = effectiveEmail.length > 0;

  const [resetMessage, resetAction, isResetting] = useActionState(
    resetPassword,
    undefined,
  );
  const [resendMessage, resendAction, isResending] = useActionState(
    resendPasswordResetCode,
    undefined,
  );

  const t = useTranslations('passwordReset');

  return (
    <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-5 pt-8">
      <h1 className={`${lusitana.className} mb-2 text-2xl`}>
        {t('title')}
      </h1>
      <p className="mb-4 text-sm text-gray-600">{t('subtitle')}</p>

      {sent && (
        <div className="mb-3 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {t('sentSuccess')}
        </div>
      )}

      <form action={resetAction} className="space-y-4">
        <input type="hidden" name="email" value={effectiveEmail} />

        <div>
          <label className="mb-2 block text-xs font-medium text-gray-900" htmlFor="reset-email">
            {t('email')}
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 bg-gray-100 py-[9px] pl-10 text-sm text-gray-700 outline-2 placeholder:text-gray-500"
              id="reset-email"
              type="email"
              name="email_preview"
              value={effectiveEmail}
              readOnly
              aria-readonly="true"
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-gray-900" htmlFor="reset-code">
            {t('code')}
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="reset-code"
              name="code"
              type="text"
              placeholder={t('codePlaceholder')}
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              disabled={!hasEmail}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-gray-900" htmlFor="new-password">
            {t('newPassword')}
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="new-password"
              name="newPassword"
              type="password"
              placeholder={t('newPasswordPlaceholder')}
              minLength={6}
              autoComplete="new-password"
              required
              disabled={!hasEmail}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-gray-900" htmlFor="confirm-password-reset">
            {t('confirmPassword')}
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="confirm-password-reset"
              name="confirmPassword"
              type="password"
              placeholder={t('confirmPasswordPlaceholder')}
              minLength={6}
              autoComplete="new-password"
              required
              disabled={!hasEmail}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        <Button
          className="h-11 w-full justify-center rounded-xl text-base font-semibold"
          aria-disabled={isResetting || !hasEmail}
          disabled={isResetting || !hasEmail}
        >
          {isResetting ? t('submitPending') : t('submit')}
        </Button>

        <div className="flex min-h-6 items-end space-x-1" aria-live="polite" aria-atomic="true">
          {resetMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{resetMessage}</p>
            </>
          )}
          {!hasEmail && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{t('missingEmail')}</p>
            </>
          )}
        </div>
      </form>

      <form action={resendAction} className="mt-2">
        <input type="hidden" name="email" value={effectiveEmail} />
        <button
          type="submit"
          className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800 disabled:text-gray-400"
          disabled={isResending || !hasEmail}
        >
          <ArrowPathIcon className="mr-2 h-4 w-4" />
          {t('resendButton')}
        </button>
      </form>

      <div className="mt-2 min-h-5" aria-live="polite" aria-atomic="true">
        {resendMessage && (
          <p className="flex items-center text-sm text-green-700">
            <CheckBadgeIcon className="mr-1 h-4 w-4" />
            {resendMessage}
          </p>
        )}
      </div>

      <Link href="/login" className="mt-2 inline-block text-sm text-blue-700 hover:text-blue-800 hover:underline">
        {t('backToLogin')}
      </Link>
    </div>
  );
}
