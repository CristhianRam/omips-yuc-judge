/**
 * @file frontend/app/[locale]/dashboard/users/[id]/edit/page.tsx
 * @description Pagina de Next.js para la ruta '/dashboard/users/[id]/edit'.
 * @symbols N/A
 */

import Form from '@/app/ui/users/edit-form';
import Breadcrumbs from '@/app/ui/problems/breadcrumbs';
import { fetchUserById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const user = await fetchUserById(id);

    const session = await auth();
    const role = session?.user?.role;
    const t = await getTranslations('users');

    if (!user) {
        notFound();
    }

    if (role !== 'admin') {
        return (
            <main>
                <h1 className="text-2xl font-bold">{t('unauthorized')}</h1>
                <p>{t('unauthorizedEdit')}</p>
            </main>
        );
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: t('title'), href: '/dashboard/users' },
                    { label: t('editUser'), href: `/dashboard/users/${id}/edit`, active: true },
                ]}
            />
            <Form user={user} />
        </main>
    );
}
