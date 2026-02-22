import { fetchSubmissions } from '@/app/lib/data';
import { auth } from '@/auth';
import type { SubmissionPreview } from '@/app/lib/definitions';
import SubmissionsTableBody from './submissions-table-body';

export default async function SubmissionsTable({
    currentPage,
    verdict,
    status,
    userId,
}: {
    currentPage: number;
    verdict?: string;
    status?: string;
    userId?: string;
}) {
    const submissions = await fetchSubmissions(currentPage, verdict, status, userId);
    const session = await auth();
    const accessToken = session?.user?.accessToken || '';

    if (!submissions || submissions.length === 0) {
        return (
            <div className="mt-6 rounded-md bg-gray-50 p-4">
                <p className="text-sm text-gray-500">No submissions found.</p>
            </div>
        );
    }

    return (
        <SubmissionsTableBody
            submissions={submissions}
            accessToken={accessToken}
            showProblem={true}
            showUser={true}
        />
    );
}
