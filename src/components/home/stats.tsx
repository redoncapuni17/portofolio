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
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-line bg-surface p-6 shadow-soft"
          >
            <dt className="text-sm text-body">{item.label}</dt>
            <dd className="mt-2 text-3xl font-semibold text-heading">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
