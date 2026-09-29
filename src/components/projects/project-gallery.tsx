import Image from "next/image";
import type { ProjectImage } from "@/types";

export function ProjectGallery({ images, title }: { images: ProjectImage[]; title: string }) {
  if (images.length === 0) return null;

  return (
    <section aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="text-2xl font-semibold">
        Screenshots
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {images.map((image) => (
          <li key={image.id}>
            <figure className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
              <div className="relative aspect-[16/10] bg-slate-100">
                <Image
                  src={image.image_url}
                  alt={image.caption ?? `${title} screenshot`}
                  fill
                  loading="lazy"
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              {image.caption ? (
                <figcaption className="px-4 py-3 text-sm text-body">{image.caption}</figcaption>
              ) : null}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
