import Form from '@/app/ui/problems/create-form';
import Breadcrumbs from '@/app/ui/problems/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Problem',
};

export default async function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Problems', href: '/dashboard/problems' },
                    {
                        label: 'Create Problem',
                        href: '/dashboard/problems/create',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    );
}