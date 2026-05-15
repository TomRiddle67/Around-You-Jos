import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aroundyoujos.com"),
  title: {
    default: "Around You Jos — Discover Local Places & Services",
    template: "%s | Around You Jos",
  },
  description:
    "Your practical guide to discovering places, services, and neighborhoods in Jos, Nigeria.",
  keywords: ["Jos", "Nigeria", "local businesses", "neighborhoods", "Plateau State"],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://aroundyoujos.com",
    siteName: "Around You Jos",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}