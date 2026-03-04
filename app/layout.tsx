import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import { Providers } from "@/components/providers";
import "@/app/globals.css";

const display = Outfit({ subsets: ["latin"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Advicely Momentum Coach",
  description: "Gamified momentum coaching with streak progression, reflection loops, and safety-checked prompts.",
  metadataBase: new URL("https://advicely.vercel.app"),
  icons: { icon: "/icon", apple: "/apple-icon" },
  openGraph: {
    title: "Advicely Momentum Coach",
    description: "Gamified coaching loop with progression and safety-first prompts.",
    images: "/opengraph-image",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advicely Momentum Coach",
    description: "Gamified coaching loop with progression and safety-first prompts.",
    images: "/twitter-image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
