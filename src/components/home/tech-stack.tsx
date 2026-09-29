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
    <section className="border-y border-line bg-surface/70">
      <div className="container-page py-10">
        <p className="reveal text-center text-sm font-medium text-muted">Technologies I work with</p>
        <ul className="stagger mt-6 flex flex-wrap items-center justify-center gap-2">
          {technologies.map((tech) => (
            <li key={tech.name}>
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-2 text-sm font-medium text-heading transition-colors hover:border-accent-ring hover:text-accent">
                <Icon name={tech.icon} className="size-4 text-accent" />
                {tech.name}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
