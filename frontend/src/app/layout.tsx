import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { company } from "@/lib/opektra";
import "./globals.css";
import "./opektra.css";
import "./studio.css";
import "./craft.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: { default: "Opektra — Thoughtful software. New possibilities.", template: "%s | Opektra" },
  description: company.description,
  alternates: { canonical: company.url },
  icons: { icon: [{ url: "/opektra/icon-32.png", sizes: "32x32", type: "image/png" }, { url: "/opektra/brand-mark.png", sizes: "512x512", type: "image/png" }], apple: "/opektra/icon-180.png" },
  openGraph: { title: "Opektra — Thoughtful software. New possibilities.", description: company.description, url: company.url, siteName: "Opektra", type: "website", images: [{ url: "/opektra/engineering-editorial.png", width: 1000, height: 650, alt: "Opektra software engineering" }] },
  robots: process.env.NEXT_PUBLIC_NOINDEX === "true" ? { index: false, follow: false } : { index: true, follow: true },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning><body className="opektra-site"><ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}><a className="op-skip" href="#main-content">Skip to main content</a><Header /><main id="main-content">{children}</main><Footer /></ThemeProvider><JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: company.name, legalName: company.legalName, url: company.url, description: company.description, email: company.email, logo: `${company.url}/opektra/brand-mark.png` }} /></body></html>;
}
