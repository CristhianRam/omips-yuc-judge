import Breadcrumbs from '@/app/ui/problems/breadcrumbs';
import CreateContestForm from '@/app/ui/contests/create-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Contest',
};

export default function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Contests', href: '/dashboard/contests' },
                    {
                        label: 'Create Contest',
                        href: '/dashboard/contests/create',
                        active: true,
                    },
                ]}
            />
            <CreateContestForm />
        </main>
    );
}
