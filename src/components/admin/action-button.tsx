"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { ActionResult } from "@/types";

type Props = {
  action: () => Promise<ActionResult<unknown>>;
  /** If provided, the user must confirm before the action runs. */
  confirmMessage?: string;
  children: ReactNode;
  pendingLabel?: string;
  onSuccess?: () => void;
} & Pick<Extract<ButtonProps, { href?: undefined }>, "variant" | "size" | "className" | "title" | "aria-label">;

/**
 * Runs a server action from a button with optional confirmation, pending
 * state and a router refresh on success.
 */
export function ActionButton({
  action,
  confirmMessage,
  children,
  pendingLabel,
  onSuccess,
  ...buttonProps
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = () => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error);
        window.alert(result.error);
        return;
      }
      onSuccess?.();
      router.refresh();
    });
  };

  return (
    <Button
      {...buttonProps}
      onClick={run}
      disabled={pending}
      aria-busy={pending}
      title={error ?? buttonProps.title}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
}
