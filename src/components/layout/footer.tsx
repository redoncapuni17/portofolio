import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, type SvgIcon } from "@/components/ui/brand-icons";
import type { SiteSettings } from "@/types";
import { navLinks } from "./nav-links";

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const social: { href: string; label: string; Icon: SvgIcon }[] = [];
  if (settings.github_url) social.push({ href: settings.github_url, label: "GitHub", Icon: GithubIcon });
  if (settings.linkedin_url)
    social.push({ href: settings.linkedin_url, label: "LinkedIn", Icon: LinkedinIcon });
  if (settings.email) social.push({ href: `mailto:${settings.email}`, label: "Email", Icon: Mail });

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="container-page flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="text-base font-semibold text-heading">{settings.developer_name}</p>
          <p className="mt-2 text-sm leading-relaxed text-body">{settings.hero_title}</p>
          {settings.location ? (
            <p className="mt-2 text-sm text-muted">{settings.location}</p>
          ) : null}
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-body hover:text-heading focus-ring rounded">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {social.length > 0 ? (
          <ul className="flex items-center gap-2">
            {social.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-lg border border-line text-body transition-[color,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent focus-ring"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
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
