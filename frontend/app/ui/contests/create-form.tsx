'use client';

import { useActionState } from 'react';
import { Link } from '@/i18n/navigation';
import { createContest } from '@/app/lib/actions';

export default function CreateContestForm() {
    const initialState = { message: null, errors: {} };
    // @ts-ignore
    const [state, formAction] = useActionState(createContest, initialState);

    return (
        <form action={formAction}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Title */}
                <div className="mb-4">
                    <label htmlFor="title" className="mb-2 block text-sm font-medium">
                        Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Enter contest title"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                        required
                    />
                    {state.errors?.title && (
                        <p className="mt-1 text-sm text-red-500">{state.errors.title[0]}</p>
                    )}
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label htmlFor="description" className="mb-2 block text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Describe the contest..."
                        className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                        required
                    />
                    {state.errors?.description && (
                        <p className="mt-1 text-sm text-red-500">{state.errors.description[0]}</p>
                    )}
                </div>

                {/* Start Date */}
                <div className="mb-4">
                    <label htmlFor="start_date" className="mb-2 block text-sm font-medium">
                        Start Date
                    </label>
                    <input
                        id="start_date"
                        name="start_date"
                        type="datetime-local"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
                        required
                    />
                    {state.errors?.start_date && (
                        <p className="mt-1 text-sm text-red-500">{state.errors.start_date[0]}</p>
                    )}
                </div>

                {/* End Date */}
                <div className="mb-4">
                    <label htmlFor="end_date" className="mb-2 block text-sm font-medium">
                        End Date <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                        id="end_date"
                        name="end_date"
                        type="datetime-local"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
                    />
                </div>
            </div>

            {state.message && (
                <p className="mt-2 text-sm text-red-500">{state.message}</p>
            )}

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/contests"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                    Create Contest
                </button>
            </div>
        </form>
    );
}
