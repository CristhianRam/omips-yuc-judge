/**
 * @file frontend/app/[locale]/dashboard/contests/[id]/edit/page.tsx
 * @description Pagina de Next.js para la ruta '/dashboard/contests/[id]/edit'.
 * @symbols N/A
 */

import Breadcrumbs from '@/app/ui/problems/breadcrumbs';
import EditContestForm from '@/app/ui/contests/edit-form';
import { fetchContestById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Edit Contest',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = Number(params.id);
    const result = await fetchContestById(id);

    if (!result || result === 'forbidden') {
        notFound();
    }

    const contest = result;
    const t = await getTranslations('contests');
    const tf = await getTranslations('contests.form');

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: t('title'), href: '/dashboard/contests' },
                    { label: contest.title, href: `/dashboard/contests/${id}` },
                    {
                        label: tf('updateContest'),
                        href: `/dashboard/contests/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <EditContestForm contest={contest} />
        </main>
    );
}
