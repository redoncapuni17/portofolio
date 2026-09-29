"use server";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { blogPostSchema } from "@/lib/validations/blog";
import { uuidSchema } from "@/lib/validations/common";
import type { ActionResult } from "@/types";
import { friendlyDbError, revalidatePublicSite, validate } from "./_helpers";
import { removeStorageObjects } from "./storage";

function withPublishedAt<T extends { published: boolean; published_at: string | null }>(values: T): T {
  if (values.published && !values.published_at) {
    return { ...values, published_at: new Date().toISOString() };
  }
  return values;
}

export async function createPost(input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = validate(blogPostSchema, input);
  if (!parsed.success) return parsed.result;

  const values = withPublishedAt(parsed.data);
  const supabase = await createClient();
  const { data, error } = await supabase.from("blog_posts").insert(values).select("id").single();
  if (error) return { ok: false, error: friendlyDbError(error) };

  revalidatePublicSite(`/blog/${values.slug}`);
  return { ok: true, data: { id: data.id }, message: "Post created." };
}

export async function updatePost(id: string, input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const idCheck = validate(uuidSchema, id);
  if (!idCheck.success) return idCheck.result;
  const parsed = validate(blogPostSchema, input);
  if (!parsed.success) return parsed.result;

  const values = withPublishedAt(parsed.data);
  const supabase = await createClient();
  const { data: previous } = await supabase.from("blog_posts").select("slug").eq("id", id).maybeSingle();

  const { error } = await supabase.from("blog_posts").update(values).eq("id", id);
  if (error) return { ok: false, error: friendlyDbError(error) };

  revalidatePublicSite(`/blog/${values.slug}`, previous ? `/blog/${previous.slug}` : "");
  return { ok: true, message: "Post saved." };
}

export async function setPostPublished(id: string, published: boolean): Promise<ActionResult> {
  await requireAdmin();
  const idCheck = validate(uuidSchema, id);
  if (!idCheck.success) return idCheck.result;

  const supabase = await createClient();
  const { data: current } = await supabase
    .from("blog_posts")
    .select("slug, published_at")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("blog_posts")
    .update({
      published,
      published_at: published ? (current?.published_at ?? new Date().toISOString()) : current?.published_at,
    })
    .eq("id", id);
  if (error) return { ok: false, error: friendlyDbError(error) };

  revalidatePublicSite(current ? `/blog/${current.slug}` : "");
  return { ok: true, message: published ? "Post published." : "Post unpublished." };
}

export async function deletePost(id: string): Promise<ActionResult> {
  await requireAdmin();
  const idCheck = validate(uuidSchema, id);
  if (!idCheck.success) return idCheck.result;

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("slug, cover_image")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return { ok: false, error: friendlyDbError(error) };

  await removeStorageObjects([post?.cover_image]);
  revalidatePublicSite(post ? `/blog/${post.slug}` : "");
  return { ok: true, message: "Post deleted." };
}
