import type { Metadata } from "next";
import Image from "next/image";
import { SkillsGrid } from "@/components/about/skills-grid";
import { Timeline } from "@/components/about/timeline";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getPublishedExperience,
  getPublishedSkills,
  groupSkillsByCategory,
} from "@/lib/queries/content";
import { getSiteSettings } from "@/lib/queries/settings";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About",
  description: "Background, skills, experience and education of a full-stack software developer.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [settings, skills, experience] = await Promise.all([
    getSiteSettings(),
    getPublishedSkills(),
    getPublishedExperience(),
  ]);

  const groups = groupSkillsByCategory(skills);
  const work = experience.filter((item) => item.type === "work");
  const education = experience.filter((item) => item.type === "education");

  return (
    <>
      <section className="screen-section">
        <div className="container-page grid w-full items-center gap-10 py-8 lg:grid-cols-[1fr_0.8fr] lg:gap-16 lg:py-10">
        <div className="enter">
          <SectionHeading
            as="h1"
            eyebrow="About me"
            title="Engineer, problem solver, lifelong learner."
          />
          <div className="mt-6 space-y-4 text-base leading-relaxed">
            <p>{settings.hero_description}</p>
            <p>
              I am {settings.developer_name}, a {settings.hero_title.toLowerCase()}
              {settings.location ? ` based in ${settings.location}` : ""}. I care about clean
              architecture, fast interfaces and code that other people enjoy maintaining. When I am not
              coding, I mentor junior developers and write about web performance.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/contact">Get in touch</Button>
            <Button href="/projects" variant="secondary">
              See my work
            </Button>
          </div>
        </div>

        <div
          className="enter relative mx-auto hidden w-full max-w-md lg:block"
          style={{ animationDelay: "140ms" }}
        >
          <div
            className="glow-orb absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-accent-soft via-transparent to-transparent"
            aria-hidden
          />
          <div className="float-soft relative aspect-[4/3] max-h-[calc(100svh-var(--nav-height)-5rem)] overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
            {settings.profile_image ? (
              <Image
                src={settings.profile_image}
                alt={`Portrait of ${settings.developer_name}`}
                fill
                priority
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-wash to-accent-soft text-6xl font-semibold text-accent/70">
                {settings.developer_name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </div>
            )}
          </div>
        </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="container-page py-20">
          <SectionHeading
            className="reveal"
            eyebrow="Skills"
            title="What I work with"
            description="The tools and technologies I reach for most often, grouped by where they fit in the stack."
          />
          <div className="mt-10">
            <SkillsGrid groups={groups} />
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionHeading className="reveal" eyebrow="Background" title="Experience & Education" />
        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          <Timeline items={work} title="Experience" />
          <Timeline items={education} title="Education" />
        </div>
      </section>
    </>
  );
}
