/**
 * @file frontend/app/[locale]/dashboard/problems/page.tsx
 * @description Pagina de Next.js para la ruta '/dashboard/problems'.
 * @symbols N/A
 */

import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import ProblemFilters from '@/app/ui/problems/filters';
import Table from '@/app/ui/problems/table';
import { CreateProblem } from '@/app/ui/problems/buttons';
import { lusitana } from '@/app/ui/fonts';
import { ProblemsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchProblemsPages } from '@/app/lib/data';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Problems',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    difficulty?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const difficulty = searchParams?.difficulty || '';

  const session = await auth();
  const role = session?.user?.role || 'student';

  const totalPages = await fetchProblemsPages(query, difficulty || undefined);
  const t = await getTranslations('problems');

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>{t('title')}</h1>
      </div>
      <div className="mt-4 flex flex-col gap-3 md:mt-8">
        <div className="w-full max-w-xl">
          <Search placeholder={t('searchPlaceholder')} />
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <ProblemFilters />
          {(role === 'admin' || role === 'coach') && <CreateProblem />}
        </div>
      </div>
      <Suspense key={query + currentPage + difficulty} fallback={<ProblemsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} role={role} difficulty={difficulty || undefined} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
