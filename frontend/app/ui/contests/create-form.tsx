/**
 * @file frontend/app/ui/contests/create-form.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols CreateContestForm
 */

'use client';

import { useActionState } from 'react';
import { Link } from '@/i18n/navigation';
import { createContest } from '@/app/lib/actions';
import { useTranslations } from 'next-intl';

export default function CreateContestForm() {
    const initialState = { message: null, errors: {} };
    // @ts-ignore
    const [state, formAction] = useActionState(createContest, initialState);
    const t = useTranslations('contests.form');

    return (
        <form action={formAction}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4">
                    <label htmlFor="title" className="mb-2 block text-sm font-medium">
                        {t('title')}
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder={t('titlePlaceholder')}
                        className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-2 placeholder:text-gray-500"
                        required
                    />
                    {state.errors?.title && (
                        <p className="mt-1 text-sm text-red-500">{state.errors.title[0]}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="mb-2 block text-sm font-medium">
                        {t('description')}
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        placeholder={t('descriptionPlaceholder')}
                        className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-2 placeholder:text-gray-500"
                        required
                    />
                    {state.errors?.description && (
                        <p className="mt-1 text-sm text-red-500">{state.errors.description[0]}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="start_date" className="mb-2 block text-sm font-medium">
                        {t('startDate')}
                    </label>
                    <input
                        id="start_date"
                        name="start_date"
                        type="datetime-local"
                        className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-2"
                        required
                    />
                    {state.errors?.start_date && (
                        <p className="mt-1 text-sm text-red-500">{state.errors.start_date[0]}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="end_date" className="mb-2 block text-sm font-medium">
                        {t('endDate')} <span className="text-gray-400">({t('optional')})</span>
                    </label>
                    <input
                        id="end_date"
                        name="end_date"
                        type="datetime-local"
                        className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-2"
                    />
                </div>
            </div>

            {state.message && <p className="mt-2 text-sm text-red-500">{state.message}</p>}

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/contests"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    {t('cancel')}
                </Link>
                <button
                    type="submit"
                    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                    {t('createContest')}
                </button>
            </div>
        </form>
    );
}
