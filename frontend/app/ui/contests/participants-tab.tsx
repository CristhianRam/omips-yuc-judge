/**
 * @file frontend/app/ui/contests/participants-tab.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols ParticipantsTab
 */

'use client';

import { UserPublic } from '@/app/lib/definitions';
import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ParticipantsTab({
    participants,
}: {
    participants: UserPublic[];
}) {
    const t = useTranslations('contests.detail');
    const tu = useTranslations('users');

    if (participants.length === 0) {
        return (
            <div className="rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                {t('noParticipants')}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <div className="md:hidden">
                {participants.map((user, idx) => (
                    <div key={user.id} className="mb-2 rounded-md bg-white p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex min-w-0 items-center gap-2">
                                <Users className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">{user.username}</p>
                                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-700">
                                {user.role}
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">#{idx + 1}</p>
                    </div>
                ))}
            </div>

            <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                        <th className="px-4 py-3 font-medium">#</th>
                        <th className="px-4 py-3 font-medium">{t('user')}</th>
                        <th className="px-4 py-3 font-medium">{tu('email')}</th>
                        <th className="px-4 py-3 font-medium">{tu('role')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {participants.map((user, idx) => (
                        <tr key={user.id} className="border-b text-sm last-of-type:border-none hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">{user.username}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-gray-500">{user.email}</td>
                            <td className="px-4 py-3">
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-700">
                                    {user.role}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
