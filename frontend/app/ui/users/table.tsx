import { fetchUsers } from '@/app/lib/data';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { UpdateUser } from '@/app/ui/users/buttons';
import { auth } from '@/auth';

export default async function UsersTable({
    currentPage,
    role,
}: {
    currentPage: number;
    role?: string;
}) {
    const session = await auth();
    const currentRole = session?.user?.role || 'student';
    const users = await fetchUsers(currentPage, role);

    if (!users || users.length === 0) {
        return (
            <div className="mt-6 rounded-md bg-gray-50 p-4">
                <p className="text-sm text-gray-500">No users found.</p>
            </div>
        );
    }

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    {/* Mobile view */}
                    <div className="md:hidden">
                        {users.map((user) => (
                            <Link
                                key={user.id}
                                href={`/dashboard/users/${user.id}`}
                                className="block mb-2 w-full rounded-md bg-white p-4 hover:bg-blue-50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">{user.username}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RoleBadge role={user.role} />
                                        {currentRole === 'admin' && <UpdateUser id={user.id} />}
                                        <ChevronRight size={16} className="text-gray-400" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop table */}
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Username</th>
                                <th scope="col" className="px-3 py-5 font-medium">Email</th>
                                <th scope="col" className="px-3 py-5 font-medium">Role</th>
                                <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">View</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none hover:bg-gray-50 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <p className="font-bold">{user.username}</p>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {user.email}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-2">
                                            {currentRole === 'admin' && <UpdateUser id={user.id} />}
                                            <Link
                                                href={`/dashboard/users/${user.id}`}
                                                className="flex items-center gap-1 text-blue-600 font-medium hover:underline"
                                            >
                                                View <ChevronRight size={16} />
                                            </Link>
                                        </div>
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

function RoleBadge({ role }: { role: string }) {
    return (
        <span className={clsx(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase',
            {
                'bg-purple-100 text-purple-800': role === 'admin',
                'bg-blue-100 text-blue-800': role === 'coach',
                'bg-gray-100 text-gray-800': role === 'student',
            }
        )}>
            {role}
        </span>
    );
}
