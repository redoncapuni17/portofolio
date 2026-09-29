"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/admin/action-button";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { buttonClasses } from "@/components/ui/button";
import { deleteProject, setProjectPublished } from "@/lib/actions/projects";

export function ProjectPublishToggle({ id, published }: { id: string; published: boolean }) {
  return <PublishToggle published={published} onToggle={(next) => setProjectPublished(id, next)} />;
}

export function ProjectRowActions({ id, title }: { id: string; title: string }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/admin/projects/${id}/edit`}
        className={buttonClasses({ variant: "ghost", size: "sm" })}
        aria-label={`Edit ${title}`}
      >
        <Pencil className="size-4" aria-hidden />
        Edit
      </Link>
      <ActionButton
        variant="ghost"
        size="sm"
        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
        confirmMessage={`Delete "${title}"? This also removes its screenshots. This cannot be undone.`}
        action={() => deleteProject(id)}
        aria-label={`Delete ${title}`}
      >
        <Trash2 className="size-4" aria-hidden />
        Delete
      </ActionButton>
    </div>
  );
}
