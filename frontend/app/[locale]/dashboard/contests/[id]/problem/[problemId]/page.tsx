import Breadcrumbs from '@/app/ui/problems/breadcrumbs';
import { fetchProblemById, fetchContestById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import ContestSubmitForm from '@/app/ui/contests/contest-submit-form';
import SubmissionsList from '@/app/ui/problems/submissions-list';
import MarkdownRenderer from '@/app/ui/markdown-renderer';

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

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Contests', href: '/dashboard/contests' },
                    { label: contest.title, href: `/dashboard/contests/${contestId}` },
                    {
                        label: problem.title,
                        href: `/dashboard/contests/${contestId}/problem/${problemId}`,
                        active: true,
                    },
                ]}
            />

            <div className="rounded-md bg-gray-50 p-4 md:p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-bold">{problem.title}</h1>
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase ${problem.difficulty === 'easy'
                            ? 'bg-green-100 text-green-800'
                            : problem.difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {problem.difficulty}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                    <div>
                        <span className="font-semibold">Time Limit:</span>{' '}
                        {problem.time_limit_ms}ms
                    </div>
                    <div>
                        <span className="font-semibold">Memory Limit:</span>{' '}
                        {problem.memory_limit_mb}MB
                    </div>
                </div>

                <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                        Contest: {contest.title}
                    </span>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <MarkdownRenderer content={problem.description} />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Submit Solution</h2>
                <ContestSubmitForm problemId={problem.id} contestId={contest.id} />
                <SubmissionsList problemId={problem.id} />
            </div>
        </main>
    );
}

