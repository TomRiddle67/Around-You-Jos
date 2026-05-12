// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",          // Show text immediately with fallback font
  variable: "--font-inter", // Expose as CSS variable
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aroundyoujos.com"),
  title: {
    default: "Around You Jos — Discover Local Places & Services",
    template: "%s | Around You Jos",  // Pages set their own title, this appends the brand
  },
  description:
    "Your practical guide to discovering places, services, and neighborhood recommendations in Jos, Nigeria.",
  keywords: ["Jos", "Nigeria", "local businesses", "neighborhoods", "Plateau State", "discovery"],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://aroundyoujos.com",
    siteName: "Around You Jos",
    title: "Around You Jos — Discover Local Places & Services",
    description: "Your practical guide to discovering Jos, Nigeria.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@aroundyoujos",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}