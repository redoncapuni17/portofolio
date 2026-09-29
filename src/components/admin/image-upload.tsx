"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/form";
import { ACCEPTED_IMAGE_TYPES, removeImageByUrl, uploadImage } from "@/lib/storage/client";
import { cn } from "@/lib/utils/cn";
import type { StorageBucket } from "@/lib/utils/storage-url";

type Props = {
  bucket: StorageBucket;
  folder?: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  label?: string;
  aspect?: "video" | "square" | "portrait";
  /** Remove the previous file from storage when replaced or cleared. */
  deleteOnReplace?: boolean;
  className?: string;
};

const aspectClass = {
  video: "aspect-video",
  square: "aspect-square max-w-xs",
  portrait: "aspect-[4/5] max-w-xs",
};

/**
 * Single-image uploader backed by Supabase Storage with preview,
 * replace and delete.
 */
export function ImageUpload({
  bucket,
  folder,
  value,
  onChange,
  label = "Image",
  aspect = "video",
  deleteOnReplace = true,
  className,
}: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    const result = await uploadImage(bucket, file, folder);
    setUploading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    if (deleteOnReplace && value) void removeImageByUrl(value);
    onChange(result.url);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = async () => {
    if (!value) return;
    if (!window.confirm("Remove this image?")) return;
    if (deleteOnReplace) await removeImageByUrl(value);
    onChange(null);
  };

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-heading">{label}</span>
        {value ? (
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 focus-ring rounded"
          >
            <Trash2 className="size-3.5" aria-hidden />
            Remove
          </button>
        ) : null}
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-dashed border-line bg-slate-50",
          aspectClass[aspect],
        )}
      >
        {value ? (
          <Image src={value} alt="" fill sizes="480px" className="object-cover" unoptimized />
        ) : (
          <label
            htmlFor={inputId}
            className="flex h-full cursor-pointer flex-col items-center justify-center gap-2 p-6 text-center text-sm text-body hover:bg-slate-100"
          >
            <ImagePlus className="size-6 text-muted" aria-hidden />
            <span>Click to upload</span>
            <span className="text-xs text-muted">PNG, JPG, WebP, AVIF or GIF · max 10 MB</span>
          </label>
        )}

        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70" aria-live="polite">
            <Loader2 className="size-6 animate-spin text-accent" aria-label="Uploading" />
          </div>
        ) : null}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="sr-only"
        onChange={(event) => void handleFile(event.target.files?.[0])}
        disabled={uploading}
      />

      {value ? (
        <div className="mt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            <UploadCloud className="size-4" aria-hidden />
            Replace image
          </Button>
        </div>
      ) : null}

      <FieldError message={error ?? undefined} />
    </div>
  );
}
