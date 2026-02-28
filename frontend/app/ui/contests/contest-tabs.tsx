'use client';

import { useState } from 'react';
import { ContestProblemPublic, UserPublic, Scoreboard } from '@/app/lib/definitions';
import ProblemsTab from './problems-tab';
import ParticipantsTab from './participants-tab';
import ScoreboardTab from './scoreboard-tab';
import clsx from 'clsx';

const tabs = ['Problems', 'Participants', 'Scoreboard'] as const;
type Tab = typeof tabs[number];

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
    const [activeTab, setActiveTab] = useState<Tab>('Problems');

    return (
        <div>
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={clsx(
                            'px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                            activeTab === tab
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        )}
                    >
                        {tab}
                        {tab === 'Participants' && (
                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                {participants.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'Problems' && (
                <ProblemsTab
                    contestId={contestId}
                    problems={problems}
                    role={role}
                    isOpen={isOpen}
                />
            )}
            {activeTab === 'Participants' && (
                <ParticipantsTab participants={participants} />
            )}
            {activeTab === 'Scoreboard' && (
                <ScoreboardTab scoreboard={scoreboard} />
            )}
        </div>
    );
}
