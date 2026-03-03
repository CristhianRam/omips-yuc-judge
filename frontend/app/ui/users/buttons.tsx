import { PencilIcon } from '@heroicons/react/24/outline';
import { Link } from '@/i18n/navigation';

export function UpdateUser({ id }: { id: string }) {
    return (
        <Link
            href={`/dashboard/users/${id}/edit`}
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <PencilIcon className="w-5" />
        </Link>
    );
}
