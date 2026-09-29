"use client";

import { useState } from "react";
import { ChevronDown, Mail, MailOpen, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/admin/action-button";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { deleteMessage, setMessageRead } from "@/lib/actions/messages";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format";
import type { ContactMessage } from "@/types";

export function MessageCard({ message }: { message: ContactMessage }) {
  const [open, setOpen] = useState(!message.read);

  return (
    <article
      className={cn(
        "rounded-2xl border bg-surface shadow-soft transition-colors",
        message.read ? "border-line" : "border-accent-ring",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start gap-4 p-5 text-left focus-ring rounded-2xl"
        aria-expanded={open}
      >
        <span
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
            message.read ? "bg-wash text-muted" : "bg-accent-soft text-accent",
          )}
        >
          {message.read ? <MailOpen className="size-4" aria-hidden /> : <Mail className="size-4" aria-hidden />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={cn("font-medium", message.read ? "text-body" : "text-heading")}>{message.name}</span>
            <span className="text-sm text-muted">{message.email}</span>
            {!message.read ? <Badge tone="accent">New</Badge> : null}
          </span>
          <span className="mt-1 block text-xs text-muted">{formatDate(message.created_at)}</span>
          {!open ? <span className="mt-2 block truncate text-sm text-body">{message.message}</span> : null}
        </span>
        <ChevronDown className={cn("mt-2 size-4 shrink-0 text-muted transition-transform", open && "rotate-180")} aria-hidden />
      </button>

      {open ? (
        <div className="border-t border-line px-5 py-4">
          <p className="whitespace-pre-line text-sm leading-7 text-body">{message.message}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: your message`)}`}
              className={buttonClasses({ variant: "primary", size: "sm" })}
            >
              Reply by email
            </a>
            <ActionButton variant="secondary" size="sm" action={() => setMessageRead(message.id, !message.read)}>
              {message.read ? "Mark as unread" : "Mark as read"}
            </ActionButton>
            <ActionButton
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
              confirmMessage={`Delete the message from ${message.name}?`}
              action={() => deleteMessage(message.id)}
            >
              <Trash2 className="size-4" aria-hidden />
              Delete
            </ActionButton>
          </div>
        </div>
      ) : null}
    </article>
  );
}
