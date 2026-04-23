/**
 * @file frontend/proxy.ts
 * @description Modulo TypeScript del proyecto.
 * @symbols N/A
 */

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// next-intl handles locale detection, redirects, and URL rewriting
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except API routes, Next.js internals, and static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};