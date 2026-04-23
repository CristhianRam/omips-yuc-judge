/**
 * @file frontend/app/[locale]/dashboard/users/[id]/page.tsx
 * @description Pagina de Next.js para la ruta '/dashboard/users/[id]'.
 * @symbols SubmissionsSkeletonSmall
 */

import Breadcrumbs from '@/app/ui/problems/breadcrumbs';
import Pagination from '@/app/ui/pagination';
import SubmissionsTable from '@/app/ui/submissions/table';
import { fetchUserById, fetchSubmissionsPages } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { auth } from '@/auth';
import clsx from 'clsx';
import { getTranslations } from 'next-intl/server';

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
    const t = await getTranslations('users');

    if (role !== 'admin' && role !== 'coach') {
        return (
            <div className="w-full">
                <p className="mt-4 text-gray-500">{t('noPermission')}</p>
            </div>
        );
    }

    const user = await fetchUserById(userId);

    if (!user) {
        notFound();
    }

    const totalPages = await fetchSubmissionsPages(verdict || undefined, status || undefined, userId);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: t('title'), href: '/dashboard/users' },
                    { label: user.username, href: `/dashboard/users/${userId}`, active: true },
                ]}
            />

            <div className="mb-6 rounded-md bg-gray-50 p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h2 className="truncate text-xl font-bold">{user.username}</h2>
                        <p className="mt-1 truncate text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span
                        className={clsx(
                            'inline-flex items-center self-start rounded-full px-3 py-1 text-sm font-medium uppercase',
                            {
                                'bg-purple-100 text-purple-800': user.role === 'admin',
                                'bg-blue-100 text-blue-800': user.role === 'coach',
                                'bg-gray-100 text-gray-800': user.role === 'student',
                            },
                        )}
                    >
                        {user.role}
                    </span>
                </div>
            </div>

            <div>
                <h3 className="mb-2 text-lg font-semibold">{t('detailsSubmissions')}</h3>
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
                            <div key={i} className="flex items-center border-b border-gray-200 px-6 py-4">
                                <div className="mr-4 h-4 w-32 rounded bg-gray-200"></div>
                                <div className="mr-4 h-4 w-24 rounded bg-gray-200"></div>
                                <div className="h-4 w-20 rounded bg-gray-200"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
