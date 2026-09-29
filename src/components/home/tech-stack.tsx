import { Icon } from "@/components/ui/icon";

const technologies = [
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextjs" },
  { name: "TypeScript", icon: "typescript" },
  { name: "Node.js", icon: "nodejs" },
  { name: "Python", icon: "python" },
  { name: "FastAPI", icon: "fastapi" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "Docker", icon: "docker" },
] as const;

export function TechStack() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="container-page py-14">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Technologies I work with
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {technologies.map((tech) => (
            <li
              key={tech.name}
              className="flex flex-col items-center gap-2.5 rounded-xl border border-line bg-canvas px-3 py-5 text-center transition-colors hover:border-accent-ring"
            >
              <Icon name={tech.icon} className="size-6 text-accent" />
              <span className="text-sm font-medium text-heading">{tech.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
