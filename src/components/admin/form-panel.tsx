import Link from "next/link";
import type { ReactNode } from "react";
import { X } from "lucide-react";

export function FormPanel({
  title,
  closeHref,
  children,
}: {
  title: string;
  closeHref: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-8 rounded-2xl border border-accent-ring bg-surface p-6 shadow-card" aria-labelledby="form-panel-title">
      <div className="mb-6 flex items-center justify-between">
        <h2 id="form-panel-title" className="text-lg font-semibold">
          {title}
        </h2>
        <Link
          href={closeHref}
          className="inline-flex size-9 items-center justify-center rounded-lg text-body hover:bg-slate-100 hover:text-heading focus-ring"
          aria-label="Close form"
        >
          <X className="size-4" aria-hidden />
        </Link>
      </div>
      {children}
    </section>
  );
}
