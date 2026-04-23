/**
 * @file frontend/i18n/routing.ts
 * @description Configuracion de internacionalizacion del frontend.
 * @symbols N/A
 */

import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['es', 'en'],
    defaultLocale: 'es',
});
