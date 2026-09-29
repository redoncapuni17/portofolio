import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import type { ProjectWithTech } from "@/types";

export function FeaturedProjects({ projects }: { projects: ProjectWithTech[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="container-page pb-20" aria-labelledby="featured-projects">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          className="reveal"
          eyebrow="Selected work"
          title="Featured projects"
          description="A few products I have designed, built and shipped recently."
        />
        <Button href="/projects" variant="secondary">
          All projects
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
      <ul className="stagger mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
