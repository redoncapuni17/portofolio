import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
        <Inbox className="size-5" aria-hidden />
      </div>
      <h3 className="text-base font-semibold text-heading">{title}</h3>
      {description ? <p className="mt-1.5 max-w-sm text-sm text-body">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
