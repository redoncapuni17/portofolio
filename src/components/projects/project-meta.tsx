import { Badge } from "@/components/ui/badge";
import type { ProjectDetail } from "@/types";

export function ProjectMeta({ project }: { project: ProjectDetail }) {
  const rows = [
    { label: "Role", value: project.role },
    { label: "Timeline", value: project.timeline },
    { label: "Project type", value: project.project_type },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  return (
    <aside className="enter rounded-2xl border border-line bg-surface p-6 shadow-soft" style={{ animationDelay: "200ms" }}>
      <dl className="space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{row.label}</dt>
            <dd className="mt-1 text-sm font-medium text-heading">{row.value}</dd>
          </div>
        ))}
        {project.technologies.length > 0 ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Technologies</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <Badge key={tech.id} tone="accent">
                  {tech.name}
                </Badge>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    </aside>
  );
}
