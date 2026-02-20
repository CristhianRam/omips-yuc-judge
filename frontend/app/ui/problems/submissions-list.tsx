
import { fetchMySubmissions } from '@/app/lib/data';
import { auth } from '@/auth';
import SubmissionsTableBody from '@/app/ui/submissions/submissions-table-body';

export default async function SubmissionsList({ problemId }: { problemId: number }) {
    const submissions = await fetchMySubmissions(problemId);
    const session = await auth();
    const accessToken = session?.user?.accessToken || '';

    if (!submissions || submissions.length === 0) {
        return (
            <div className="mt-6 rounded-md bg-gray-50 p-4">
                <p className="text-sm text-gray-500">No submissions yet.</p>
            </div>
        );
    }

    return (
        <div className="mt-6 flow-root">
            <h3 className="text-lg font-semibold mb-4">My Submissions</h3>
            <SubmissionsTableBody
                submissions={submissions}
                accessToken={accessToken}
                showProblem={false}
                showUser={false}
                showRuntime={true}
            />
        </div>
    );
}
