"use client";

import { createClient } from "@/lib/supabase/client";
import { buildStoragePath, parseStorageUrl, type StorageBucket } from "@/lib/utils/storage-url";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"];

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

/**
 * Uploads an image to Supabase Storage from the browser (admin session required
 * by RLS) and returns its public URL.
 */
export async function uploadImage(
  bucket: StorageBucket,
  file: File,
  folder = "uploads",
): Promise<UploadResult> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, error: "Only PNG, JPEG, WebP, AVIF or GIF images are allowed." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Image must be smaller than 10 MB." };
  }

  const supabase = createClient();
  const path = buildStoragePath(folder, file.name);

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });

  if (error) return { ok: false, error: error.message };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

/** Best-effort removal of a storage object given its public URL. */
export async function removeImageByUrl(url: string): Promise<void> {
  const parsed = parseStorageUrl(url);
  if (!parsed) return;
  const supabase = createClient();
  await supabase.storage.from(parsed.bucket).remove([parsed.path]);
}
