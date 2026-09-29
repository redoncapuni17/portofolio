import type { Metadata } from "next";
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
      <section className="min-h-[calc(100svh-var(--nav-height))]">
        <div className="container-page py-16 lg:py-20">
          <div className="enter flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <SectionHeading
                as="h1"
                eyebrow="About me"
                title="Engineer, problem solver, lifelong learner."
              />
              <div className="mt-5 max-w-xl space-y-3 text-base leading-relaxed">
                <p>{settings.hero_description}</p>
                <p>
                  I am {settings.developer_name}, a {settings.hero_title.toLowerCase()}
                  {settings.location ? ` based in ${settings.location}` : ""}. I care about clean
                  architecture, fast interfaces and code that other people enjoy maintaining. When I am
                  not coding, I mentor junior developers and write about web performance.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button href="/contact">Get in touch</Button>
              <Button href="/projects" variant="secondary">
                See my work
              </Button>
            </div>
          </div>

          <div className="enter mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16" style={{ animationDelay: "120ms" }}>
            <Timeline items={work} title="Experience" />
            <Timeline items={education} title="Education" />
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
    </>
  );
}
