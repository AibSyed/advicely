import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Providers } from "@/components/providers";
import { RouteFrame } from "@/components/route-frame";
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
  title: {
    default: "Advicely | Draw Advice and Quotes",
    template: "%s | Advicely",
  },
  description:
    "Draw advice and quote cards from live sources, save what resonates, and keep optional notes private in your browser.",
  metadataBase: new URL("https://advicely.vercel.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  openGraph: {
    title: "Advicely | Draw Advice and Quotes",
    description:
      "Draw advice and quote cards from live sources, save what resonates, and keep optional notes private in your browser.",
    url: "/",
    siteName: "Advicely",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Advicely social preview card showing Draw advice and quotes with a calm neutral visual style",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Advicely | Draw Advice and Quotes",
    description:
      "Draw advice and quote cards from live sources, save what resonates, and keep optional notes private in your browser.",
    images: [
      {
        url: "/twitter-image",
        alt: "Advicely social preview card showing Draw advice and quotes with source aware framing",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
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
          <RouteFrame>{children}</RouteFrame>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
