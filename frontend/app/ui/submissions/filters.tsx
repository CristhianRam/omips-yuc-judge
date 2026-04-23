/**
 * @file frontend/app/ui/submissions/filters.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols SubmissionFilters, handleFilterChange
 */

'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SubmissionFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const t = useTranslations('submissions');

    const VERDICT_OPTIONS = [
        { label: t('allVerdicts'), value: '' },
        { label: t('accepted'), value: 'AC' },
        { label: t('wrongAnswer'), value: 'WA' },
        { label: t('timeLimitExceeded'), value: 'TLE' },
        { label: t('runtimeError'), value: 'RE' },
        { label: t('compilationError'), value: 'CE' },
    ];

    const STATUS_OPTIONS = [
        { label: t('allStatuses'), value: '' },
        { label: t('queued'), value: 'QUEUED' },
        { label: t('judging'), value: 'JUDGING' },
        { label: t('completed'), value: 'COMPLETED' },
    ];

    const currentVerdict = searchParams.get('verdict') || '';
    const currentStatus = searchParams.get('status') || '';

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-2">
            <select
                className="block w-full min-w-[12rem] rounded-md border border-gray-200 py-[9px] pl-3 pr-9 text-sm outline-2 placeholder:text-gray-500"
                value={currentVerdict}
                onChange={(e) => handleFilterChange('verdict', e.target.value)}
                aria-label={t('allVerdicts')}
            >
                {VERDICT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <select
                className="block w-full min-w-[11rem] rounded-md border border-gray-200 py-[9px] pl-3 pr-9 text-sm outline-2 placeholder:text-gray-500"
                value={currentStatus}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                aria-label={t('allStatuses')}
            >
                {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
