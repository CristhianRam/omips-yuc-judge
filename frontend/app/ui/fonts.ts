/**
 * @file frontend/app/ui/fonts.ts
 * @description Componente de interfaz de usuario del frontend.
 * @symbols N/A
 */

import { Inter, Lusitana } from 'next/font/google';
 
export const inter = Inter({ subsets: ['latin'] });
 
export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});