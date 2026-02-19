import { lusitana } from '@/app/ui/fonts';

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard QuickSouls
      </h1>
      <div className="p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          Welcome to the KarelJudge Dashboard. Select "Problems" or "Contests" from the sidebar to get started.
        </p>
      </div>
    </main>
  );
}