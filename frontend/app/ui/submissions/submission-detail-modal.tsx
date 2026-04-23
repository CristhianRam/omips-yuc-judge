/**
 * @file frontend/app/ui/submissions/submission-detail-modal.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols SubmissionDetailOverlay, useSubmissionDetail, StatusBadge, VerdictBadge, InfoItem, openDetail, closeDetail
 */

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
    XMarkIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import type { Submission } from '@/app/lib/definitions';
import { useTranslations } from 'next-intl';

const CodeEditor = dynamic(() => import('@/app/ui/codemirror/code-editor'), { ssr: false });

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
    const t = useTranslations('submissionDetail');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

            <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white shadow-xl">
                <div className="sticky top-0 flex items-center justify-between border-b bg-white px-4 py-4 md:px-6">
                    <h2 className="text-lg font-semibold">{t('title')}</h2>
                    <button onClick={onClose} className="rounded-md p-1 transition-colors hover:bg-gray-100">
                        <span className="sr-only">{t('close')}</span>
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-4 py-4 md:px-6">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
                        </div>
                    )}

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {submission && !loading && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <InfoItem label={t('user')} value={submission.userName} />
                                <InfoItem label={t('problem')} value={`#${submission.problemId}`} />
                                <InfoItem label={t('date')} value={new Date(submission.createdAt).toLocaleString()} />
                                <div>
                                    <p className="mb-1 text-xs text-gray-500">{t('status')}</p>
                                    <StatusBadge status={submission.status} />
                                </div>
                                <div>
                                    <p className="mb-1 text-xs text-gray-500">{t('verdict')}</p>
                                    <VerdictBadge verdict={submission.verdict} />
                                </div>
                                {submission.runtimeMs !== undefined && submission.runtimeMs !== null && (
                                    <InfoItem label={t('runtime')} value={`${submission.runtimeMs} ms`} />
                                )}
                            </div>

                            {submission.errorMessage && (
                                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                                    <p className="mb-1 text-xs font-semibold text-red-800">{t('errorMessage')}</p>
                                    <pre className="whitespace-pre-wrap font-mono text-sm text-red-700">
                                        {submission.errorMessage}
                                    </pre>
                                </div>
                            )}

                            {submission.failedTestcase !== undefined && submission.failedTestcase !== null && (
                                <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3">
                                    <p className="text-sm text-yellow-800">
                                        <span className="font-semibold">{t('failedTestcase')}:</span>{' '}
                                        #{submission.failedTestcase}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="mb-2 text-sm font-semibold text-gray-700">{t('sourceCode')}</p>
                                <CodeEditor value={submission.code} readOnly />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function useSubmissionDetail() {
    const [isOpen, setIsOpen] = useState(false);
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const t = useTranslations('submissionDetail');

    const openDetail = async (submissionId: string) => {
        setIsOpen(true);
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/submissions/${submissionId}`);

            if (!response.ok) {
                throw new Error(t('fetchError', { status: response.status }));
            }

            const data: Submission = await response.json();
            setSubmission(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('loadError'));
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

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="mb-1 text-xs text-gray-500">{label}</p>
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

    const verdictConfig: Record<string, { bg: string; text: string; icon: typeof CheckCircleIcon }> = {
        AC: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
        WA: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircleIcon },
        TLE: { bg: 'bg-orange-100', text: 'text-orange-800', icon: ExclamationCircleIcon },
        RE: { bg: 'bg-purple-100', text: 'text-purple-800', icon: ExclamationCircleIcon },
        CE: { bg: 'bg-gray-100', text: 'text-gray-800', icon: ExclamationCircleIcon },
    };

    const style = verdictConfig[verdict] ?? {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: ExclamationCircleIcon,
    };
    const Icon = style.icon;

    return (
        <span className={`inline-flex items-center rounded-full ${style.bg} px-2.5 py-0.5 text-xs font-medium ${style.text}`}>
            <Icon className="mr-1 h-3 w-3" />
            {verdict}
        </span>
    );
}
