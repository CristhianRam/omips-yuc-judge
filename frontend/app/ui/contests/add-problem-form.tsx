/**
 * @file frontend/app/ui/contests/add-problem-form.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols AddProblemForm
 */

'use client';

import { useActionState } from 'react';
import { addProblemToContest } from '@/app/lib/actions';
import { useTranslations } from 'next-intl';

export default function AddProblemForm({ contestId }: { contestId: number }) {
    const initialState = { message: null };
    const addProblemWithContestId = addProblemToContest.bind(null, contestId);
    // @ts-ignore
    const [state, formAction] = useActionState(addProblemWithContestId, initialState);
    const t = useTranslations('contests.form');

    return (
        <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
            <div>
                <label htmlFor="problem_id" className="mb-1 block text-xs font-medium text-gray-600">
                    {t('problemId')}
                </label>
                <input
                    id="problem_id"
                    name="problem_id"
                    type="number"
                    placeholder="1"
                    className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm lg:w-28"
                    required
                />
            </div>
            <div>
                <label htmlFor="order" className="mb-1 block text-xs font-medium text-gray-600">
                    {t('order')}
                </label>
                <input
                    id="order"
                    name="order"
                    type="text"
                    placeholder="A"
                    maxLength={3}
                    className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm uppercase lg:w-24"
                    required
                />
            </div>
            <div>
                <label htmlFor="points" className="mb-1 block text-xs font-medium text-gray-600">
                    {t('points')}
                </label>
                <input
                    id="points"
                    name="points"
                    type="number"
                    defaultValue={100}
                    className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm lg:w-24"
                />
            </div>
            <button
                type="submit"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 lg:py-1.5"
            >
                {t('add')}
            </button>
            {state.message && (
                <p className={`text-sm ${state.message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                    {state.message}
                </p>
            )}
        </form>
    );
}
