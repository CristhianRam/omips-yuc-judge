/**
 * @file frontend/app/[locale]/dashboard/problems/create/page.tsx
 * @description Pagina de Next.js para la ruta '/dashboard/problems/create'.
 * @symbols N/A
 */

import Form from '@/app/ui/problems/create-form';
import Breadcrumbs from '@/app/ui/problems/breadcrumbs';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Create Problem',
};

export default async function Page() {
    const t = await getTranslations('problemDetail');

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: t('problems'), href: '/dashboard/problems' },
                    {
                        label: t('createProblem'),
                        href: '/dashboard/problems/create',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    );
}
