import { fetchContests } from '@/app/lib/data';
import Link from 'next/link';
import { ChevronRight, Trophy } from 'lucide-react';
import clsx from 'clsx';

function getContestStatus(contest: {
    start_date: string;
    end_date: string | null;
    open: boolean;
}) {
    const now = new Date();
    const start = new Date(contest.start_date);
    const end = contest.end_date ? new Date(contest.end_date) : null;

    if (end && now > end) return 'Finished';
    if (now >= start) return 'Active';
    return 'Upcoming';
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={clsx(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                {
                    'bg-green-100 text-green-800': status === 'Active',
                    'bg-blue-100 text-blue-800': status === 'Upcoming',
                    'bg-gray-100 text-gray-600': status === 'Finished',
                },
            )}
        >
            {status}
        </span>
    );
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default async function ContestsTable({
    currentPage,
    role,
}: {
    currentPage: number;
    role: string;
}) {
    const contests = await fetchContests(currentPage);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    {/* Mobile view */}
                    <div className="md:hidden">
                        {contests?.map((contest) => {
                            const status = getContestStatus(contest);
                            return (
                                <div
                                    key={contest.id}
                                    className="mb-2 w-full rounded-md bg-white p-4"
                                >
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div>
                                            <p className="text-sm font-medium">{contest.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDate(contest.start_date)}
                                            </p>
                                        </div>
                                        <StatusBadge status={status} />
                                    </div>
                                    <div className="flex w-full items-center justify-between pt-4">
                                        <div className="flex items-center gap-2">
                                            {contest.open && (
                                                <span className="text-xs text-green-600 font-medium">
                                                    Open for registration
                                                </span>
                                            )}
                                        </div>
                                        <Link
                                            href={`/dashboard/contests/${contest.id}`}
                                            className="flex items-center gap-1 text-blue-600 font-medium hover:underline text-sm"
                                        >
                                            View <ChevronRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop view */}
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Contest
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Start Date
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    End Date
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Registration
                                </th>
                                <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {contests?.map((contest) => {
                                const status = getContestStatus(contest);
                                return (
                                    <tr
                                        key={contest.id}
                                        className="w-full border-b py-3 text-sm last-of-type:border-none hover:bg-gray-50"
                                    >
                                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                            <div className="flex items-center gap-3">
                                                <Trophy className="w-5 h-5 text-amber-500" />
                                                <p className="font-bold">{contest.title}</p>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3">
                                            <StatusBadge status={status} />
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-sm">
                                            {formatDate(contest.start_date)}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-sm">
                                            {contest.end_date
                                                ? formatDate(contest.end_date)
                                                : '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3">
                                            <span
                                                className={clsx(
                                                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                                                    contest.open
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-red-50 text-red-700',
                                                )}
                                            >
                                                {contest.open ? 'Open' : 'Closed'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                            <div className="flex justify-end gap-3">
                                                <Link
                                                    href={`/dashboard/contests/${contest.id}`}
                                                    className="flex items-center gap-1 text-blue-600 font-medium hover:underline mr-4"
                                                >
                                                    View <ChevronRight size={16} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
