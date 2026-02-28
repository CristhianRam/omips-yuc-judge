import { UserPublic } from '@/app/lib/definitions';
import { Users } from 'lucide-react';

export default function ParticipantsTab({
    participants,
}: {
    participants: UserPublic[];
}) {
    if (participants.length === 0) {
        return (
            <div className="rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                No participants yet.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-gray-900">
                <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                        <th className="px-4 py-3 font-medium">#</th>
                        <th className="px-4 py-3 font-medium">Username</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {participants.map((user, idx) => (
                        <tr
                            key={user.id}
                            className="border-b text-sm last-of-type:border-none hover:bg-gray-50"
                        >
                            <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />
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
