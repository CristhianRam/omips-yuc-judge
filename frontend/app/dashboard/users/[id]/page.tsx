import Breadcrumbs from '@/app/ui/problems/breadcrumbs';
import Pagination from '@/app/ui/pagination';
import SubmissionsTable from '@/app/ui/submissions/table';
import { fetchUserById, fetchSubmissionsPages } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { auth } from '@/auth';
import clsx from 'clsx';

export default async function Page(props: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{
        page?: string;
        verdict?: string;
        status?: string;
    }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const userId = params.id;
    const currentPage = Number(searchParams?.page) || 1;
    const verdict = searchParams?.verdict || '';
    const status = searchParams?.status || '';

    const session = await auth();
    const role = session?.user?.role || 'student';

    // Only admin and coach can see this page
    if (role !== 'admin' && role !== 'coach') {
        return (
            <div className="w-full">
                <p className="mt-4 text-gray-500">You don&apos;t have permission to view this page.</p>
            </div>
        );
    }

    const user = await fetchUserById(userId);

    if (!user) {
        notFound();
    }

    const totalPages = await fetchSubmissionsPages(
        verdict || undefined,
        status || undefined,
        userId,
    );

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Users', href: '/dashboard/users' },
                    {
                        label: user.username,
                        href: `/dashboard/users/${userId}`,
                        active: true,
                    },
                ]}
            />

            {/* User Info Card */}
            <div className="rounded-md bg-gray-50 p-4 md:p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">{user.username}</h2>
                        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                    </div>
                    <span className={clsx(
                        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium uppercase',
                        {
                            'bg-purple-100 text-purple-800': user.role === 'admin',
                            'bg-blue-100 text-blue-800': user.role === 'coach',
                            'bg-gray-100 text-gray-800': user.role === 'student',
                        }
                    )}>
                        {user.role}
                    </span>
                </div>
            </div>

            {/* User's Submissions */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Submissions</h3>
                <Suspense key={`${currentPage}-${verdict}-${status}`} fallback={<SubmissionsSkeletonSmall />}>
                    <SubmissionsTable
                        currentPage={currentPage}
                        verdict={verdict || undefined}
                        status={status || undefined}
                        userId={userId}
                    />
                </Suspense>
                <div className="mt-5 flex w-full justify-center">
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
        </main>
    );
}

function SubmissionsSkeletonSmall() {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="animate-pulse">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center border-b border-gray-200 py-4 px-6">
                                <div className="h-4 w-32 rounded bg-gray-200 mr-4"></div>
                                <div className="h-4 w-24 rounded bg-gray-200 mr-4"></div>
                                <div className="h-4 w-20 rounded bg-gray-200"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
