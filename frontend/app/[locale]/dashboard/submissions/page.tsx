/**
 * @file frontend/app/[locale]/dashboard/submissions/page.tsx
 * @description Pagina de Next.js para la ruta '/dashboard/submissions'.
 * @symbols SubmissionsTableSkeleton
 */

import Pagination from '@/app/ui/pagination';
import SubmissionsTable from '@/app/ui/submissions/table';
import SubmissionFilters from '@/app/ui/submissions/filters';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchSubmissionsPages } from '@/app/lib/data';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Submissions',
};

export default async function Page(props: {
  searchParams?: Promise<{
    page?: string;
    verdict?: string;
    status?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const verdict = searchParams?.verdict || '';
  const status = searchParams?.status || '';

  const session = await auth();
  const userId = session?.user?.id || '';
  const t = await getTranslations('submissions');

  const totalPages = await fetchSubmissionsPages(
    verdict || undefined,
    status || undefined,
    userId || undefined,
  );

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>{t('title')}</h1>
      </div>
      <div className="mt-4 md:mt-8">
        <SubmissionFilters />
      </div>
      <Suspense key={`${currentPage}-${verdict}-${status}`} fallback={<SubmissionsTableSkeleton />}>
        <SubmissionsTable
          currentPage={currentPage}
          verdict={verdict || undefined}
          status={status || undefined}
          userId={userId || undefined}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

function SubmissionsTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center border-b border-gray-200 py-4 px-6">
                <div className="h-4 w-32 rounded bg-gray-200 mr-4"></div>
                <div className="h-4 w-24 rounded bg-gray-200 mr-4"></div>
                <div className="h-4 w-20 rounded bg-gray-200 mr-4"></div>
                <div className="h-4 w-20 rounded bg-gray-200 mr-4"></div>
                <div className="h-4 w-24 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
