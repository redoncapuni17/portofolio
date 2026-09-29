import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import type { Service } from "@/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-7 shadow-soft">
      <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
        <Icon name={service.icon} className="size-5" />
      </span>
      <h3 className="mt-5 text-lg font-semibold">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{service.description}</p>
      {service.technologies.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {service.technologies.map((tech) => (
            <li key={tech}>
              <Badge>{tech}</Badge>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
