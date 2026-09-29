import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/ui/empty-state";
import type { Skill } from "@/types";
import type { SkillCategory } from "@/types/database";

const categoryMeta: Record<SkillCategory, { title: string; icon: string }> = {
  frontend: { title: "Frontend", icon: "layout" },
  backend: { title: "Backend", icon: "server" },
  tools: { title: "Tools", icon: "docker" },
};

export function SkillsGrid({ groups }: { groups: Record<SkillCategory, Skill[]> }) {
  const total = Object.values(groups).reduce((sum, list) => sum + list.length, 0);
  if (total === 0) {
    return <EmptyState title="No skills listed yet" description="Add skills from the admin panel." />;
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {(Object.keys(categoryMeta) as SkillCategory[]).map((category) => {
        const meta = categoryMeta[category];
        const skills = groups[category];
        return (
          <section
            key={category}
            className="rounded-2xl border border-line bg-surface p-6 shadow-soft"
            aria-labelledby={`skills-${category}`}
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Icon name={meta.icon} className="size-4" />
              </span>
              <h3 id={`skills-${category}`} className="text-base font-semibold">
                {meta.title}
              </h3>
            </div>
            {skills.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-sm font-medium text-heading"
                    title={skill.description ?? undefined}
                  >
                    <Icon name={skill.icon} className="size-3.5 text-accent" />
                    {skill.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-sm text-muted">Nothing here yet.</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
