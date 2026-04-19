import AcmeLogo from '@/app/ui/acme-logo';
import VerifyEmailForm from '@/app/ui/verify-email-form';

type VerifyEmailPageProps = {
  searchParams?: Promise<{
    email?: string;
  }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialEmail =
    typeof resolvedSearchParams?.email === 'string'
      ? resolvedSearchParams.email
      : '';

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[420px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <VerifyEmailForm initialEmail={initialEmail} />
      </div>
    </main>
  );
}
