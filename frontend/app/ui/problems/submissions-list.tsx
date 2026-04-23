/**
 * @file frontend/app/ui/problems/submissions-list.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols N/A
 */


import { fetchMySubmissions } from '@/app/lib/data';
import { auth } from '@/auth';
import SubmissionsTableBody from '@/app/ui/submissions/submissions-table-body';
import { getTranslations } from 'next-intl/server';

export default async function SubmissionsList({ problemId }: { problemId: number }) {
    const submissions = await fetchMySubmissions(problemId);
    const session = await auth();
    const accessToken = session?.user?.accessToken || '';
    const t = await getTranslations('problemDetail');

    if (!submissions || submissions.length === 0) {
        return (
            <div className="mt-6 rounded-md bg-gray-50 p-4">
                <p className="text-sm text-gray-500">{t('noSubmissionsYet')}</p>
            </div>
        );
    }

    return (
        <div className="mt-6 flow-root">
            <h3 className="mb-4 text-lg font-semibold">{t('mySubmissions')}</h3>
            <SubmissionsTableBody
                submissions={submissions}
                accessToken={accessToken}
                showProblem={false}
                showUser={false}
                showRuntime={true}
            />
        </div>
    );
}
