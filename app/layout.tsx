import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Advicely | Find a Line Worth Keeping",
  description: "Draw a piece of advice or a quote, save the ones that stick, and keep a private note when you want to remember why.",
  metadataBase: new URL("https://advicely.vercel.app"),
  openGraph: {
    title: "Advicely | Find a Line Worth Keeping",
    description: "Draw a piece of advice or a quote, save what resonates, and keep a private note for later.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advicely | Find a Line Worth Keeping",
    description: "Draw a piece of advice or a quote, save what resonates, and keep a private note for later.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`} suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Providers>
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
