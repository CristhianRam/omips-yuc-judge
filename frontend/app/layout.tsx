/**
 * @file frontend/app/layout.tsx
 * @description Modulo TypeScript del proyecto.
 * @symbols RootLayout
 */

// This root layout exists only as a fallback.
// The actual layout with <html>/<body> is in app/[locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
