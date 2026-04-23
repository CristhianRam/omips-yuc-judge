/**
 * @file frontend/app/ui/acme-logo.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols OmipsLogo
 */

import { lusitana } from '@/app/ui/fonts';
import OmipsIcon from '@/app/ui/omips-icon';

export default function OmipsLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center gap-3 leading-none text-white`}
    >
      <OmipsIcon className="w-16 md:w-36" />
      <span className="text-xl md:text-3xl font-bold tracking-tight">BeeperCode</span>
    </div>
  );
}
