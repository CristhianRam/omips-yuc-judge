'use client';

import { useActionState } from 'react';
import { ExclamationCircleIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { Button } from '@/app/ui/button';
import { lusitana } from '@/app/ui/fonts';
import { resendVerificationCode, verifyEmailCode } from '@/app/lib/actions';
import { useTranslations } from 'next-intl';

type VerifyEmailFormProps = {
  initialEmail?: string;
};

export default function VerifyEmailForm({ initialEmail = '' }: VerifyEmailFormProps) {
  const [verifyMessage, verifyAction, isVerifying] = useActionState(
    verifyEmailCode,
    undefined,
  );
  const [resendMessage, resendAction, isResending] = useActionState(
    resendVerificationCode,
    undefined,
  );
  const t = useTranslations('emailVerification');

  return (
    <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-5 pt-8">
      <h1 className={`${lusitana.className} mb-2 text-2xl`}>
        {t('title')}
      </h1>
      <p className="mb-4 text-sm text-gray-600">{t('subtitle')}</p>

      <form action={verifyAction} className="space-y-4">
        <input type="hidden" name="email" value={initialEmail} />

        <div>
          <label
            className="mb-3 mt-1 block text-xs font-medium text-gray-900"
            htmlFor="verify-code"
          >
            {t('code')}
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="verify-code"
              name="code"
              type="text"
              placeholder={t('codePlaceholder')}
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        <Button className="w-full" aria-disabled={isVerifying}>
          {t('verifyButton')}
        </Button>

        <div
          className="flex min-h-6 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {verifyMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{verifyMessage}</p>
            </>
          )}
        </div>
      </form>

      <form action={resendAction} className="mt-2">
        <input type="hidden" name="email" value={initialEmail} />
        <button
          type="submit"
          className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800 disabled:text-gray-400"
          disabled={isResending || !initialEmail}
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
    </div>
  );
}
