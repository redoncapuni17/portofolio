import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RichText } from "@/components/ui/rich-text";
import { getPostBySlug, getPublishedPostSlugs } from "@/lib/queries/blog";
import { estimateReadTime, formatDate } from "@/lib/utils/format";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: post.author ? [post.author] : undefined,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="container-page py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="group enter inline-flex items-center gap-1.5 text-sm font-medium text-body hover:text-heading focus-ring rounded"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All articles
        </Link>

        <header className="enter mt-8" style={{ animationDelay: "80ms" }}>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
            {post.category ? <Badge tone="accent">{post.category}</Badge> : null}
            <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
            <span aria-hidden>·</span>
            <span>{estimateReadTime(post.content)}</span>
            {post.author ? (
              <>
                <span aria-hidden>·</span>
                <span>{post.author}</span>
              </>
            ) : null}
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-relaxed">{post.excerpt}</p>
        </header>

        {post.cover_image ? (
          <div
            className="enter relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-line bg-wash shadow-card"
            style={{ animationDelay: "160ms" }}
          >
            <Image
              src={post.cover_image}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="reveal">
          <RichText content={post.content} className="mt-12 text-lg" />
        </div>
      </div>
    </article>
  );
}
