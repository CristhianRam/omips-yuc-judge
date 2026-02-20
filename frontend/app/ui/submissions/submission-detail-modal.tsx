'use client';

import { useState } from 'react';
import {
    XMarkIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import type { Submission } from '@/app/lib/definitions';

/**
 * Renders the detail modal overlay. Must be used alongside useSubmissionDetail hook.
 */
export function SubmissionDetailOverlay({
    isOpen,
    onClose,
    submission,
    loading,
    error,
}: {
    isOpen: boolean;
    onClose: () => void;
    submission: Submission | null;
    loading: boolean;
    error: string | null;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-auto rounded-lg bg-white shadow-xl mx-4">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
                    <h2 className="text-lg font-semibold">Submission Details</h2>
                    <button
                        onClick={onClose}
                        className="rounded-md p-1 hover:bg-gray-100 transition-colors"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                        </div>
                    )}

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {submission && !loading && (
                        <div className="space-y-6">
                            {/* Meta info */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <InfoItem label="User" value={submission.userName} />
                                <InfoItem label="Problem" value={`#${submission.problemId}`} />
                                <InfoItem
                                    label="Date"
                                    value={new Date(submission.createdAt).toLocaleString()}
                                />
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    <StatusBadge status={submission.status} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Verdict</p>
                                    <VerdictBadge verdict={submission.verdict} />
                                </div>
                                {submission.runtimeMs !== undefined && submission.runtimeMs !== null && (
                                    <InfoItem label="Runtime" value={`${submission.runtimeMs} ms`} />
                                )}
                            </div>

                            {/* Error message */}
                            {submission.errorMessage && (
                                <div className="rounded-md bg-red-50 border border-red-200 p-4">
                                    <p className="text-xs font-semibold text-red-800 mb-1">Error Message</p>
                                    <pre className="text-sm text-red-700 whitespace-pre-wrap font-mono">
                                        {submission.errorMessage}
                                    </pre>
                                </div>
                            )}

                            {/* Failed testcase */}
                            {submission.failedTestcase !== undefined && submission.failedTestcase !== null && (
                                <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3">
                                    <p className="text-sm text-yellow-800">
                                        <span className="font-semibold">Failed Testcase:</span>{' '}
                                        #{submission.failedTestcase}
                                    </p>
                                </div>
                            )}

                            {/* Source code */}
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-2">Source Code</p>
                                <div className="rounded-md bg-gray-900 p-4 overflow-auto max-h-96">
                                    <pre className="text-sm text-gray-100 font-mono whitespace-pre">
                                        {submission.code}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Hook to manage submission detail modal state.
 */
export function useSubmissionDetail(accessToken: string) {
    const [isOpen, setIsOpen] = useState(false);
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const openDetail = async (submissionId: string) => {
        setIsOpen(true);
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/submissions/${submissionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch submission (${response.status})`);
            }

            const data: Submission = await response.json();
            setSubmission(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load submission');
        } finally {
            setLoading(false);
        }
    };

    const closeDetail = () => {
        setIsOpen(false);
        setSubmission(null);
        setError(null);
    };

    return { isOpen, submission, loading, error, openDetail, closeDetail };
}

// ─── Shared UI components ───────────────────────────────────────────────────

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-sm font-medium">{value}</p>
        </div>
    );
}

export function StatusBadge({ status }: { status: string }) {
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

export function VerdictBadge({ verdict }: { verdict: string | undefined }) {
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
