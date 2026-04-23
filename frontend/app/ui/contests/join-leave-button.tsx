/**
 * @file frontend/app/ui/contests/join-leave-button.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols JoinLeaveButton, handleJoin, handleLeave
 */

'use client';

import { useState, useTransition } from 'react';
import { joinContest, leaveContest } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function JoinLeaveButton({
    contestId,
    isParticipant,
    isOpen,
    isFinished,
}: {
    contestId: number;
    isParticipant: boolean;
    isOpen: boolean;
    isFinished: boolean;
}) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
    const t = useTranslations('contests.detail');

    const handleJoin = () => {
        startTransition(async () => {
            const result = await joinContest(contestId);
            setMessage(result.message);
            router.refresh();
        });
    };

    const handleLeave = () => {
        startTransition(async () => {
            const result = await leaveContest(contestId);
            setMessage(result.message);
            router.refresh();
        });
    };

    if (isFinished) {
        return (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
                {t('contestFinished')}
            </span>
        );
    }

    return (
        <div>
            {isParticipant ? (
                <button
                    onClick={handleLeave}
                    disabled={isPending}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isPending ? t('leaving') : t('leaveContest')}
                </button>
            ) : (
                <button
                    onClick={handleJoin}
                    disabled={isPending || !isOpen}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                    title={!isOpen ? t('registrationClosedShort') : ''}
                >
                    {isPending ? t('joining') : !isOpen ? t('registrationClosedShort') : t('joinContest')}
                </button>
            )}
            {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        </div>
    );
}
