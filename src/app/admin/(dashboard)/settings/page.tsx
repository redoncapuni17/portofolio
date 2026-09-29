import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings/settings-form";
import { getSiteSettings } from "@/lib/queries/settings";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader title="Site settings" description="Global content used across the public site." />
      <SettingsForm settings={settings} />
    </>
  );
}
