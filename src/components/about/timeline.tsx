import { Briefcase, GraduationCap } from "lucide-react";
import { formatDateRange } from "@/lib/utils/format";
import type { Experience } from "@/types";

export function Timeline({ items, title }: { items: Experience[]; title: string }) {
  const isEducation = items[0]?.type === "education";
  const Marker = isEducation ? GraduationCap : Briefcase;

  return (
    <section aria-labelledby={`timeline-${title}`}>
      <h3 id={`timeline-${title}`} className="text-xl font-semibold">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Nothing here yet.</p>
      ) : (
        <ol className="stagger mt-6 space-y-6 border-l border-line pl-6">
          {items.map((item) => (
            <li key={item.id} className="relative">
              <span
                className="absolute -left-[31px] top-1 flex size-5 items-center justify-center rounded-full border border-line bg-surface text-accent"
                aria-hidden
              >
                <Marker className="size-3" />
              </span>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                {formatDateRange(item.start_date, item.end_date, item.currently_working)}
              </p>
              <h4 className="mt-1 text-base font-semibold text-heading">{item.position}</h4>
              <p className="text-sm text-body">
                {item.company}
                {item.location ? <span className="text-muted"> · {item.location}</span> : null}
              </p>
              {item.description ? (
                <p className="mt-2 text-sm leading-relaxed text-body">{item.description}</p>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
