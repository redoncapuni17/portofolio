import { EmptyState } from "@/components/ui/empty-state";
import type { ProjectWithTech } from "@/types";
import { ProjectCard } from "./project-card";

export function ProjectGrid({ projects }: { projects: ProjectWithTech[] }) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Published projects will appear here once they are added in the admin panel."
      />
    );
  }

  return (
    <ul className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <li key={project.id}>
          <ProjectCard project={project} priority={index < 3} />
        </li>
      ))}
    </ul>
  );
}
