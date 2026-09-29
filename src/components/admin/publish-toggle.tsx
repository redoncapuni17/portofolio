"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils/cn";
import type { ActionResult } from "@/types";

export function PublishToggle({
  published,
  onToggle,
  label = "Published",
}: {
  published: boolean;
  onToggle: (next: boolean) => Promise<ActionResult>;
  label?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      const result = await onToggle(!published);
      if (!result.ok) {
        window.alert(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={published}
      aria-label={label}
      disabled={pending}
      onClick={toggle}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-ring disabled:opacity-60",
        published ? "bg-accent" : "bg-slate-300",
      )}
    >
      <span
        className={cn(
          "inline-block size-5 rounded-full bg-white shadow transition-transform",
          published ? "translate-x-5.5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
