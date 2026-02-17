import Form from '@/app/ui/problems/edit-form';
import Breadcrumbs from '@/app/ui/problems/breadcrumbs';
import { fetchProblemById, fetchTestCases } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = Number(params.id);
    const [problem, testCases] = await Promise.all([
        fetchProblemById(id),
        fetchTestCases(id),
    ]);

    const session = await auth();
    const role = session?.user?.role;

    if (!problem) {
        notFound();
    }

    if (role !== 'admin' && role !== 'coach') {
        return (
            <main>
                <h1 className="text-2xl font-bold">Unauthorized</h1>
                <p>You do not have permission to edit problems.</p>
            </main>
        );
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Problems', href: '/dashboard/problems' },
                    {
                        label: 'Edit Problem',
                        href: `/dashboard/problems/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form problem={problem} testCases={testCases} />
        </main>
    );
}
