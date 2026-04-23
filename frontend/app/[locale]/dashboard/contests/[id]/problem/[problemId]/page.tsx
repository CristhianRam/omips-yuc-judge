/**
 * @file frontend/app/[locale]/dashboard/contests/[id]/problem/[problemId]/page.tsx
 * @description Pagina de Next.js para la ruta '/dashboard/contests/[id]/problem/[problemId]'.
 * @symbols N/A
 */

import Breadcrumbs from '@/app/ui/problems/breadcrumbs';
import { fetchProblemById, fetchContestById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import ContestSubmitForm from '@/app/ui/contests/contest-submit-form';
import SubmissionsList from '@/app/ui/problems/submissions-list';
import MarkdownRenderer from '@/app/ui/markdown-renderer';
import { getTranslations } from 'next-intl/server';

export default async function Page(props: {
    params: Promise<{ id: string; problemId: string }>;
}) {
    const params = await props.params;
    const contestId = Number(params.id);
    const problemId = Number(params.problemId);

    const [contestResult, problem] = await Promise.all([
        fetchContestById(contestId),
        fetchProblemById(problemId),
    ]);

    if (!contestResult || contestResult === 'forbidden' || !problem) {
        notFound();
    }

    const contest = contestResult;
    const tc = await getTranslations('contests');
    const tp = await getTranslations('problemDetail');

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: tc('title'), href: '/dashboard/contests' },
                    { label: contest.title, href: `/dashboard/contests/${contestId}` },
                    {
                        label: problem.title,
                        href: `/dashboard/contests/${contestId}/problem/${problemId}`,
                        active: true,
                    },
                ]}
            />

            <div className="mb-6 rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h1 className="break-words text-2xl font-bold">{problem.title}</h1>
                    <span
                        className={`inline-flex items-center self-start rounded-full px-2.5 py-0.5 text-xs font-medium uppercase ${
                            problem.difficulty === 'easy'
                                ? 'bg-green-100 text-green-800'
                                : problem.difficulty === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {problem.difficulty}
                    </span>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2 sm:gap-4">
                    <div>
                        <span className="font-semibold">{tp('timeLimit')}:</span> {problem.time_limit_ms}ms
                    </div>
                    <div>
                        <span className="font-semibold">{tp('memoryLimit')}:</span> {problem.memory_limit_mb}MB
                    </div>
                </div>

                <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                        {tp('contest')}: {contest.title}
                    </span>
                </div>

                <div>
                    <h3 className="mb-2 text-lg font-semibold">{tp('description')}</h3>
                    <MarkdownRenderer content={problem.description} />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold">{tp('submitSolution')}</h2>
                <ContestSubmitForm problemId={problem.id} contestId={contest.id} />
                <SubmissionsList problemId={problem.id} />
            </div>
        </main>
    );
}
