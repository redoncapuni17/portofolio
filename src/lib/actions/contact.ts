"use server";

import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/public";
import { contactSchema } from "@/lib/validations/contact";
import type { ActionResult } from "@/types";

export async function submitContactMessage(input: unknown): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  // Honeypot triggered: pretend success without storing anything.
  if (parsed.data.website) {
    return { ok: true, message: "Thanks! Your message has been sent." };
  }

  // Anonymous client: RLS only permits INSERT for the public role.
  const supabase = createPublicClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) {
    console.error("[contact] insert failed:", error.message);
    return { ok: false, error: "Your message could not be sent. Please try again or email me directly." };
  }

  return { ok: true, message: "Thanks! Your message has been sent. I will reply within two business days." };
}
