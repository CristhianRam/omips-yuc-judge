'use client';

import { ContestProblemPublic } from '@/app/lib/definitions';
import { Link } from '@/i18n/navigation';
import { ChevronRight, TrashIcon } from 'lucide-react';
import AddProblemForm from './add-problem-form';
import { removeProblemFromContest } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

function RemoveProblemButton({
    contestId,
    problemId,
}: {
    contestId: number;
    problemId: number;
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleRemove = () => {
        if (!confirm('Remove this problem from the contest?')) return;
        startTransition(async () => {
            await removeProblemFromContest(contestId, problemId);
            router.refresh();
        });
    };

    return (
        <button
            onClick={handleRemove}
            disabled={isPending}
            className="rounded-md border p-1.5 hover:bg-red-50 transition-colors disabled:opacity-50"
            title="Remove problem"
        >
            <TrashIcon className="w-4 h-4 text-red-500" />
        </button>
    );
}

export default function ProblemsTab({
    contestId,
    problems,
    role,
    isOpen,
}: {
    contestId: number;
    problems: ContestProblemPublic[];
    role: string;
    isOpen: boolean;
}) {
    const isCoachOrAdmin = role === 'admin' || role === 'coach';

    return (
        <div>
            {problems.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                    {isCoachOrAdmin
                        ? 'No problems added yet. Use the form below to add problems.'
                        : 'No problems available yet. Problems may be visible once the contest starts.'}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-gray-900">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th className="px-4 py-3 font-medium">#</th>
                                <th className="px-4 py-3 font-medium">Problem</th>
                                <th className="px-4 py-3 font-medium">Points</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {problems
                                .sort((a, b) => a.order.localeCompare(b.order))
                                .map((problem) => (
                                    <tr
                                        key={problem.problem_id}
                                        className="border-b text-sm last-of-type:border-none hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                                                {problem.order}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {problem.problem_name}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-amber-600 font-semibold">
                                                {problem.points} pts
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/contests/${contestId}/problem/${problem.problem_id}`}
                                                    className="flex items-center gap-1 text-blue-600 font-medium hover:underline text-sm"
                                                >
                                                    Solve <ChevronRight size={16} />
                                                </Link>
                                                {isCoachOrAdmin && !isOpen && (
                                                    <RemoveProblemButton
                                                        contestId={contestId}
                                                        problemId={problem.problem_id}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add problem form for coaches (only when contest is not open) */}
            {isCoachOrAdmin && !isOpen && (
                <div className="mt-6 border-t pt-6">
                    <h3 className="text-sm font-semibold mb-3">Add Problem to Contest</h3>
                    <AddProblemForm contestId={contestId} />
                </div>
            )}
        </div>
    );
}
