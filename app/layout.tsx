import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
});

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Advicely Reactor",
  description:
    "Instant advice for 2026: one-click wisdom with adaptive tone, momentum tracking, and graceful fallback intelligence.",
  metadataBase: new URL("https://advicely.vercel.app"),
  openGraph: {
    title: "Advicely Reactor",
    description: "Generate focused advice instantly and turn it into daily momentum.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advicely Reactor",
    description: "One click. Better advice. Repeatable momentum.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`} suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
