import Pagination from '@/app/ui/pagination';
import Table from '@/app/ui/contests/table';
import { CreateContest } from '@/app/ui/contests/buttons';
import { lusitana } from '@/app/ui/fonts';
import { ContestsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchContestsPages } from '@/app/lib/data';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Contests',
};

export default async function Page(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;

    const session = await auth();
    const role = session?.user?.role || 'student';

    const totalPages = await fetchContestsPages();
    const t = await getTranslations('contests');

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>{t('title')}</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <div className="flex-1" />
                {(role === 'admin' || role === 'coach') && <CreateContest />}
            </div>
            <Suspense key={currentPage} fallback={<ContestsTableSkeleton />}>
                <Table currentPage={currentPage} role={role} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}