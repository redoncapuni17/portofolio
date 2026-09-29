"use server";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { settingsSchema } from "@/lib/validations/settings";
import type { ActionResult } from "@/types";
import { friendlyDbError, revalidatePublicSite, validate } from "./_helpers";

export async function updateSettings(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = validate(settingsSchema, input);
  if (!parsed.success) return parsed.result;

  const rows = Object.entries(parsed.data).map(([key, value]) => ({
    key,
    value: value === null || value === "" ? null : String(value),
  }));

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) return { ok: false, error: friendlyDbError(error) };

  revalidatePublicSite("/admin/login");
  return { ok: true, message: "Settings saved." };
}
