import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form";

export function FormFooter({
  pending,
  submitLabel,
  cancelHref,
  status,
  children,
}: {
  pending: boolean;
  submitLabel: string;
  cancelHref?: string;
  status?: { tone: "success" | "error"; text: string } | null;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-4 border-t border-line pt-6">
      {status ? <FormMessage tone={status.tone}>{status.text}</FormMessage> : null}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
        {cancelHref ? (
          <Button href={cancelHref} variant="ghost">
            Cancel
          </Button>
        ) : null}
        {children}
      </div>
    </div>
  );
}
