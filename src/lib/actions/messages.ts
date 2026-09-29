"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { uuidSchema } from "@/lib/validations/common";
import type { ActionResult } from "@/types";
import { friendlyDbError, validate } from "./_helpers";

export async function setMessageRead(id: string, read: boolean): Promise<ActionResult> {
  await requireAdmin();
  const idCheck = validate(uuidSchema, id);
  if (!idCheck.success) return idCheck.result;

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").update({ read }).eq("id", id);
  if (error) return { ok: false, error: friendlyDbError(error) };

  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await requireAdmin();
  const idCheck = validate(uuidSchema, id);
  if (!idCheck.success) return idCheck.result;

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { ok: false, error: friendlyDbError(error) };

  revalidatePath("/admin", "layout");
  return { ok: true, message: "Message deleted." };
}
