/**
 * @file frontend/app/[locale]/dashboard/contests/create/page.tsx
 * @description Pagina de Next.js para la ruta '/dashboard/contests/create'.
 * @symbols Page
 */

import Breadcrumbs from '@/app/ui/problems/breadcrumbs';
import CreateContestForm from '@/app/ui/contests/create-form';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Create Contest',
};

export default async function Page() {
    const t = await getTranslations('contests');
    const tf = await getTranslations('contests.form');
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: t('title'), href: '/dashboard/contests' },
                    {
                        label: tf('createContest'),
                        href: '/dashboard/contests/create',
                        active: true,
                    },
                ]}
            />
            <CreateContestForm />
        </main>
    );
}
