"use server";

import type { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { uuidSchema } from "@/lib/validations/common";
import { experienceSchema } from "@/lib/validations/experience";
import { serviceSchema } from "@/lib/validations/service";
import { skillSchema } from "@/lib/validations/skill";
import { testimonialSchema } from "@/lib/validations/testimonial";
import type { ActionResult } from "@/types";
import { friendlyDbError, revalidatePublicSite, validate } from "./_helpers";
import { removeStorageObjects } from "./storage";

type SimpleTable = "skills" | "experience" | "services" | "testimonials";

/**
 * Shared CRUD implementation for the simple content tables. Each exported
 * action below binds a table and its validation schema.
 */
async function upsertRecord(
  table: SimpleTable,
  schema: z.ZodType,
  input: unknown,
  id?: string,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  if (id !== undefined) {
    const idCheck = validate(uuidSchema, id);
    if (!idCheck.success) return idCheck.result;
  }

  const parsed = validate(schema, input);
  if (!parsed.success) return parsed.result;

  const supabase = await createClient();
  const query = supabase.from(table);

  const response =
    id !== undefined
      ? await query.update(parsed.data as never).eq("id", id).select("id").single()
      : await query.insert(parsed.data as never).select("id").single();

  if (response.error) return { ok: false, error: friendlyDbError(response.error) };

  revalidatePublicSite();
  return { ok: true, data: { id: response.data.id }, message: id ? "Saved." : "Created." };
}

async function deleteRecord(table: SimpleTable, id: string, imageColumn?: "image_url"): Promise<ActionResult> {
  await requireAdmin();
  const idCheck = validate(uuidSchema, id);
  if (!idCheck.success) return idCheck.result;

  const supabase = await createClient();

  let imageUrl: string | null = null;
  if (imageColumn) {
    const { data } = await supabase.from(table).select(imageColumn).eq("id", id).maybeSingle();
    imageUrl = (data as { image_url?: string | null } | null)?.image_url ?? null;
  }

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return { ok: false, error: friendlyDbError(error) };

  if (imageUrl) await removeStorageObjects([imageUrl]);
  revalidatePublicSite();
  return { ok: true, message: "Deleted." };
}

async function setPublished(table: SimpleTable, id: string, published: boolean): Promise<ActionResult> {
  await requireAdmin();
  const idCheck = validate(uuidSchema, id);
  if (!idCheck.success) return idCheck.result;

  const supabase = await createClient();
  const { error } = await supabase.from(table).update({ published } as never).eq("id", id);
  if (error) return { ok: false, error: friendlyDbError(error) };

  revalidatePublicSite();
  return { ok: true, message: published ? "Published." : "Unpublished." };
}

/* ---------------- Skills ---------------- */
export const saveSkill = async (input: unknown, id?: string) => upsertRecord("skills", skillSchema, input, id);
export const deleteSkill = async (id: string) => deleteRecord("skills", id);
export const setSkillPublished = async (id: string, published: boolean) => setPublished("skills", id, published);

/* ---------------- Experience ---------------- */
export const saveExperience = async (input: unknown, id?: string) =>
  upsertRecord("experience", experienceSchema, input, id);
export const deleteExperience = async (id: string) => deleteRecord("experience", id);
export const setExperiencePublished = async (id: string, published: boolean) =>
  setPublished("experience", id, published);

/* ---------------- Services ---------------- */
export const saveService = async (input: unknown, id?: string) => upsertRecord("services", serviceSchema, input, id);
export const deleteService = async (id: string) => deleteRecord("services", id);
export const setServicePublished = async (id: string, published: boolean) =>
  setPublished("services", id, published);

/* ---------------- Testimonials ---------------- */
export const saveTestimonial = async (input: unknown, id?: string) =>
  upsertRecord("testimonials", testimonialSchema, input, id);
export const deleteTestimonial = async (id: string) => deleteRecord("testimonials", id, "image_url");
export const setTestimonialPublished = async (id: string, published: boolean) =>
  setPublished("testimonials", id, published);
