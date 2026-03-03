import Form from '@/app/ui/users/edit-form';
import Breadcrumbs from '@/app/ui/problems/breadcrumbs';
import { fetchUserById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const user = await fetchUserById(id);

    const session = await auth();
    const role = session?.user?.role;

    if (!user) {
        notFound();
    }

    if (role !== 'admin') {
        return (
            <main>
                <h1 className="text-2xl font-bold">Unauthorized</h1>
                <p>You do not have permission to edit users.</p>
            </main>
        );
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Users', href: '/dashboard/users' },
                    {
                        label: 'Edit User',
                        href: `/dashboard/users/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form user={user} />
        </main>
    );
}
