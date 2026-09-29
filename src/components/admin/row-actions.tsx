import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import type { ActionResult } from "@/types";
import { ActionButton } from "./action-button";

/**
 * Edit link + delete button for table rows. Server Components can pass a
 * bound server action (e.g. `deleteSkill.bind(null, id)`) as `onDelete`.
 */
export function RowActions({
  editHref,
  onDelete,
  name,
}: {
  editHref: string;
  onDelete: () => Promise<ActionResult>;
  name: string;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link href={editHref} className={buttonClasses({ variant: "ghost", size: "sm" })} aria-label={`Edit ${name}`}>
        <Pencil className="size-4" aria-hidden />
        Edit
      </Link>
      <ActionButton
        variant="ghost"
        size="sm"
        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
        confirmMessage={`Delete "${name}"? This cannot be undone.`}
        action={onDelete}
        aria-label={`Delete ${name}`}
      >
        <Trash2 className="size-4" aria-hidden />
        Delete
      </ActionButton>
    </div>
  );
}
