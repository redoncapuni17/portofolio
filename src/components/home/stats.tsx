import { CountUp } from "@/components/motion/count-up";
import type { SiteSettings } from "@/types";

export function Stats({ settings }: { settings: SiteSettings }) {
  const items = [
    { value: `${settings.years_experience}+`, label: "Years of experience" },
    { value: `${settings.projects_completed}+`, label: "Projects completed" },
    { value: "100%", label: "Quality focus" },
    { value: "Remote", label: "Remote friendly" },
  ];

  return (
    <section className="container-page py-16 sm:py-20">
      <dl className="stagger grid gap-px overflow-hidden rounded-3xl border border-line bg-line shadow-soft sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="bg-surface px-6 py-7">
            <dd className="text-3xl font-semibold tracking-tight text-heading">
              <CountUp value={item.value} />
            </dd>
            <dt className="mt-1.5 text-sm text-body">{item.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
