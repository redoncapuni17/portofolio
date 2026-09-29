import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getSiteSettings } from "@/lib/queries/settings";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

const errorMessages: Record<string, string> = {
  forbidden: "This account does not have admin access.",
};

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const [{ next, error }, settings] = await Promise.all([searchParams, getSiteSettings()]);
  const nextPath = typeof next === "string" ? next : undefined;
  const errorKey = typeof error === "string" ? error : undefined;

  return (
    <main className="relative flex flex-1 items-center justify-center px-5 py-16">
      <ThemeToggle className="absolute right-5 top-5" />
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 focus-ring rounded-md">
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
              {settings.developer_name
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join("")}
            </span>
            <span className="text-base font-semibold text-heading">{settings.developer_name}</span>
          </Link>
          <h1 className="mt-6 text-2xl font-semibold">Admin sign in</h1>
          <p className="mt-2 text-sm text-body">Sign in with your admin email and password.</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <LoginForm next={nextPath} initialError={errorKey ? errorMessages[errorKey] : undefined} />
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Accounts are created by the site owner in Supabase. Public sign-up is disabled.
        </p>
      </div>
    </main>
  );
}
