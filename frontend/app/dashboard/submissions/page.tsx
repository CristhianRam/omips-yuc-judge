import {auth} from '@/auth';
import { lusitana } from '@/app/ui/fonts';

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const session = await auth();
  const role = session?.user?.role;
  return <p> hola {role}</p>
}
