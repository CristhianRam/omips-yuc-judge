import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/problems/table';
import { CreateProblem } from '@/app/ui/problems/buttons';
import { lusitana } from '@/app/ui/fonts';
import { ProblemsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchProblemsPages } from '@/app/lib/data';
import { Metadata } from 'next';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'Problems',
};


export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const session = await auth();
  const role = session?.user?.role || 'student';

  const totalPages = await fetchProblemsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Problems</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search problems..." />
        {(role === 'admin' || role === 'coach') && <CreateProblem />}
      </div>
      <Suspense key={query + currentPage} fallback={<ProblemsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} role={role} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}