import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getSiteSettings } from "@/lib/queries/settings";

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus-ring"
      >
        Skip to content
      </a>
      <Navbar brand={settings.developer_name} />
      <main id="content" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
    </>
  );
}
