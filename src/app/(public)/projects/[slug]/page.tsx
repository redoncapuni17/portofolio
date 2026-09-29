import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { ProjectMeta } from "@/components/projects/project-meta";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/ui/rich-text";
import { getProjectBySlug, getPublishedProjectSlugs } from "@/lib/queries/projects";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getPublishedProjectSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.short_description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.short_description,
      url: `/projects/${project.slug}`,
      images: project.cover_image ? [{ url: project.cover_image }] : undefined,
    },
  };
}

const sections = [
  { key: "problem", title: "The Problem" },
  { key: "solution", title: "The Solution" },
  { key: "results", title: "Results" },
] as const;

export default async function ProjectDetailPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="container-page py-16">
      <Link
        href="/projects"
        className="group enter inline-flex items-center gap-1.5 text-sm font-medium text-body hover:text-heading focus-ring rounded"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to projects
      </Link>

      <header
        className="enter mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        style={{ animationDelay: "80ms" }}
      >
        <div className="max-w-2xl">
          {project.project_type ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {project.project_type}
            </p>
          ) : null}
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{project.title}</h1>
          <p className="mt-4 text-lg leading-relaxed">{project.short_description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {project.live_url ? (
            <Button href={project.live_url} external>
              Live Demo
              <ArrowUpRight className="size-4" aria-hidden />
            </Button>
          ) : null}
          {project.github_url ? (
            <Button href={project.github_url} external variant="secondary">
              <GithubIcon className="size-4" aria-hidden />
              View on GitHub
            </Button>
          ) : null}
        </div>
      </header>

      {project.cover_image ? (
        <div
          className="enter relative mt-12 aspect-[16/9] overflow-hidden rounded-3xl border border-line bg-wash shadow-card"
          style={{ animationDelay: "160ms" }}
        >
          <Image
            src={project.cover_image}
            alt={`${project.title} hero screenshot`}
            fill
            priority
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div className="space-y-14">
          {project.description ? (
            <section className="reveal" aria-labelledby="overview">
              <h2 id="overview" className="text-2xl font-semibold">
                Overview
              </h2>
              <RichText content={project.description} className="mt-4" />
            </section>
          ) : null}

          {sections.map(({ key, title }) => {
            const content = project[key];
            if (!content) return null;
            return (
              <section key={key} className="reveal" aria-labelledby={key}>
                <h2 id={key} className="text-2xl font-semibold">
                  {title}
                </h2>
                <RichText content={content} className="mt-4" />
              </section>
            );
          })}

          {project.key_features.length > 0 ? (
            <section className="reveal" aria-labelledby="features">
              <h2 id="features" className="text-2xl font-semibold">
                Key Features
              </h2>
              <ul className="stagger mt-5 grid gap-3 sm:grid-cols-2">
                {project.key_features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-heading"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <ProjectGallery images={project.images} title={project.title} />
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProjectMeta project={project} />
        </div>
      </div>
    </article>
  );
}
