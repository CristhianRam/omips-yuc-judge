import { lusitana } from '@/app/ui/fonts';
import { auth } from '@/auth';
import { fetchDashboardStats } from '@/app/lib/data';
import { DashboardCards } from '@/app/ui/dashboard/cards';
import { RecentActivity } from '@/app/ui/dashboard/recent-activity';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const session = await auth();
  const role = session?.user?.role || 'student';
  const userId = session?.user?.id || '';
  const username = session?.user?.username || 'User';

  const stats = await fetchDashboardStats(role, userId);
  const t = await getTranslations('dashboard');

  const greeting =
    role === 'admin' || role === 'coach'
      ? t('greetingCoach', { name: username })
      : t('greetingStudent', { name: username });

  return (
    <main>
      <div className="mb-6">
        <h1 className={`${lusitana.className} text-2xl font-bold text-gray-900 md:text-3xl`}>
          {greeting}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {t('subtitle')}
        </p>
      </div>

      <DashboardCards
        role={role}
        totalProblems={stats.totalProblems}
        totalContests={stats.totalContests}
        thirdCardValue={stats.thirdCardValue}
      />

      <RecentActivity submissions={stats.recentSubmissions} />
    </main>
  );
}