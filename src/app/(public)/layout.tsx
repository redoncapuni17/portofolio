import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getSiteSettings } from "@/lib/queries/settings";

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar brand={settings.developer_name} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
