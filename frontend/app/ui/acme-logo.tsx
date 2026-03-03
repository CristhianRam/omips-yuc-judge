import { lusitana } from '@/app/ui/fonts';
import OmipsIcon from '@/app/ui/omips-icon';

export default function OmipsLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center gap-3 leading-none text-white`}
    >
      <OmipsIcon width={140} />
      <span className="text-3xl font-bold tracking-tight">KarelJudge</span>
    </div>
  );
}
