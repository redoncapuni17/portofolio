"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils/cn";
import { buttonClasses } from "@/components/ui/button";
import { navLinks } from "./nav-links";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
} 

export function Navbar({ brand }: { brand: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes (state derived during render).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const initials = brand
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/80 backdrop-blur-md supports-[backdrop-filter]:bg-canvas/65">
      <nav className="container-page flex h-[var(--nav-height)] items-center justify-between" aria-label="Main">
        <Link href="/" className="flex items-center gap-2.5 rounded-xl focus-ring">
          <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-xs font-bold text-white shadow-soft">
            {initials || "•"}
          </span>
          <span className="text-sm font-semibold text-heading">{brand}</span>
        </Link>

        <ul className="hidden items-center gap-0.5 rounded-2xl border border-line/80 bg-surface/80 p-1 shadow-soft lg:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-xl px-3 py-1.5 text-sm font-medium transition-colors focus-ring",
                    active ? "bg-accent-soft text-accent" : "text-body hover:bg-wash hover:text-heading",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden lg:block">
            <Link href="/contact" className={buttonClasses({ size: "sm" })}>
              Contact Me
            </Link>
          </div>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl text-heading focus-ring lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

    </header>
      {open
        ? createPortal(
            <div className="fixed inset-x-0 bottom-0 top-[var(--nav-height)] z-40 lg:hidden">
              <div
                className="drawer-backdrop absolute inset-0 bg-slate-950/45 dark:bg-black/72"
                onClick={() => setOpen(false)}
              />
              <div
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                className="drawer-panel absolute inset-y-0 right-0 flex w-[min(18.5rem,86vw)] flex-col border-l border-line bg-canvas shadow-card"
              >
                <p className="px-5 pt-6 text-xs font-semibold uppercase tracking-wider text-muted">Menu</p>
                <ul className="mt-3 flex flex-col px-3">
                  {navLinks.map((link) => {
                    const active = isActive(pathname, link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "block rounded-xl px-3 py-3 text-base font-medium focus-ring",
                            active ? "bg-accent-soft text-accent" : "text-heading hover:bg-wash",
                          )}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-auto p-5">
                  <Link href="/contact" className={buttonClasses({ className: "w-full" })}>
                    Contact Me
                  </Link>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
