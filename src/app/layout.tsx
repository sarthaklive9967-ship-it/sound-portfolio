import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { site } from "@/data/site";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl
    ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } }
    : {}),
  title: "Sound | Developer & Digital Creator",
  description: site.description,
  applicationName: site.name,
  authors: [{ name: "Sound", url: site.github }],
  keywords: [
    "Sound",
    "developer",
    "digital creator",
    "web development",
    "UI/UX",
    "Minecraft development",
    "Discord development",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: "Sound | Developer & Digital Creator",
    description: "Building digital experiences that feel different.",
    ...(siteUrl ? { url: siteUrl } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0D10",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
