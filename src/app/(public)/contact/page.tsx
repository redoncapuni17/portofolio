import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, type SvgIcon } from "@/components/ui/brand-icons";
import { ContactForm } from "@/components/contact/contact-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSiteSettings } from "@/lib/queries/settings";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about a project, a role or a collaboration.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const channels: { label: string; value: string; href: string; Icon: SvgIcon }[] = [];
  if (settings.email) {
    channels.push({ label: "Email", value: settings.email, href: `mailto:${settings.email}`, Icon: Mail });
  }
  if (settings.linkedin_url) {
    channels.push({
      label: "LinkedIn",
      value: settings.linkedin_url.replace(/^https?:\/\//, ""),
      href: settings.linkedin_url,
      Icon: LinkedinIcon,
    });
  }
  if (settings.github_url) {
    channels.push({
      label: "GitHub",
      value: settings.github_url.replace(/^https?:\/\//, ""),
      href: settings.github_url,
      Icon: GithubIcon,
    });
  }

  return (
    <section className="container-page grid gap-12 py-20 lg:grid-cols-[1fr_1fr] lg:gap-16">
      <div>
        <SectionHeading
          as="h1"
          eyebrow="Get in touch"
          title="Let's build something together."
          description="Have a project in mind or a role you think I would be a good fit for? Send a message and I will reply within two business days."
        />

        {channels.length > 0 ? (
          <ul className="mt-10 space-y-4">
            {channels.map(({ label, value, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl focus-ring"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl border border-line bg-surface text-accent transition-colors group-hover:border-accent">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wider text-muted">
                      {label}
                    </span>
                    <span className="block text-sm font-medium text-heading group-hover:text-accent">
                      {value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        {settings.availability ? (
          <p className="mt-10 inline-flex items-center gap-2 text-sm text-body">
            <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
            {settings.availability}
          </p>
        ) : null}
      </div>

      <div className="rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-8">
        <ContactForm />
      </div>
    </section>
  );
}
