import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, type SvgIcon } from "@/components/ui/brand-icons";
import type { SiteSettings } from "@/types";
import { navLinks } from "./nav-links";

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const initials = settings.developer_name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const social: { href: string; label: string; Icon: SvgIcon }[] = [];
  if (settings.github_url) social.push({ href: settings.github_url, label: "GitHub", Icon: GithubIcon });
  if (settings.linkedin_url)
    social.push({ href: settings.linkedin_url, label: "LinkedIn", Icon: LinkedinIcon });
  if (settings.email) social.push({ href: `mailto:${settings.email}`, label: "Email", Icon: Mail });

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_auto] md:items-start">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2.5 rounded-xl focus-ring">
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-xs font-bold text-white">
              {initials || "•"}
            </span>
            <span className="text-sm font-semibold text-heading">{settings.developer_name}</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-body">{settings.hero_title}</p>
          {settings.location ? <p className="mt-2 text-sm text-muted">{settings.location}</p> : null}
        </div>

        <nav aria-label="Footer">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Explore</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="rounded text-body hover:text-heading focus-ring">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {social.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Connect</p>
            <ul className="mt-4 flex items-center gap-2">
              {social.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-10 items-center justify-center rounded-xl border border-line bg-canvas text-body transition-[color,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent focus-ring"
                  >
                    <Icon className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.developer_name}. All rights reserved.
          </p>
          <p>Built with Next.js, Supabase and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
