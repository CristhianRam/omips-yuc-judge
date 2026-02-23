'use client';

import Link from 'next/link';
import { UserIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { updateUserRole } from '@/app/lib/actions';
import { useActionState } from 'react';
import { User } from '@/app/lib/definitions';

export default function EditUserForm({ user }: { user: User }) {
    const initialState = { message: null, errors: {} };
    const updateUserRoleWithId = updateUserRole.bind(null, user.id);
    // @ts-ignore
    const [state, dispatch] = useActionState(updateUserRoleWithId, initialState);

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* User Info Display (Read Only) */}
                <div className="mb-4">
                    <label htmlFor="username" className="mb-2 block text-sm font-medium">
                        Username
                    </label>
                    <div className="relative">
                        <input
                            id="username"
                            type="text"
                            defaultValue={user.username}
                            disabled
                            className="peer block w-full rounded-md border border-gray-200 bg-gray-100 py-2 text-sm outline-2 text-gray-500 pl-10 cursor-not-allowed"
                        />
                        <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        Email
                    </label>
                    <div className="relative">
                        <input
                            id="email"
                            type="email"
                            defaultValue={user.email}
                            disabled
                            className="peer block w-full rounded-md border border-gray-200 bg-gray-100 py-2 text-sm outline-2 text-gray-500 pl-3 cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Role */}
                <fieldset>
                    <legend className="mb-2 block text-sm font-medium">
                        Role
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <input
                                    id="student"
                                    name="role"
                                    type="radio"
                                    value="student"
                                    defaultChecked={user.role === 'student'}
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                />
                                <label
                                    htmlFor="student"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-800"
                                >
                                    Student
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="coach"
                                    name="role"
                                    type="radio"
                                    value="coach"
                                    defaultChecked={user.role === 'coach'}
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                />
                                <label
                                    htmlFor="coach"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800"
                                >
                                    Coach
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="admin"
                                    name="role"
                                    type="radio"
                                    value="admin"
                                    defaultChecked={user.role === 'admin'}
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                />
                                <label
                                    htmlFor="admin"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1.5 text-xs font-medium text-purple-800"
                                >
                                    Admin
                                </label>
                            </div>
                        </div>
                    </div>
                    <div id="role-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.role &&
                            state.errors.role.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-500">
                                    {error}
                                </p>
                            ))}
                    </div>
                </fieldset>

                <div id="form-error" aria-live="polite" aria-atomic="true">
                    {state.message && (
                        <p className="mt-2 text-sm text-red-500">
                            {state.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/users"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Update User Role</Button>
            </div>
        </form>
    );
}
