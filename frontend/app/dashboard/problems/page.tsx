import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import ProblemsTable from '@/app/ui/problems/table';
import { CreateProblem } from '@/app/ui/problems/buttons'; // Assuming button components exist
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Problems | KarelJudge',
};

import { auth } from '@/auth';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const session = await auth();
  const role = session?.user?.role;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Problem Bank</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search problems (e.g. 'Loops')..." />
        {(role === 'admin' || role === 'coach') && <CreateProblem />}
      </div>
      <Suspense key={query + currentPage} fallback={<div>Loading problems...</div>}>
        <ProblemsTable />
      </Suspense>
    </div>
  );
}