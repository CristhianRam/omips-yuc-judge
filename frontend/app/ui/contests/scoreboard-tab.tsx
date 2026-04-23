/**
 * @file frontend/app/ui/contests/scoreboard-tab.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols ScoreboardTab
 */

'use client';

import { Scoreboard } from '@/app/lib/definitions';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

export default function ScoreboardTab({
    scoreboard,
}: {
    scoreboard: Scoreboard | null;
}) {
    const t = useTranslations('contests.detail');

    if (!scoreboard || scoreboard.users.length === 0) {
        return (
            <div className="rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                {t('noScoreboard')}
            </div>
        );
    }

    const allOrders = Array.from(
        new Set(scoreboard.users.flatMap((u) => u.problems.map((p) => p.order))),
    ).sort();

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-gray-900">
                <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                        <th className="w-12 px-3 py-3 text-center font-medium">#</th>
                        <th className="px-3 py-3 font-medium">{t('user')}</th>
                        {allOrders.map((order) => (
                            <th key={order} className="px-3 py-3 text-center font-medium">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                    {order}
                                </span>
                            </th>
                        ))}
                        <th className="px-3 py-3 text-center font-bold">{t('total')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {scoreboard.users.map((user, idx) => (
                        <tr
                            key={user.username}
                            className={clsx(
                                'border-b text-sm last-of-type:border-none',
                                idx === 0 && 'bg-yellow-50',
                                idx === 1 && 'bg-gray-50',
                                idx === 2 && 'bg-orange-50',
                            )}
                        >
                            <td className="px-3 py-3 text-center font-bold text-gray-500">{idx + 1}</td>
                            <td className="px-3 py-3">
                                <span className="font-medium">{user.username}</span>
                            </td>
                            {allOrders.map((order) => {
                                const problem = user.problems.find((p) => p.order === order);
                                return (
                                    <td key={order} className="px-3 py-3 text-center">
                                        {problem ? (
                                            <div>
                                                <span
                                                    className={clsx(
                                                        'font-semibold',
                                                        problem.solved
                                                            ? 'text-green-600'
                                                            : problem.bad_submissions > 0
                                                                ? 'text-red-500'
                                                                : 'text-gray-400',
                                                    )}
                                                >
                                                    {problem.score}
                                                </span>
                                                {problem.bad_submissions > 0 && (
                                                    <span className="block text-xs text-red-400">
                                                        ({problem.bad_submissions})
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-300">-</span>
                                        )}
                                    </td>
                                );
                            })}
                            <td className="px-3 py-3 text-center">
                                <span className="text-lg font-bold">{user.total_score}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
