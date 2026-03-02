import { Clock } from 'lucide-react';
import { RecentSubmission } from '@/app/lib/definitions';
import { lusitana } from '@/app/ui/fonts';

function timeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function VerdictBadge({ verdict, status }: { verdict: string | null; status: string }) {
    if (status !== 'COMPLETED') {
        return (
            <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 border border-yellow-200">
                {status}
            </span>
        );
    }

    const styles: Record<string, string> = {
        AC: 'bg-green-50 text-green-700 border-green-200',
        WA: 'bg-red-50 text-red-700 border-red-200',
        TLE: 'bg-orange-50 text-orange-700 border-orange-200',
        RE: 'bg-purple-50 text-purple-700 border-purple-200',
        CE: 'bg-gray-50 text-gray-700 border-gray-200',
    };

    const labels: Record<string, string> = {
        AC: 'ACCEPTED',
        WA: 'WRONG ANSWER',
        TLE: 'TIME LIMIT',
        RE: 'RUNTIME ERROR',
        CE: 'COMPILE ERROR',
    };

    const key = verdict ?? 'CE';
    return (
        <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[key] ?? styles.CE}`}
        >
            {labels[key] ?? verdict}
        </span>
    );
}

export function RecentActivity({
    submissions,
}: {
    submissions: RecentSubmission[];
}) {
    if (submissions.length === 0) {
        return (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
                <h2 className={`${lusitana.className} mb-4 text-xl font-bold text-gray-900`}>
                    Recent Activity
                </h2>
                <p className="text-sm text-gray-500">No recent submissions yet.</p>
            </div>
        );
    }

    return (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className={`${lusitana.className} mb-4 text-xl font-bold text-gray-900`}>
                Recent Activity
            </h2>
            <div className="divide-y divide-gray-100">
                {submissions.map((sub) => (
                    <div
                        key={sub.id}
                        className="flex items-center justify-between py-3"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                                <Clock className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    New submission for{' '}
                                    <span className="font-semibold text-blue-600">
                                        Problem #{sub.problemId}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-500">
                                    by {sub.userName} · {timeAgo(sub.createdAt)}
                                </p>
                            </div>
                        </div>
                        <VerdictBadge verdict={sub.verdict} status={sub.status} />
                    </div>
                ))}
            </div>
        </div>
    );
}
