'use client';

import { useState, useTransition } from 'react';
import { joinContest, leaveContest } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';

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
                Contest Finished
            </span>
        );
    }

    return (
        <div>
            {isParticipant ? (
                <button
                    onClick={handleLeave}
                    disabled={isPending}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Leaving...' : 'Leave Contest'}
                </button>
            ) : (
                <button
                    onClick={handleJoin}
                    disabled={isPending || !isOpen}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!isOpen ? 'Registration is closed' : ''}
                >
                    {isPending ? 'Joining...' : !isOpen ? 'Registration Closed' : 'Join Contest'}
                </button>
            )}
            {message && (
                <p className="mt-2 text-sm text-gray-600">{message}</p>
            )}
        </div>
    );
}
