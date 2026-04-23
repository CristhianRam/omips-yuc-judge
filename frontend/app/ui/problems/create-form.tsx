/**
 * @file frontend/app/ui/problems/create-form.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols Form, addTestCase, removeTestCase
 */

'use client';

import { Link } from '@/i18n/navigation';
import {
    CheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
    DocumentTextIcon,
    CpuChipIcon,
    SignalIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createProblem } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Form() {
    const initialState = { message: null, errors: {} };
    // @ts-ignore
    const [state, dispatch] = useActionState(createProblem, initialState);
    const t = useTranslations('problemForm');
    const tp = useTranslations('problems');

    const [testCases, setTestCases] = useState([{ id: 0 }]);

    const addTestCase = () => {
        setTestCases([...testCases, { id: Date.now() }]);
    };

    const removeTestCase = (id: number) => {
        setTestCases(testCases.filter((tc) => tc.id !== id));
    };

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Problem Title */}
                <div className="mb-4">
                    <label htmlFor="title" className="mb-2 block text-sm font-medium">
                        {t('title')}
                    </label>
                    <div className="relative">
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder={t('titlePlaceholder')}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="title-error"
                        />
                        <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                    <div id="title-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.title &&
                            state.errors.title.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-500">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Problem Description */}
                <div className="mb-4">
                    <label htmlFor="description" className="mb-2 block text-sm font-medium">
                        {t('description')}
                    </label>
                    <div className="relative">
                        <textarea
                            id="description"
                            name="description"
                            placeholder={t('descriptionPlaceholder')}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500 min-h-[150px]"
                            aria-describedby="description-error"
                        />
                    </div>
                    <div id="description-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.description &&
                            state.errors.description.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-500">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Time Limit */}
                <div className="mb-4">
                    <label htmlFor="time_limit_ms" className="mb-2 block text-sm font-medium">
                        {t('timeLimit')}
                    </label>
                    <div className="relative">
                        <input
                            id="time_limit_ms"
                            name="time_limit_ms"
                            type="number"
                            defaultValue={1000}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="time-error"
                        />
                        <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                    <div id="time-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.time_limit_ms &&
                            state.errors.time_limit_ms.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-500">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Memory Limit */}
                <div className="mb-4">
                    <label htmlFor="memory_limit_mb" className="mb-2 block text-sm font-medium">
                        {t('memoryLimit')}
                    </label>
                    <div className="relative">
                        <input
                            id="memory_limit_mb"
                            name="memory_limit_mb"
                            type="number"
                            defaultValue={256}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="memory-error"
                        />
                        <CpuChipIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                    <div id="memory-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.memory_limit_mb &&
                            state.errors.memory_limit_mb.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-500">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Difficulty */}
                <fieldset>
                    <legend className="mb-2 block text-sm font-medium">
                        {t('difficulty')}
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <input
                                    id="easy"
                                    name="difficulty"
                                    type="radio"
                                    value="easy"
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                />
                                <label
                                    htmlFor="easy"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-600"
                                >
                                    {tp('easy')}
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="medium"
                                    name="difficulty"
                                    type="radio"
                                    value="medium"
                                    defaultChecked
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                />
                                <label
                                    htmlFor="medium"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-medium text-yellow-600"
                                >
                                    {tp('medium')}
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="hard"
                                    name="difficulty"
                                    type="radio"
                                    value="hard"
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                />
                                <label
                                    htmlFor="hard"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600"
                                >
                                    {tp('hard')}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div id="difficulty-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.difficulty &&
                            state.errors.difficulty.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-500">
                                    {error}
                                </p>
                            ))}
                    </div>
                </fieldset>

                {/* Test Cases Upload */}
                <div className="mt-6 mb-4">
                    <div className='flex justify-between items-center mb-2'>
                        <label className="block text-sm font-medium">
                            {t('testCasesOptional')}
                        </label>
                        <button
                            type="button"
                            onClick={addTestCase}
                            className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100"
                        >
                            + {t('addTestCase')}
                        </button>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">{t('uploadPairsHint')}</p>
                        {testCases.map((tc: { id: number }, index: number) => (
                            <div key={tc.id} className="rounded-md border border-gray-200 bg-white p-4 relative">
                                <button
                                    type="button"
                                    onClick={() => removeTestCase(tc.id)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                >
                                    <span className="sr-only">{t('remove')}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <p className="text-xs font-semibold text-gray-700 mb-2">{t('testCase')} {index + 1}</p>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">{t('input')}</label>
                                        <input
                                            type="file"
                                            name={`input_file_${index}`}
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">{t('output')}</label>
                                        <input
                                            type="file"
                                            name={`output_file_${index}`}
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {testCases.length === 0 && (
                            <p className="text-sm text-gray-400 italic">{t('noTestCasesAdded')}</p>
                        )}
                    </div>
                </div>

                <div id="form-error" aria-live="polite" aria-atomic="true">
                    {state.message && (
                        <p className={`mt-2 text-sm ${state.message.toLowerCase().includes('failed') ? 'text-red-500' : 'text-green-600'}`}>
                            {state.message}
                        </p>
                    )}
                </div>

            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/problems"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    {t('cancel')}
                </Link>
                <Button type="submit">{t('createProblem')}</Button>
            </div>
        </form>
    );
}
