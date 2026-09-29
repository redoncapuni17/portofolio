import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types";
import { safeQuery } from "./_helpers";

export type BlogPostSummary = Pick<
  BlogPost,
  "id" | "title" | "slug" | "excerpt" | "cover_image" | "category" | "author" | "published_at" | "content"
>;

/* ---------------- Public (anon, cookie-less) ---------------- */

export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  const supabase = createPublicClient();
  return safeQuery(
    "blog_posts.published",
    () =>
      supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image, category, author, published_at, content")
        .eq("published", true)
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false }),
    [],
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createPublicClient();
  return safeQuery(
    `blog_posts.slug:${slug}`,
    () =>
      supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle(),
    null,
  );
}

export async function getPublishedPostSlugs(): Promise<Pick<BlogPost, "slug" | "updated_at">[]> {
  const supabase = createPublicClient();
  return safeQuery(
    "blog_posts.slugs",
    () => supabase.from("blog_posts").select("slug, updated_at").eq("published", true),
    [],
  );
}

/* ---------------- Admin (cookie-bound session; RLS grants admins full access) ---------------- */

export async function getAllPostsAdmin(): Promise<BlogPost[]> {
  const supabase = await createClient();
  return safeQuery(
    "blog_posts.admin.all",
    () => supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
    [],
  );
}

export async function getPostByIdAdmin(id: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  return safeQuery(
    `blog_posts.admin:${id}`,
    () => supabase.from("blog_posts").select("*").eq("id", id).maybeSingle(),
    null,
  );
}
