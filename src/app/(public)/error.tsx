"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-24 text-center">
      <p className="eyebrow">Error</p>
      <h1 className="mt-3 text-3xl font-semibold">Something went wrong</h1>
      <p className="mx-auto mt-3 max-w-md text-body">
        The page could not be loaded. Please try again in a moment.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="secondary">
          Go home
        </Button>
      </div>
    </div>
  );
}
