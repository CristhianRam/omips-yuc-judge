/**
 * @file frontend/app/[locale]/dashboard/users/page.tsx
 * @description Pagina de Next.js para la ruta '/dashboard/users'.
 * @symbols UsersTableSkeleton
 */

import Pagination from '@/app/ui/pagination';
import UsersTable from '@/app/ui/users/table';
import UserFilters from '@/app/ui/users/filters';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchUsersPages } from '@/app/lib/data';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Users',
};

export default async function Page(props: {
    searchParams?: Promise<{
        page?: string;
        role?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;
    const roleFilter = searchParams?.role || '';

    const session = await auth();
    const role = session?.user?.role || 'student';
    const t = await getTranslations('users');

    // Only admin and coach can see this page
    if (role !== 'admin' && role !== 'coach') {
        return (
            <div className="w-full">
                <h1 className={`${lusitana.className} text-2xl`}>{t('accessDenied')}</h1>
                <p className="mt-4 text-gray-500">{t('noPermission')}</p>
            </div>
        );
    }

    const totalPages = await fetchUsersPages(roleFilter || undefined);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>{t('title')}</h1>
            </div>
            <div className="mt-4 md:mt-8">
                <UserFilters />
            </div>
            <Suspense key={`${currentPage}-${roleFilter}`} fallback={<UsersTableSkeleton />}>
                <UsersTable currentPage={currentPage} role={roleFilter || undefined} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}

function UsersTableSkeleton() {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="animate-pulse">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center border-b border-gray-200 py-4 px-6">
                                <div className="h-4 w-32 rounded bg-gray-200 mr-4"></div>
                                <div className="h-4 w-48 rounded bg-gray-200 mr-4"></div>
                                <div className="h-4 w-20 rounded bg-gray-200"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
