'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const ROLE_OPTIONS = [
    { label: 'All Roles', value: '' },
    { label: 'Student', value: 'student' },
    { label: 'Coach', value: 'coach' },
    { label: 'Admin', value: 'admin' },
];

export default function UserFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

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
        <div className="flex flex-wrap gap-3">
            <select
                className="rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500"
                value={currentRole}
                onChange={(e) => handleFilterChange('role', e.target.value)}
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
