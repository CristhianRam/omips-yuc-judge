import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from '@/i18n/navigation';
import { deleteProblem } from '@/app/lib/actions';
import { getTranslations } from 'next-intl/server';

export async function CreateProblem() {
    const t = await getTranslations('problems');
    return (
        <Link
            href="/dashboard/problems/create"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <span className="hidden md:block">{t('createProblem')}</span>{' '}
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}

export function UpdateProblem({ id }: { id: number }) {
    return (
        <Link
            href={`/dashboard/problems/${id}/edit`}
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <PencilIcon className="w-5" />
        </Link>
    );
}

export function DeleteProblem({ id }: { id: number }) {
    const deleteProblemWithId = deleteProblem.bind(null, id);

    return (
        <form action={deleteProblemWithId}>
            <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-5" />
            </button>
        </form>
    );
}