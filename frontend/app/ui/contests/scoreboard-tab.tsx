import { Scoreboard } from '@/app/lib/definitions';
import clsx from 'clsx';

export default function ScoreboardTab({
    scoreboard,
}: {
    scoreboard: Scoreboard | null;
}) {
    if (!scoreboard || scoreboard.users.length === 0) {
        return (
            <div className="rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                No scoreboard data available yet.
            </div>
        );
    }

    // Collect all unique problem orders for columns
    const allOrders = Array.from(
        new Set(scoreboard.users.flatMap((u) => u.problems.map((p) => p.order))),
    ).sort();

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-gray-900">
                <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                        <th className="px-3 py-3 font-medium text-center w-12">#</th>
                        <th className="px-3 py-3 font-medium">User</th>
                        {allOrders.map((order) => (
                            <th
                                key={order}
                                className="px-3 py-3 font-medium text-center"
                            >
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                                    {order}
                                </span>
                            </th>
                        ))}
                        <th className="px-3 py-3 font-bold text-center">Total</th>
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
                            <td className="px-3 py-3 text-center font-bold text-gray-500">
                                {idx + 1}
                            </td>
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
                                            <span className="text-gray-300">—</span>
                                        )}
                                    </td>
                                );
                            })}
                            <td className="px-3 py-3 text-center">
                                <span className="font-bold text-lg">{user.total_score}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
