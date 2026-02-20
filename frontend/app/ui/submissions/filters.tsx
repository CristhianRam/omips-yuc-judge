'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const VERDICT_OPTIONS = [
    { label: 'All Verdicts', value: '' },
    { label: 'Accepted', value: 'Accepted' },
    { label: 'Wrong Answer', value: 'Wrong Answer' },
    { label: 'Time Limit Exceeded', value: 'Time Limit Exceeded' },
    { label: 'Runtime Error', value: 'Runtime Error' },
    { label: 'Compilation Error', value: 'Compilation Error' },
];

const STATUS_OPTIONS = [
    { label: 'All Statuses', value: '' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Compiling', value: 'Compiling' },
    { label: 'Running', value: 'Running' },
    { label: 'Done', value: 'Done' },
];

export default function SubmissionFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

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
        <div className="flex flex-wrap gap-3">
            <select
                className="rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500"
                value={currentVerdict}
                onChange={(e) => handleFilterChange('verdict', e.target.value)}
            >
                {VERDICT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <select
                className="rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500"
                value={currentStatus}
                onChange={(e) => handleFilterChange('status', e.target.value)}
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
