"use server";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { parseStorageUrl } from "@/lib/utils/storage-url";

/**
 * Server-side, best-effort deletion of storage objects by public URL.
 * Used when deleting records so orphaned files do not accumulate.
 */
export async function removeStorageObjects(urls: (string | null | undefined)[]): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const grouped = new Map<string, string[]>();
  for (const url of urls) {
    if (!url) continue;
    const parsed = parseStorageUrl(url);
    if (!parsed) continue;
    grouped.set(parsed.bucket, [...(grouped.get(parsed.bucket) ?? []), parsed.path]);
  }

  await Promise.all(
    Array.from(grouped.entries()).map(async ([bucket, paths]) => {
      const { error } = await supabase.storage.from(bucket).remove(paths);
      if (error) console.error(`[storage] remove from ${bucket}:`, error.message);
    }),
  );
}
