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
    <section className="container-page py-20">
      <dl className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="h-full">
            <div className="hover-lift h-full rounded-2xl border border-line bg-surface p-6 shadow-soft hover:border-accent-ring">
              <dt className="text-sm text-body">{item.label}</dt>
              <dd className="mt-2 text-3xl font-semibold text-heading">
                <CountUp value={item.value} />
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
