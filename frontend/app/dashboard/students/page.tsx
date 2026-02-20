import Pagination from '@/app/ui/pagination';
import StudentsTable from '@/app/ui/students/table';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchUsersPages } from '@/app/lib/data';
import { Metadata } from 'next';
import { auth } from '@/auth';

export const metadata: Metadata = {
    title: 'Students',
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

    // Only admin and coach can see this page
    if (role !== 'admin' && role !== 'coach') {
        return (
            <div className="w-full">
                <h1 className={`${lusitana.className} text-2xl`}>Access Denied</h1>
                <p className="mt-4 text-gray-500">You don&apos;t have permission to view this page.</p>
            </div>
        );
    }

    const totalPages = await fetchUsersPages();

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Students</h1>
            </div>
            <Suspense key={currentPage} fallback={<StudentsTableSkeleton />}>
                <StudentsTable currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}

function StudentsTableSkeleton() {
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