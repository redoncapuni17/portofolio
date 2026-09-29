import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ImageIcon } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { Badge } from "@/components/ui/badge";
import type { ProjectWithTech } from "@/types";

export function ProjectCard({ project, priority }: { project: ProjectWithTech; priority?: boolean }) {
  return (
    <article className="group hover-lift flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft hover:border-accent-ring hover:shadow-card">
      <Link
        href={`/projects/${project.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-wash focus-ring"
        aria-label={`View ${project.title}`}
      >
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={`${project.title} cover`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <ImageIcon className="size-8" aria-hidden />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-heading">
          <Link href={`/projects/${project.slug}`} className="focus-ring rounded hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{project.short_description}</p>

        {project.technologies.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.technologies.slice(0, 5).map((tech) => (
              <li key={tech.id}>
                <Badge>{tech.name}</Badge>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-sm font-medium">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-heading hover:text-accent focus-ring rounded"
          >
            View project
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          {project.live_url ? (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent hover:text-accent-hover focus-ring rounded"
            >
              Live Demo
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          ) : null}
          {project.github_url ? (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-body hover:text-heading focus-ring rounded"
            >
              <GithubIcon className="size-4" aria-hidden />
              GitHub
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
