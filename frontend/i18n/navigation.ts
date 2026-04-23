/**
 * @file frontend/i18n/navigation.ts
 * @description Configuracion de internacionalizacion del frontend.
 * @symbols N/A
 */

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
