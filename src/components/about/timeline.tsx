import { Briefcase, GraduationCap } from "lucide-react";
import { formatDateRange } from "@/lib/utils/format";
import type { Experience } from "@/types";

export function Timeline({ items, title }: { items: Experience[]; title: string }) {
  const isEducation = items[0]?.type === "education" || title === "Education";
  const Marker = isEducation ? GraduationCap : Briefcase;

  return (
    <section aria-labelledby={`timeline-${title}`}>
      <h2 id={`timeline-${title}`} className="text-lg font-semibold">
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Nothing here yet.</p>
      ) : (
        <ol className="mt-6 space-y-6 border-l border-line pl-6">
          {items.map((item) => {
            const description =
              item.description && item.description.trim().toLowerCase() !== item.position.trim().toLowerCase()
                ? item.description
                : null;

            return (
              <li key={item.id} className="relative">
                <span
                  className="absolute -left-[31px] top-1 flex size-5 items-center justify-center rounded-full border border-line bg-canvas text-accent"
                  aria-hidden
                >
                  <Marker className="size-3" />
                </span>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  {formatDateRange(item.start_date, item.end_date, item.currently_working)}
                </p>
                <h3 className="mt-1 text-base font-semibold text-heading">{item.position}</h3>
                <p className="text-sm text-body">
                  {item.company}
                  {item.location ? <span className="text-muted"> · {item.location}</span> : null}
                </p>
                {description ? (
                  <p className="mt-2 text-sm leading-relaxed text-body">{description}</p>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
