import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/sidebar";
import { requireAdmin } from "@/lib/auth";
import { getUnreadMessageCount } from "@/lib/queries/content";
import { getSiteSettings } from "@/lib/queries/settings";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Server-side guard (in addition to src/proxy.ts). Redirects if not an admin.
  const session = await requireAdmin();
  const [settings, unreadMessages] = await Promise.all([getSiteSettings(), getUnreadMessageCount()]);

  return (
    <div className="flex min-h-full flex-1 flex-col lg:flex-row">
      <AdminSidebar brand={settings.developer_name} email={session.email} unreadMessages={unreadMessages} />
      <main className="flex-1 bg-canvas">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-10">{children}</div>
      </main>
    </div>
  );
}
