/**
 * @file frontend/app/ui/contests/contest-tabs.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols ContestTabs
 */

'use client';

import { useMemo, useState } from 'react';
import { ContestProblemPublic, UserPublic, Scoreboard } from '@/app/lib/definitions';
import ProblemsTab from './problems-tab';
import ParticipantsTab from './participants-tab';
import ScoreboardTab from './scoreboard-tab';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

type Tab = 'problems' | 'participants' | 'scoreboard';

export default function ContestTabs({
    contestId,
    problems,
    participants,
    scoreboard,
    role,
    isOpen,
}: {
    contestId: number;
    problems: ContestProblemPublic[];
    participants: UserPublic[];
    scoreboard: Scoreboard | null;
    role: string;
    isOpen: boolean;
}) {
    const [activeTab, setActiveTab] = useState<Tab>('problems');
    const t = useTranslations('contests.detail');

    const tabs = useMemo(
        () => [
            { id: 'problems' as const, label: t('tabsProblems') },
            { id: 'participants' as const, label: t('tabsParticipants') },
            { id: 'scoreboard' as const, label: t('tabsScoreboard') },
        ],
        [t],
    );

    return (
        <div>
            <div className="mb-6 overflow-x-auto border-b border-gray-200">
                <div className="flex min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors -mb-px',
                                activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            )}
                        >
                            {tab.label}
                            {tab.id === 'participants' && (
                                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                    {participants.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'problems' && (
                <ProblemsTab contestId={contestId} problems={problems} role={role} isOpen={isOpen} />
            )}
            {activeTab === 'participants' && <ParticipantsTab participants={participants} />}
            {activeTab === 'scoreboard' && <ScoreboardTab scoreboard={scoreboard} />}
        </div>
    );
}
