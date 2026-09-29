import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionFailure } from "@/types";

/** Validate unknown input against a schema and return a typed ActionResult on failure. */
export function validate<T extends z.ZodType>(
  schema: T,
  input: unknown,
): { success: true; data: z.output<T> } | { success: false; result: ActionFailure } {
  const parsed = schema.safeParse(input);
  if (parsed.success) return { success: true, data: parsed.data };

  const flattened = z.flattenError(parsed.error);
  return {
    success: false,
    result: {
      ok: false,
      error: flattened.formErrors[0] ?? "Please fix the highlighted fields.",
      fieldErrors: flattened.fieldErrors as Record<string, string[]>,
    },
  };
}

/** Translate a Postgres/PostgREST error into a friendly message. */
export function friendlyDbError(error: { code?: string; message: string }): string {
  switch (error.code) {
    case "23505":
      return "A record with this slug or name already exists.";
    case "23503":
      return "This record is referenced by other data and cannot be changed.";
    case "42501":
      return "You do not have permission to perform this action.";
    default:
      return error.message || "Something went wrong. Please try again.";
  }
}

/** Revalidate every public route that renders shared content plus the admin area. */
export function revalidatePublicSite(...extraPaths: string[]) {
  const paths = ["/", "/about", "/projects", "/services", "/testimonials", "/blog", "/contact", ...extraPaths];
  for (const path of paths) {
    if (path && path.startsWith("/")) revalidatePath(path);
  }
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin", "layout");
}
