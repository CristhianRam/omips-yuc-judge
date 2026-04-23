/**
 * @file frontend/app/[locale]/dashboard/problems/[id]/edit/page.tsx
 * @description Pagina de Next.js para la ruta '/dashboard/problems/[id]/edit'.
 * @symbols N/A
 */

import Form from '@/app/ui/problems/edit-form';
import Breadcrumbs from '@/app/ui/problems/breadcrumbs';
import { fetchProblemById, fetchTestCases } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = Number(params.id);
    const [problem, testCases] = await Promise.all([
        fetchProblemById(id),
        fetchTestCases(id),
    ]);

    const session = await auth();
    const role = session?.user?.role;
    const t = await getTranslations('problemDetail');
    const tu = await getTranslations('users');

    if (!problem) {
        notFound();
    }

    if (role !== 'admin' && role !== 'coach') {
        return (
            <main>
                <h1 className="text-2xl font-bold">{tu('unauthorized')}</h1>
                <p>{t('unauthorizedEdit')}</p>
            </main>
        );
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: t('problems'), href: '/dashboard/problems' },
                    {
                        label: t('editProblem'),
                        href: `/dashboard/problems/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form problem={problem} testCases={testCases} />
        </main>
    );
}
