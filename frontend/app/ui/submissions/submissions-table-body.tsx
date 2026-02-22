'use client';

import Link from 'next/link';
import type { SubmissionPreview } from '@/app/lib/definitions';
import {
    useSubmissionDetail,
    SubmissionDetailOverlay,
    StatusBadge,
    VerdictBadge,
} from './submission-detail-modal';

export default function SubmissionsTableBody({
    submissions,
    accessToken,
    showProblem = true,
    showUser = true,
    showRuntime = false,
}: {
    submissions: (SubmissionPreview & { runtimeMs?: number })[];
    accessToken: string;
    showProblem?: boolean;
    showUser?: boolean;
    showRuntime?: boolean;
}) {
    const { isOpen, submission, loading, error, openDetail, closeDetail } =
        useSubmissionDetail();

    return (
        <>
            <div className="mt-6 flow-root">
                <div className="inline-block min-w-full align-middle">
                    <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                        {/* Mobile view */}
                        <div className="md:hidden">
                            {submissions.map((sub) => (
                                <div
                                    key={sub.id}
                                    onClick={() => openDetail(sub.id)}
                                    className="mb-2 w-full rounded-md bg-white p-4 hover:bg-blue-50 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div>
                                            {showProblem && (
                                                <p className="text-sm font-medium">Problem #{sub.problemId}</p>
                                            )}
                                            <p className="text-xs text-gray-500">
                                                {new Date(sub.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <VerdictBadge verdict={sub.verdict} />
                                    </div>
                                    <div className="flex w-full items-center justify-between pt-4">
                                        <StatusBadge status={sub.status} />
                                        {showUser && (
                                            <p className="text-xs text-gray-500">{sub.userName}</p>
                                        )}
                                        {showRuntime && (
                                            <p className="text-xs text-gray-500">
                                                {(sub as any).runtimeMs ? `${(sub as any).runtimeMs} ms` : '-'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table */}
                        <table className="hidden min-w-full text-gray-900 md:table">
                            <thead className="rounded-lg text-left text-sm font-normal">
                                <tr>
                                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Date</th>
                                    {showProblem && (
                                        <th scope="col" className="px-3 py-5 font-medium">Problem</th>
                                    )}
                                    {showUser && (
                                        <th scope="col" className="px-3 py-5 font-medium">User</th>
                                    )}
                                    <th scope="col" className="px-3 py-5 font-medium">Status</th>
                                    <th scope="col" className="px-3 py-5 font-medium">Verdict</th>
                                    {showRuntime && (
                                        <th scope="col" className="px-3 py-5 font-medium">Runtime</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {submissions.map((sub) => (
                                    <tr
                                        key={sub.id}
                                        onClick={() => openDetail(sub.id)}
                                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:bg-blue-50 transition-colors cursor-pointer"
                                    >
                                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                            {new Date(sub.createdAt).toLocaleString()}
                                        </td>
                                        {showProblem && (
                                            <td className="whitespace-nowrap px-3 py-3">
                                                <Link
                                                    href={`/dashboard/problems/${sub.problemId}`}
                                                    className="text-blue-600 hover:underline font-medium"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Problem #{sub.problemId}
                                                </Link>
                                            </td>
                                        )}
                                        {showUser && (
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {sub.userName}
                                            </td>
                                        )}
                                        <td className="whitespace-nowrap px-3 py-3">
                                            <StatusBadge status={sub.status} />
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3">
                                            <VerdictBadge verdict={sub.verdict} />
                                        </td>
                                        {showRuntime && (
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {(sub as any).runtimeMs ? `${(sub as any).runtimeMs} ms` : '-'}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <SubmissionDetailOverlay
                isOpen={isOpen}
                onClose={closeDetail}
                submission={submission}
                loading={loading}
                error={error}
            />
        </>
    );
}
