import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/i18n";
import { dictionaries } from "@/lib/dictionaries";
import { SITE_URL } from "@/lib/site";
import { I18nProvider } from "@/components/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = dictionaries[locale];
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: "%s · FushëkosovaBB" },
    description: t.meta.description,
    applicationName: "FushëkosovaBB",
    openGraph: {
      type: "website",
      siteName: "FushëkosovaBB",
      title: t.meta.title,
      description: t.meta.description,
      locale: locale === "sq" ? "sq_AL" : "en_US",
      url: "/",
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#17181c",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
