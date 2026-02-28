import Breadcrumbs from '@/app/ui/problems/breadcrumbs';
import EditContestForm from '@/app/ui/contests/edit-form';
import { fetchContestById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

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

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Contests', href: '/dashboard/contests' },
                    { label: contest.title, href: `/dashboard/contests/${id}` },
                    {
                        label: 'Edit',
                        href: `/dashboard/contests/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <EditContestForm contest={contest} />
        </main>
    );
}
