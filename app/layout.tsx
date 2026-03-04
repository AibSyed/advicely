import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import { Providers } from "@/components/providers";
import "@/app/globals.css";

const heading = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-heading" });
const body = Outfit({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Advicely Coach",
  description: "Guided daily coaching with reflection prompts and micro-action loops.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
