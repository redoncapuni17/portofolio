import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPostSummary } from "@/lib/queries/blog";
import { estimateReadTime, formatDate } from "@/lib/utils/format";

export function PostCard({ post }: { post: BlogPostSummary }) {
  const href = `/blog/${post.slug}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-shadow hover:shadow-card">
      {post.cover_image ? (
        <Link href={href} className="relative block aspect-[16/9] bg-slate-100 focus-ring" tabIndex={-1}>
          <Image
            src={post.cover_image}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </Link>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs text-muted">
          {post.category ? <Badge tone="accent">{post.category}</Badge> : null}
          <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
          <span aria-hidden>·</span>
          <span>{estimateReadTime(post.content)}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug">
          <Link href={href} className="focus-ring rounded hover:text-accent">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{post.excerpt}</p>
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover focus-ring rounded"
        >
          Read article
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
