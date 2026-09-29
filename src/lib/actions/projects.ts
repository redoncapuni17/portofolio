"use server";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { projectImageSchema, projectSchema, technologySchema } from "@/lib/validations/project";
import { uuidSchema } from "@/lib/validations/common";
import type { ActionResult, Technology } from "@/types";
import { friendlyDbError, revalidatePublicSite, validate } from "./_helpers";
import { removeStorageObjects } from "./storage";

async function syncTechnologies(projectId: string, technologyIds: string[]): Promise<string | null> {
  const supabase = await createClient();
  const { error: deleteError } = await supabase
    .from("project_technologies")
    .delete()
    .eq("project_id", projectId);
  if (deleteError) return friendlyDbError(deleteError);

  if (technologyIds.length === 0) return null;
  const { error: insertError } = await supabase
    .from("project_technologies")
    .insert(technologyIds.map((technology_id) => ({ project_id: projectId, technology_id })));
  return insertError ? friendlyDbError(insertError) : null;
}

export async function createProject(input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = validate(projectSchema, input);
  if (!parsed.success) return parsed.result;

  const { technology_ids, ...values } = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").insert(values).select("id").single();
  if (error) return { ok: false, error: friendlyDbError(error) };

  const techError = await syncTechnologies(data.id, technology_ids);
  if (techError) return { ok: false, error: techError };

  revalidatePublicSite(`/projects/${values.slug}`);
  return { ok: true, data: { id: data.id }, message: "Project created." };
}

export async function updateProject(id: string, input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const idCheck = validate(uuidSchema, id);
  if (!idCheck.success) return idCheck.result;
  const parsed = validate(projectSchema, input);
  if (!parsed.success) return parsed.result;

  const { technology_ids, ...values } = parsed.data;
  const supabase = await createClient();

  const { data: previous } = await supabase.from("projects").select("slug").eq("id", id).maybeSingle();

  const { error } = await supabase.from("projects").update(values).eq("id", id);
  if (error) return { ok: false, error: friendlyDbError(error) };

  const techError = await syncTechnologies(id, technology_ids);
  if (techError) return { ok: false, error: techError };

  revalidatePublicSite(`/projects/${values.slug}`, previous ? `/projects/${previous.slug}` : "");
  return { ok: true, message: "Project saved." };
}

export async function setProjectPublished(id: string, published: boolean): Promise<ActionResult> {
  await requireAdmin();
  const idCheck = validate(uuidSchema, id);
  if (!idCheck.success) return idCheck.result;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update({ published })
    .eq("id", id)
    .select("slug")
    .single();
  if (error) return { ok: false, error: friendlyDbError(error) };

  revalidatePublicSite(`/projects/${data.slug}`);
  return { ok: true, message: published ? "Project published." : "Project unpublished." };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  const idCheck = validate(uuidSchema, id);
  if (!idCheck.success) return idCheck.result;

  const supabase = await createClient();

  const [{ data: project }, { data: images }] = await Promise.all([
    supabase.from("projects").select("slug, cover_image").eq("id", id).maybeSingle(),
    supabase.from("project_images").select("image_url").eq("project_id", id),
  ]);

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { ok: false, error: friendlyDbError(error) };

  await removeStorageObjects([project?.cover_image, ...(images ?? []).map((img) => img.image_url)]);

  revalidatePublicSite(project ? `/projects/${project.slug}` : "");
  return { ok: true, message: "Project deleted." };
}

/* ---------------- Project images ---------------- */

export async function addProjectImage(input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = validate(projectImageSchema, input);
  if (!parsed.success) return parsed.result;

  const supabase = await createClient();
  const { data, error } = await supabase.from("project_images").insert(parsed.data).select("id").single();
  if (error) return { ok: false, error: friendlyDbError(error) };

  const { data: project } = await supabase
    .from("projects")
    .select("slug")
    .eq("id", parsed.data.project_id)
    .maybeSingle();

  revalidatePublicSite(project ? `/projects/${project.slug}` : "");
  return { ok: true, data: { id: data.id }, message: "Screenshot added." };
}

export async function deleteProjectImage(id: string): Promise<ActionResult> {
  await requireAdmin();
  const idCheck = validate(uuidSchema, id);
  if (!idCheck.success) return idCheck.result;

  const supabase = await createClient();
  const { data: image } = await supabase
    .from("project_images")
    .select("image_url, project_id")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("project_images").delete().eq("id", id);
  if (error) return { ok: false, error: friendlyDbError(error) };

  let slug: string | undefined;
  if (image) {
    await removeStorageObjects([image.image_url]);
    const { data: project } = await supabase
      .from("projects")
      .select("slug")
      .eq("id", image.project_id)
      .maybeSingle();
    slug = project?.slug;
  }

  revalidatePublicSite(slug ? `/projects/${slug}` : "");
  return { ok: true, message: "Screenshot removed." };
}

/* ---------------- Technologies ---------------- */

export async function createTechnology(input: unknown): Promise<ActionResult<Technology>> {
  await requireAdmin();
  const parsed = validate(technologySchema, input);
  if (!parsed.success) return parsed.result;

  const supabase = await createClient();
  const { data, error } = await supabase.from("technologies").insert(parsed.data).select("*").single();
  if (error) return { ok: false, error: friendlyDbError(error) };

  return { ok: true, data, message: "Technology added." };
}
