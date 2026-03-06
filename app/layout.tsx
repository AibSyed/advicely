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
  title: "Advicely | Random Advice and Quotes",
  description: "Draw random advice or quotes, keep personal notes locally, and save what is worth revisiting.",
  metadataBase: new URL("https://advicely.vercel.app"),
  openGraph: {
    title: "Advicely | Random Advice and Quotes",
    description: "An honesty-first deck for random advice, quotes, and local note-taking.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advicely | Random Advice and Quotes",
    description: "Random advice and quotes, clearly sourced and easy to save.",
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
