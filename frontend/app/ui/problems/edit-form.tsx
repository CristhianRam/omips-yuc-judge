/**
 * @file frontend/app/ui/problems/edit-form.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols EditForm, handleFileChange, handleUpload, handleDelete
 */

'use client';

import { Link } from '@/i18n/navigation';
import {
    ClockIcon,
    DocumentTextIcon,
    CpuChipIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { updateProblem, createTestCase, deleteTestCase } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import { Problem, TestCase } from '@/app/lib/definitions';
import { useTranslations } from 'next-intl';

export default function EditForm({ problem, testCases }: { problem: Problem, testCases: TestCase[] }) {
    const initialState = { message: null, errors: {} };
    const updateProblemWithId = updateProblem.bind(null, problem.id);
    // @ts-ignore
    const [state, dispatch] = useActionState(updateProblemWithId, initialState);

    // Initial state for new test case inputs
    const [newTestCase, setNewTestCase] = useState<{ name: string, input: File | null, output: File | null }>({ name: '', input: null, output: null });
    const [isUploading, setIsUploading] = useState(false);
    const t = useTranslations('problemForm');
    const tp = useTranslations('problems');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'input' | 'output') => {
        if (e.target.files && e.target.files[0]) {
            setNewTestCase({ ...newTestCase, [type]: e.target.files[0] });
        }
    };

    const handleUpload = async () => {
        if (!newTestCase.input || !newTestCase.output) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append('name', newTestCase.name || `${t('testCase')} ${testCases.length + 1}`);
        formData.append('input_file', newTestCase.input);
        formData.append('output_file', newTestCase.output);

        await createTestCase(problem.id, formData);
        setIsUploading(false);
        setNewTestCase({ name: '', input: null, output: null });
        // Refresh the page to show new test case
        window.location.reload();
    };

    const handleDelete = async (testCaseId: string) => {
        if (confirm(t('deleteConfirm'))) {
            await deleteTestCase(problem.id, testCaseId);
            window.location.reload();
        }
    }

    return (
        <div className="space-y-6">
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
                                defaultValue={problem.title}
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
                                defaultValue={problem.description}
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
                                defaultValue={problem.time_limit_ms}
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
                                defaultValue={problem.memory_limit_mb}
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
                                        defaultChecked={problem.difficulty === 'easy'}
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
                                        defaultChecked={problem.difficulty === 'medium'}
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
                                        defaultChecked={problem.difficulty === 'hard'}
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
                        href="/dashboard/problems"
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        {t('cancel')}
                    </Link>
                    <Button type="submit">{t('updateProblem')}</Button>
                </div>
            </form>

            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <h3 className="mb-4 text-lg font-medium">{t('manageTestCases')}</h3>
                <div className="space-y-4 mb-6">
                    {testCases.map((tc, index) => (
                        <div key={tc.id} className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-4">
                            <div>
                                <p className="text-sm font-semibold">{tc.name || `${t('testCase')} ${index + 1}`}</p>
                                <p className="text-xs text-gray-500">{t('id')}: {tc.id}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleDelete(tc.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                {t('delete')}
                            </button>
                        </div>
                    ))}
                    {testCases.length === 0 && <p className="text-sm text-gray-500">{t('noTestCasesFound')}</p>}
                </div>

                <div className="rounded-md border border-gray-200 bg-white p-4">
                    <h4 className="mb-2 text-sm font-medium">{t('addNewTestCase')}</h4>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700">{t('nameOptional')}</label>
                            <input
                                type="text"
                                value={newTestCase.name}
                                onChange={(e) => setNewTestCase({ ...newTestCase, name: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="col-span-2 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700">{t('input')}</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, 'input')}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">{t('output')}</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, 'output')}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button type="button" onClick={handleUpload} disabled={isUploading || !newTestCase.input || !newTestCase.output}>
                            {isUploading ? t('uploading') : t('addTestCaseAction')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
