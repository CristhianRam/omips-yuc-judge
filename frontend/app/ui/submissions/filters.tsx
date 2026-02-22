'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const VERDICT_OPTIONS = [
    { label: 'All Verdicts', value: '' },
    { label: 'Accepted', value: 'AC' },
    { label: 'Wrong Answer', value: 'WA' },
    { label: 'Time Limit Exceeded', value: 'TLE' },
    { label: 'Runtime Error', value: 'RE' },
    { label: 'Compilation Error', value: 'CE' },
];

const STATUS_OPTIONS = [
    { label: 'All Statuses', value: '' },
    { label: 'Queued', value: 'QUEUED' },
    { label: 'Judging', value: 'JUDGING' },
    { label: 'Completed', value: 'COMPLETED' },
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
