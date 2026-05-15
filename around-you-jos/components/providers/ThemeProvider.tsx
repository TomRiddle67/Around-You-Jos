"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Why a wrapper component?
 * next-themes requires "use client" but our root layout is a
 * Server Component. We can't add "use client" to layout.tsx
 * without making the entire app client-side.
 *
 * Solution: wrap the provider in its own client component,
 * then import that into the server layout. The layout stays
 * a Server Component — only this tiny wrapper is client-side.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}