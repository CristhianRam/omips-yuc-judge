'use client';

import { useActionState } from 'react';
import { addProblemToContest } from '@/app/lib/actions';

export default function AddProblemForm({ contestId }: { contestId: number }) {
    const initialState = { message: null };
    const addProblemWithContestId = addProblemToContest.bind(null, contestId);
    // @ts-ignore
    const [state, formAction] = useActionState(addProblemWithContestId, initialState);

    return (
        <form action={formAction} className="flex flex-wrap items-end gap-3">
            <div>
                <label htmlFor="problem_id" className="block text-xs font-medium text-gray-600 mb-1">
                    Problem ID
                </label>
                <input
                    id="problem_id"
                    name="problem_id"
                    type="number"
                    placeholder="e.g. 1"
                    className="w-24 rounded-md border border-gray-200 py-1.5 px-2 text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="order" className="block text-xs font-medium text-gray-600 mb-1">
                    Order (Letter)
                </label>
                <input
                    id="order"
                    name="order"
                    type="text"
                    placeholder="e.g. A"
                    maxLength={3}
                    className="w-20 rounded-md border border-gray-200 py-1.5 px-2 text-sm uppercase"
                    required
                />
            </div>
            <div>
                <label htmlFor="points" className="block text-xs font-medium text-gray-600 mb-1">
                    Points
                </label>
                <input
                    id="points"
                    name="points"
                    type="number"
                    defaultValue={100}
                    className="w-20 rounded-md border border-gray-200 py-1.5 px-2 text-sm"
                />
            </div>
            <button
                type="submit"
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
                Add
            </button>
            {state.message && (
                <p className={`text-sm ${state.message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                    {state.message}
                </p>
            )}
        </form>
    );
}
