"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Briefcase,
  ExternalLink,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  Settings,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", Icon: FolderKanban },
  { href: "/admin/blog", label: "Blog", Icon: FileText },
  { href: "/admin/skills", label: "Skills", Icon: Sparkles },
  { href: "/admin/experience", label: "Experience", Icon: Briefcase },
  { href: "/admin/services", label: "Services", Icon: Wrench },
  { href: "/admin/testimonials", label: "Testimonials", Icon: MessageSquareQuote },
  { href: "/admin/messages", label: "Messages", Icon: Mail },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
] as const;

export function AdminSidebar({
  brand,
  email,
  unreadMessages,
}: {
  brand: string;
  email: string;
  unreadMessages: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer whenever the route changes (state derived during render).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Admin">
      {items.map(({ href, label, Icon, ...rest }) => {
        const exact = "exact" in rest && rest.exact;
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-ring",
              active ? "bg-accent-soft text-accent" : "text-body hover:bg-wash hover:text-heading",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="flex-1">{label}</span>
            {href === "/admin/messages" && unreadMessages > 0 ? (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                {unreadMessages}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="mt-6 border-t border-line pt-4">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-body hover:bg-wash hover:text-heading focus-ring"
      >
        <ExternalLink className="size-4" aria-hidden />
        View site
      </Link>
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-body hover:bg-wash hover:text-heading focus-ring"
        >
          <LogOut className="size-4" aria-hidden />
          Logout
        </button>
      </form>
      <div className="mt-3 flex items-center justify-between gap-2 px-3">
        <p className="truncate text-xs text-muted" title={email}>
          {email}
        </p>
        <ThemeToggle className="size-9 shrink-0 shadow-none max-lg:hidden" />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
        <Link href="/admin" className="text-sm font-semibold text-heading focus-ring rounded">
          {brand} <span className="text-muted">/ Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle className="size-9 shadow-none" />
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-heading focus-ring"
            aria-expanded={open}
            aria-controls="admin-sidebar"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="admin-sidebar"
          className="fixed inset-x-0 top-14 z-40 flex flex-col border-b border-line bg-surface p-4 shadow-card lg:hidden"
        >
          {nav}
          {footer}
        </div>
      ) : null}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-line bg-surface lg:flex lg:flex-col lg:p-5">
        <Link href="/admin" className="mb-8 flex items-center gap-2.5 px-2 focus-ring rounded-md">
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white">
            {brand
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join("")}
          </span>
          <span className="text-sm font-semibold text-heading">
            {brand} <span className="font-normal text-muted">/ Admin</span>
          </span>
        </Link>
        {nav}
        {footer}
      </aside>
    </>
  );
}
