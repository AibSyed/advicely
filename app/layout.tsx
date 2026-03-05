import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const displayFont = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Advicely | Practical Advice Studio",
  description: "Generate useful advice quickly, save what helps, and find it later.",
  metadataBase: new URL("https://advicely.vercel.app"),
  openGraph: {
    title: "Advicely | Practical Advice Studio",
    description: "Instant practical advice with saved and history workflows.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advicely | Practical Advice Studio",
    description: "Useful advice fast, with clean save and share flows.",
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
