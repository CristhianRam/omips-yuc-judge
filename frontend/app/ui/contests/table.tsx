/**
 * @file frontend/app/ui/contests/table.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols getContestStatus, StatusBadge, formatDate
 */

import { fetchContests } from '@/app/lib/data';
import { Link } from '@/i18n/navigation';
import { Trophy } from 'lucide-react';
import clsx from 'clsx';
import { getLocale, getTranslations } from 'next-intl/server';

function getContestStatus(contest: {
    start_date: string;
    end_date: string | null;
    open: boolean;
}) {
    const now = new Date();
    const start = new Date(contest.start_date);
    const end = contest.end_date ? new Date(contest.end_date) : null;

    if (end && now > end) return 'finished';
    if (now >= start) return 'active';
    return 'upcoming';
}

function StatusBadge({ status, label }: { status: string; label: string }) {
    return (
        <span
            className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', {
                'bg-green-100 text-green-800': status === 'active',
                'bg-blue-100 text-blue-800': status === 'upcoming',
                'bg-gray-100 text-gray-600': status === 'finished',
            })}
        >
            {label}
        </span>
    );
}

function formatDate(dateStr: string, locale: string) {
    return new Date(dateStr).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default async function ContestsTable({
    currentPage,
}: {
    currentPage: number;
    role: string;
}) {
    const contests = await fetchContests(currentPage);
    const t = await getTranslations('contests');
    const tc = await getTranslations('common');
    const locale = await getLocale();

    const statusLabels: Record<string, string> = {
        active: t('active'),
        upcoming: t('upcoming'),
        finished: t('finished'),
    };

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {contests?.map((contest) => {
                            const status = getContestStatus(contest);
                            return (
                                <Link
                                    key={contest.id}
                                    href={`/dashboard/contests/${contest.id}`}
                                    aria-label={`${tc('view')}: ${contest.title}`}
                                    className="mb-2 block w-full rounded-md bg-white p-4 transition-colors hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">{contest.title}</p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {formatDate(contest.start_date, locale)}
                                            </p>
                                        </div>
                                        <StatusBadge status={status} label={statusLabels[status]} />
                                    </div>
                                    <div className="flex w-full items-center justify-between pt-4">
                                        <div className="flex items-center gap-2">
                                            {contest.open && (
                                                <span className="text-xs font-medium text-green-600">
                                                    {t('openForRegistration')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    {t('contest')}
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    {t('status')}
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    {t('startDate')}
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    {t('endDate')}
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    {t('registration')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {contests?.map((contest) => {
                                const status = getContestStatus(contest);
                                const contestHref = `/dashboard/contests/${contest.id}`;
                                return (
                                    <tr
                                        key={contest.id}
                                        className="w-full border-b text-sm last-of-type:border-none hover:bg-gray-50"
                                    >
                                        <td className="whitespace-nowrap pl-6 pr-3">
                                            <Link
                                                href={contestHref}
                                                aria-label={`${tc('view')}: ${contest.title}`}
                                                className="flex w-full items-center gap-3 py-3"
                                            >
                                                <Trophy className="h-5 w-5 text-amber-500" />
                                                <p className="max-w-[18rem] truncate font-bold">{contest.title}</p>
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-3">
                                            <Link
                                                href={contestHref}
                                                aria-label={`${tc('view')}: ${contest.title}`}
                                                className="block w-full py-3"
                                            >
                                                <StatusBadge status={status} label={statusLabels[status]} />
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-3 text-sm">
                                            <Link
                                                href={contestHref}
                                                aria-label={`${tc('view')}: ${contest.title}`}
                                                className="block w-full py-3"
                                            >
                                                {formatDate(contest.start_date, locale)}
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-3 text-sm">
                                            <Link
                                                href={contestHref}
                                                aria-label={`${tc('view')}: ${contest.title}`}
                                                className="block w-full py-3"
                                            >
                                                {contest.end_date ? formatDate(contest.end_date, locale) : '-'}
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-3">
                                            <Link
                                                href={contestHref}
                                                aria-label={`${tc('view')}: ${contest.title}`}
                                                className="block w-full py-3"
                                            >
                                                <span
                                                    className={clsx(
                                                        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                                                        contest.open
                                                            ? 'bg-green-50 text-green-700'
                                                            : 'bg-red-50 text-red-700',
                                                    )}
                                                >
                                                    {contest.open ? t('open') : t('closed')}
                                                </span>
                                            </Link>
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
