import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import { ThemeScript } from "@/components/theme/theme-script";
import { getSiteSettings } from "@/lib/queries/settings";
import { getSiteUrl } from "@/lib/utils/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.seo_title || `${settings.developer_name} — ${settings.hero_title}`;

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: title,
      template: `%s · ${settings.developer_name}`,
    },
    description: settings.seo_description,
    applicationName: settings.developer_name,
    openGraph: {
      type: "website",
      siteName: settings.developer_name,
      title,
      description: settings.seo_description,
      url: "/",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: settings.seo_description,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeScript />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
