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

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
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

    // True 404
    if (result === null) {
        notFound();
    }

    const session = await auth();
    const role = session?.user?.role || 'student';
    const isCoachOrAdmin = role === 'admin' || role === 'coach';

    // 403 — user is not enrolled in this contest
    if (result === 'forbidden') {
        return (
            <main>
                <Breadcrumbs
                    breadcrumbs={[
                        { label: 'Contests', href: '/dashboard/contests' },
                        {
                            label: `Contest #${id}`,
                            href: `/dashboard/contests/${id}`,
                            active: true,
                        },
                    ]}
                />

                <div className="rounded-md bg-gray-50 p-6 md:p-8 text-center">
                    <div className="mx-auto max-w-md">
                        <div className="mb-4 text-5xl">🏆</div>
                        <h1 className="text-2xl font-bold mb-2">Join this Contest</h1>
                        <p className="text-gray-600 mb-6">
                            You need to enroll in this contest before you can view the problems,
                            participants, and scoreboard.
                        </p>
                        <JoinLeaveButton
                            contestId={id}
                            isParticipant={false}
                            isOpen={true}
                            isFinished={false}
                        />
                        <p className="mt-4 text-xs text-gray-400">
                            If registration is closed, contact your coach for access.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    // User has access — show full contest detail
    const contest = result;

    const [problems, participants, scoreboard] = await Promise.all([
        fetchContestProblems(id),
        fetchContestParticipants(id),
        fetchContestScoreboard(id),
    ]);

    const now = new Date();
    const end = contest.end_date ? new Date(contest.end_date) : null;
    const isFinished = end ? now > end : false;

    const isParticipant = participants.some(
        (p) => p.id === session?.user?.id,
    );

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Contests', href: '/dashboard/contests' },
                    {
                        label: contest.title,
                        href: `/dashboard/contests/${id}`,
                        active: true,
                    },
                ]}
            />

            {/* Contest Header */}
            <div className="rounded-md bg-gray-50 p-4 md:p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">{contest.title}</h1>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                            <span>
                                <strong>Start:</strong> {formatDate(contest.start_date)}
                            </span>
                            {contest.end_date && (
                                <span>
                                    <strong>End:</strong> {formatDate(contest.end_date)}
                                </span>
                            )}
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${contest.open
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                {contest.open ? 'Open for Registration' : 'Registration Closed'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isCoachOrAdmin && (
                            <>
                                <UpdateContest id={contest.id} />
                                <DeleteContest id={contest.id} />
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-4">
                    <MarkdownRenderer content={contest.description} />
                </div>

                {/* Join / Leave section (only for non-coaches) */}
                {!isCoachOrAdmin && (
                    <div className="mt-4 pt-4 border-t">
                        <JoinLeaveButton
                            contestId={contest.id}
                            isParticipant={isParticipant}
                            isOpen={contest.open}
                            isFinished={isFinished}
                        />
                    </div>
                )}
            </div>

            {/* Tabs */}
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
