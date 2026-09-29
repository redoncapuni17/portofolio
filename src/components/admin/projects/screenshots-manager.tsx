"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, Input } from "@/components/ui/form";
import { addProjectImage, deleteProjectImage } from "@/lib/actions/projects";
import { ACCEPTED_IMAGE_TYPES, removeImageByUrl, uploadImage } from "@/lib/storage/client";
import type { ProjectImage } from "@/types";

/**
 * Manages the screenshot gallery of an existing project:
 * upload (multiple), caption on upload, preview and delete.
 */
export function ScreenshotsManager({ projectId, images }: { projectId: string; images: ProjectImage[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    const startOrder = images.length;
    for (const [index, file] of Array.from(files).entries()) {
      const upload = await uploadImage("projects", file, `${projectId}/screenshots`);
      if (!upload.ok) {
        setError(upload.error);
        continue;
      }
      const result = await addProjectImage({
        project_id: projectId,
        image_url: upload.url,
        image_type: "screenshot",
        caption: caption.trim(),
        sort_order: startOrder + index,
      });
      if (!result.ok) {
        setError(result.error);
        void removeImageByUrl(upload.url);
      }
    }

    setUploading(false);
    setCaption("");
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  };

  const remove = (image: ProjectImage) => {
    if (!window.confirm("Delete this screenshot?")) return;
    startTransition(async () => {
      const result = await deleteProjectImage(image.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-6 shadow-soft" aria-labelledby="screenshots">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="screenshots" className="text-lg font-semibold">
            Screenshots
          </h2>
          <p className="mt-1 text-sm text-body">Upload one or more images for the project gallery.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            aria-label="Caption for uploaded screenshots"
            placeholder="Optional caption"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            className="sm:w-56"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Plus className="size-4" aria-hidden />}
            {uploading ? "Uploading…" : "Add screenshots"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="sr-only"
            onChange={(event) => void handleFiles(event.target.files)}
          />
        </div>
      </div>

      <FieldError message={error ?? undefined} />

      {images.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">
          No screenshots yet.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <li key={image.id} className="overflow-hidden rounded-xl border border-line">
              <div className="relative aspect-video bg-wash">
                <Image src={image.image_url} alt={image.caption ?? ""} fill sizes="320px" className="object-cover" unoptimized />
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <p className="truncate text-xs text-body">{image.caption || "No caption"}</p>
                <button
                  type="button"
                  onClick={() => remove(image)}
                  disabled={pending}
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 focus-ring dark:text-red-400 dark:hover:bg-red-950"
                  aria-label="Delete screenshot"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
