import "server-only";

import type { PostgrestError } from "@supabase/supabase-js";

type QueryResponse<T> = { data: T | null; error: PostgrestError | null };

/**
 * Runs a Supabase query and converts failures (network, RLS, misconfig) into a
 * fallback value so public pages degrade to empty states instead of crashing.
 */
export async function safeQuery<T>(
  label: string,
  run: () => PromiseLike<QueryResponse<T>>,
  fallback: T,
): Promise<T> {
  try {
    const { data, error } = await run();
    if (error) {
      console.error(`[queries] ${label}:`, error.message);
      return fallback;
    }
    return data ?? fallback;
  } catch (error) {
    console.error(`[queries] ${label}:`, error instanceof Error ? error.message : error);
    return fallback;
  }
}
