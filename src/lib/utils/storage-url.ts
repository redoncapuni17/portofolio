export type StorageBucket = "profile" | "projects" | "blog" | "testimonials";

export const storageBuckets: StorageBucket[] = ["profile", "projects", "blog", "testimonials"];

/**
 * Parses a Supabase Storage public URL into { bucket, path }.
 * Public URL shape: https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
 */
export function parseStorageUrl(url: string): { bucket: StorageBucket; path: string } | null {
  try {
    const { pathname } = new URL(url);
    const marker = "/storage/v1/object/public/";
    const index = pathname.indexOf(marker);
    if (index === -1) return null;
    const rest = pathname.slice(index + marker.length);
    const [bucket, ...parts] = rest.split("/");
    if (!storageBuckets.includes(bucket as StorageBucket) || parts.length === 0) return null;
    return { bucket: bucket as StorageBucket, path: decodeURIComponent(parts.join("/")) };
  } catch {
    return null;
  }
}

export function buildStoragePath(folder: string, fileName: string): string {
  const extension = fileName.includes(".") ? fileName.split(".").pop()!.toLowerCase() : "bin";
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${folder}/${Date.now()}-${random}.${extension}`;
}
