"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ActionResult } from "@/types";

type Status = { tone: "success" | "error"; text: string } | null;

/**
 * Small helper shared by admin forms: runs a server action inside a
 * transition, maps server-side field errors back onto the form, and
 * optionally navigates on success.
 */
export function useActionForm<TFields extends FieldValues>(setError: UseFormSetError<TFields>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>(null);

  const submit = <T,>(
    run: () => Promise<ActionResult<T>>,
    options?: { redirectTo?: string | ((data: T | undefined) => string); successMessage?: string },
  ) => {
    setStatus(null);
    startTransition(async () => {
      const result = await run();
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            if (messages?.[0]) setError(field as Path<TFields>, { message: messages[0] });
          }
        }
        setStatus({ tone: "error", text: result.error });
        return;
      }

      const target =
        typeof options?.redirectTo === "function" ? options.redirectTo(result.data) : options?.redirectTo;

      if (target) {
        router.push(target);
        router.refresh();
        return;
      }

      setStatus({ tone: "success", text: options?.successMessage ?? result.message ?? "Saved." });
      router.refresh();
    });
  };

  return { pending, status, submit };
}
