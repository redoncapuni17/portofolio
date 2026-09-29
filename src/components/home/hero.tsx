import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/types";

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="container-page grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:py-32">
      <div>
        {settings.availability ? (
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-body shadow-soft">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
            {settings.availability}
          </p>
        ) : null}

        <h1 className="mt-6 text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
          Hi, I&apos;m <span className="text-accent">{settings.developer_name}</span>, a{" "}
          {settings.hero_title}
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed">{settings.hero_description}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button href="/projects" size="lg">
            View Projects
            <ArrowRight className="size-4" aria-hidden />
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Contact Me
          </Button>
        </div>

        {settings.location ? (
          <p className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="size-4" aria-hidden />
            {settings.location}
          </p>
        ) : null}
      </div>

      <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
        <div
          className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-accent-soft via-transparent to-transparent"
          aria-hidden
        />
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
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
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 to-accent-soft">
              <span className="text-7xl font-semibold text-accent/70">
                {settings.developer_name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
