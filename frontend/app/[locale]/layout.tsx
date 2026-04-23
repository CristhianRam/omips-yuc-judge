/**
 * @file frontend/app/[locale]/layout.tsx
 * @description Modulo TypeScript del proyecto.
 * @symbols N/A
 */

import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Metadata } from 'next';

export const metadata: Metadata = {
  icons: {
    icon: '/omips.svg',
  },
};

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Validate locale
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={`${inter.className} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
