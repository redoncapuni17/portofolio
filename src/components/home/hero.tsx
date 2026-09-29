import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/types";

export function Hero({ settings }: { settings: SiteSettings }) {
  const initials = settings.developer_name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <section className="screen-section">
      <div className="container-page grid w-full items-center gap-8 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-10">
        <div>
        {settings.availability ? (
          <p
            className="enter inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-body shadow-soft"
            style={{ animationDelay: "40ms" }}
          >
            <span className="pulse-dot size-1.5 rounded-full bg-emerald-500" aria-hidden />
            {settings.availability}
          </p>
        ) : null}

        <h1
          className="enter mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          style={{ animationDelay: "120ms" }}
        >
          Hi, I&apos;m <span className="text-accent">{settings.developer_name}</span>
          <span className="mt-2 block text-heading/90">{settings.hero_title}</span>
        </h1>

        <p className="enter mt-6 max-w-xl text-lg leading-relaxed" style={{ animationDelay: "220ms" }}>
          {settings.hero_description}
        </p>

        <div className="enter mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "320ms" }}>
          <Button href="/projects" size="lg">
            View Projects
            <ArrowRight className="size-4" aria-hidden />
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Contact Me
          </Button>
        </div>

        {settings.location ? (
          <p
            className="enter mt-8 inline-flex items-center gap-1.5 text-sm text-muted"
            style={{ animationDelay: "420ms" }}
          >
            <MapPin className="size-4" aria-hidden />
            {settings.location}
          </p>
        ) : null}
        </div>

        <div
          className="enter relative mx-auto hidden w-full max-w-sm lg:block lg:max-w-none"
          style={{ animationDelay: "180ms" }}
        >
        <div
          className="glow-orb absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-accent/25 via-accent-soft to-transparent blur-2xl"
          aria-hidden
        />
        <div className="float-soft relative aspect-[4/5] max-h-[calc(100svh-var(--nav-height)-5rem)] w-full overflow-hidden rounded-[2rem] border border-line bg-surface shadow-card">
          {settings.profile_image ? (
            <Image
              src={settings.profile_image}
              alt={`Portrait of ${settings.developer_name}`}
              fill
              priority
              sizes="(min-width: 1024px) 420px, 80vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-wash to-accent-soft">
              <span className="text-7xl font-semibold text-accent/70">{initials}</span>
            </div>
          )}
        </div>

        {settings.years_experience ? (
          <p className="absolute -left-3 bottom-8 hidden rounded-2xl border border-line bg-surface/95 px-4 py-3 shadow-card backdrop-blur sm:block">
            <span className="block text-2xl font-semibold text-heading">{settings.years_experience}+</span>
            <span className="text-xs text-body">years building</span>
          </p>
        ) : null}
        </div>
      </div>
    </section>
  );
}
