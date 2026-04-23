/**
 * @file frontend/app/ui/users/filters.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols UserFilters, handleFilterChange
 */

'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function UserFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const t = useTranslations('users');

    const ROLE_OPTIONS = [
        { label: t('allRoles'), value: '' },
        { label: t('student'), value: 'student' },
        { label: t('coach'), value: 'coach' },
        { label: t('admin'), value: 'admin' },
    ];

    const currentRole = searchParams.get('role') || '';

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
                className="block w-full min-w-[11rem] rounded-md border border-gray-200 py-[9px] pl-3 pr-9 text-sm outline-2 placeholder:text-gray-500 sm:w-auto"
                value={currentRole}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                aria-label={t('allRoles')}
            >
                {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
