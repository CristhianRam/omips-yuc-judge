
import { fetchMySubmissions } from '@/app/lib/data';
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

export default async function SubmissionsList({ problemId }: { problemId: number }) {
    const submissions = await fetchMySubmissions(problemId);

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
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Date
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Verdict
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Runtime
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {submissions.map((submission) => (
                                <tr
                                    key={submission.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        {new Date(submission.createdAt).toLocaleString()}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <StatusBadge status={submission.status} />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <VerdictBadge verdict={submission.verdict} />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {submission.runtimeMs ? `${submission.runtimeMs} ms` : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'Pending' || status === 'Compiling' || status === 'Running') {
        return (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                <ClockIcon className="mr-1 h-3 w-3" />
                {status}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
        </span>
    );
}

function VerdictBadge({ verdict }: { verdict: string | undefined }) {
    if (!verdict) return <span className="text-gray-400">-</span>;

    if (verdict === 'Accepted') {
        return (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                <CheckCircleIcon className="mr-1 h-3 w-3" />
                {verdict}
            </span>
        );
    }
    if (verdict === 'Wrong Answer') {
        return (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                <XCircleIcon className="mr-1 h-3 w-3" />
                {verdict}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <ExclamationCircleIcon className="mr-1 h-3 w-3" />
            {verdict}
        </span>
    );
}
