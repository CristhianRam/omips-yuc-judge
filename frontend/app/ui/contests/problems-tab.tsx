/**
 * @file frontend/app/ui/contests/problems-tab.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols ProblemsTab, RemoveProblemButton, handleRemove
 */

'use client';

import { ContestProblemPublic } from '@/app/lib/definitions';
import { Link } from '@/i18n/navigation';
import { ChevronRight, TrashIcon } from 'lucide-react';
import AddProblemForm from './add-problem-form';
import { removeProblemFromContest } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useTranslations } from 'next-intl';

function RemoveProblemButton({
    contestId,
    problemId,
}: {
    contestId: number;
    problemId: number;
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const t = useTranslations('contests.detail');

    const handleRemove = () => {
        if (!confirm(t('removeProblemConfirm'))) return;
        startTransition(async () => {
            await removeProblemFromContest(contestId, problemId);
            router.refresh();
        });
    };

    return (
        <button
            onClick={handleRemove}
            disabled={isPending}
            className="rounded-md border p-1.5 transition-colors hover:bg-red-50 disabled:opacity-50"
            title={t('removeProblem')}
        >
            <TrashIcon className="h-4 w-4 text-red-500" />
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
    const t = useTranslations('contests.detail');
    const tc = useTranslations('common');
    const sortedProblems = [...problems].sort((a, b) => a.order.localeCompare(b.order));

    return (
        <div>
            {sortedProblems.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                    {isCoachOrAdmin ? t('noProblemsCoach') : t('noProblemsStudent')}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <div className="md:hidden">
                        {sortedProblems.map((problem) => (
                            <div key={problem.problem_id} className="mb-2 rounded-md bg-white p-4">
                                <div className="flex items-start justify-between gap-3 border-b pb-3">
                                    <div>
                                        <p className="text-sm font-medium">{problem.problem_name}</p>
                                        <p className="mt-1 text-xs text-gray-500">#{problem.order}</p>
                                    </div>
                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                                        {problem.points} pts
                                    </span>
                                </div>
                                <div className="pt-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <Link
                                            href={`/dashboard/contests/${contestId}/problem/${problem.problem_id}`}
                                            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                                        >
                                            {t('solve')} <ChevronRight size={16} />
                                        </Link>
                                        {isCoachOrAdmin && !isOpen && (
                                            <RemoveProblemButton contestId={contestId} problemId={problem.problem_id} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th className="px-4 py-3 font-medium">#</th>
                                <th className="px-4 py-3 font-medium">{t('problem')}</th>
                                <th className="px-4 py-3 font-medium">{t('points')}</th>
                                <th className="px-4 py-3 text-right font-medium">{tc('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {sortedProblems.map((problem) => (
                                <tr
                                    key={problem.problem_id}
                                    className="border-b text-sm last-of-type:border-none hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                            {problem.order}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium">{problem.problem_name}</td>
                                    <td className="px-4 py-3">
                                        <span className="font-semibold text-amber-600">{problem.points} pts</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/dashboard/contests/${contestId}/problem/${problem.problem_id}`}
                                                className="mr-2 flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                                            >
                                                {t('solve')} <ChevronRight size={16} />
                                            </Link>
                                            {isCoachOrAdmin && !isOpen && (
                                                <RemoveProblemButton contestId={contestId} problemId={problem.problem_id} />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isCoachOrAdmin && !isOpen && (
                <div className="mt-6 border-t pt-6">
                    <h3 className="mb-3 text-sm font-semibold">{t('addProblemToContest')}</h3>
                    <AddProblemForm contestId={contestId} />
                </div>
            )}
        </div>
    );
}
