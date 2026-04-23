/**
 * @file frontend/app/ui/contests/edit-form.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols EditContestForm, toLocalDateTimeValue
 */

'use client';

import { useActionState } from 'react';
import { Link } from '@/i18n/navigation';
import { updateContest } from '@/app/lib/actions';
import { ContestPublic } from '@/app/lib/definitions';
import { useTranslations } from 'next-intl';

function toLocalDateTimeValue(isoString: string): string {
    const d = new Date(isoString);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
}

export default function EditContestForm({ contest }: { contest: ContestPublic }) {
    const initialState = { message: null, errors: {} };
    const updateContestWithId = updateContest.bind(null, contest.id);
    // @ts-ignore
    const [state, formAction] = useActionState(updateContestWithId, initialState);
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
                        defaultValue={contest.title}
                        className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-2 placeholder:text-gray-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="mb-2 block text-sm font-medium">
                        {t('description')}
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        defaultValue={contest.description}
                        className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-2 placeholder:text-gray-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="open" className="mb-2 block text-sm font-medium">
                        {t('openForRegistration')}
                    </label>
                    <select
                        id="open"
                        name="open"
                        defaultValue={contest.open ? 'true' : 'false'}
                        className="block w-full rounded-md border border-gray-200 py-2 pl-3 pr-9 text-sm outline-2"
                    >
                        <option value="true">{t('yesOpen')}</option>
                        <option value="false">{t('noClosed')}</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="start_date" className="mb-2 block text-sm font-medium">
                        {t('startDate')}
                    </label>
                    <input
                        id="start_date"
                        name="start_date"
                        type="datetime-local"
                        defaultValue={toLocalDateTimeValue(contest.start_date)}
                        className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="end_date" className="mb-2 block text-sm font-medium">
                        {t('endDate')} <span className="text-gray-400">({t('optional')})</span>
                    </label>
                    <input
                        id="end_date"
                        name="end_date"
                        type="datetime-local"
                        defaultValue={contest.end_date ? toLocalDateTimeValue(contest.end_date) : ''}
                        className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-2"
                    />
                </div>
            </div>

            {state.message && <p className="mt-2 text-sm text-red-500">{state.message}</p>}

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href={`/dashboard/contests/${contest.id}`}
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    {t('cancel')}
                </Link>
                <button
                    type="submit"
                    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                    {t('updateContest')}
                </button>
            </div>
        </form>
    );
}
