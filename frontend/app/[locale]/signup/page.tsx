/**
 * @file frontend/app/[locale]/signup/page.tsx
 * @description Pagina de Next.js para la ruta '/signup'.
 * @symbols SignupPage
 */

import AcmeLogo from "@/app/ui/acme-logo";
import AuthBackLink from '@/app/ui/auth/back-link';
import SignupForm from "@/app/ui/signup-form";
import { getTranslations } from 'next-intl/server';

export default async function SignupPage() {
    const t = await getTranslations('common');

    return (
        <main className="flex min-h-screen items-start justify-center p-4 md:items-center">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5">
                <AuthBackLink href="/login" label={t('back')} />
                <div className="flex h-16 w-full items-end rounded-lg bg-blue-500 px-4 pb-3 md:h-28">
                    <div className="w-28 text-white md:w-32">
                        <AcmeLogo />
                    </div>
                </div>
                <SignupForm />
            </div>
        </main>
    );
}
