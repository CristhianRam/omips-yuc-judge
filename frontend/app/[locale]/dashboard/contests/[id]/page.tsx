/**
 * @file frontend/app/[locale]/dashboard/contests/[id]/page.tsx
 * @description Pagina de Next.js para la ruta '/dashboard/contests/[id]'.
 * @symbols formatDate
 */

import Breadcrumbs from '@/app/ui/problems/breadcrumbs';
import {
    fetchContestById,
    fetchContestProblems,
    fetchContestParticipants,
    fetchContestScoreboard,
} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import ContestTabs from '@/app/ui/contests/contest-tabs';
import JoinLeaveButton from '@/app/ui/contests/join-leave-button';
import { UpdateContest, DeleteContest } from '@/app/ui/contests/buttons';
import { auth } from '@/auth';
import MarkdownRenderer from '@/app/ui/markdown-renderer';
import { getLocale, getTranslations } from 'next-intl/server';

function formatDate(dateStr: string, locale: string) {
    return new Date(dateStr).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = Number(params.id);
    const result = await fetchContestById(id);

    if (result === null) {
        notFound();
    }

    const session = await auth();
    const role = session?.user?.role || 'student';
    const isCoachOrAdmin = role === 'admin' || role === 'coach';
    const t = await getTranslations('contests');
    const td = await getTranslations('contests.detail');
    const locale = await getLocale();

    if (result === 'forbidden') {
        return (
            <main>
                <Breadcrumbs
                    breadcrumbs={[
                        { label: t('title'), href: '/dashboard/contests' },
                        { label: `${t('contest')} #${id}`, href: `/dashboard/contests/${id}`, active: true },
                    ]}
                />

                <div className="rounded-md bg-gray-50 p-6 text-center md:p-8">
                    <div className="mx-auto max-w-md">
                        <h1 className="mb-2 text-2xl font-bold">{td('joinTitle')}</h1>
                        <p className="mb-6 text-gray-600">{td('joinDescription')}</p>
                        <JoinLeaveButton contestId={id} isParticipant={false} isOpen={true} isFinished={false} />
                        <p className="mt-4 text-xs text-gray-400">{td('joinHelp')}</p>
                    </div>
                </div>
            </main>
        );
    }

    const contest = result;

    const [problems, participants, scoreboard] = await Promise.all([
        fetchContestProblems(id),
        fetchContestParticipants(id),
        fetchContestScoreboard(id),
    ]);

    const now = new Date();
    const end = contest.end_date ? new Date(contest.end_date) : null;
    const isFinished = end ? now > end : false;
    const isParticipant = participants.some((p) => p.id === session?.user?.id);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: t('title'), href: '/dashboard/contests' },
                    { label: contest.title, href: `/dashboard/contests/${id}`, active: true },
                ]}
            />

            <div className="mb-6 rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="break-words text-2xl font-bold">{contest.title}</h1>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                            <span>
                                <strong>{td('start')}:</strong> {formatDate(contest.start_date, locale)}
                            </span>
                            {contest.end_date && (
                                <span>
                                    <strong>{td('end')}:</strong> {formatDate(contest.end_date, locale)}
                                </span>
                            )}
                            <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                    contest.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}
                            >
                                {contest.open ? t('openForRegistration') : td('registrationClosed')}
                            </span>
                        </div>
                    </div>
                    {isCoachOrAdmin && (
                        <div className="flex items-center gap-2 self-start">
                            <UpdateContest id={contest.id} />
                            <DeleteContest id={contest.id} />
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <MarkdownRenderer content={contest.description} />
                </div>

                {!isCoachOrAdmin && (
                    <div className="mt-4 border-t pt-4">
                        <JoinLeaveButton
                            contestId={contest.id}
                            isParticipant={isParticipant}
                            isOpen={contest.open}
                            isFinished={isFinished}
                        />
                    </div>
                )}
            </div>

            <ContestTabs
                contestId={contest.id}
                problems={problems}
                participants={participants}
                scoreboard={scoreboard}
                role={role}
                isOpen={contest.open}
            />
        </main>
    );
}
