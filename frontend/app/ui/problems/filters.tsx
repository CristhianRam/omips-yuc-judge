/**
 * @file frontend/app/ui/problems/filters.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols ProblemFilters, handleFilterChange
 */

'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function ProblemFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const t = useTranslations('problems');

    const DIFFICULTY_OPTIONS = [
        { label: t('allDifficulties'), value: '' },
        { label: t('easy'), value: 'easy' },
        { label: t('medium'), value: 'medium' },
        { label: t('hard'), value: 'hard' },
    ];

    const currentDifficulty = searchParams.get('difficulty') || '';

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
        <div className="w-full sm:w-auto">
            <select
                className="block w-full min-w-[12rem] rounded-md border border-gray-200 py-[9px] pl-3 pr-9 text-sm outline-2 placeholder:text-gray-500 sm:w-auto"
                value={currentDifficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                aria-label={t('allDifficulties')}
            >
                {DIFFICULTY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
