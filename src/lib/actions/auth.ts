"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/auth";
import { validate } from "./_helpers";

export type LoginState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

function safeNextPath(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "/admin";
  // Only allow same-origin admin paths to prevent open redirects.
  if (!value.startsWith("/admin") || value.startsWith("//")) return "/admin";
  return value;
}

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = validate(loginSchema, {
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.result.error, fieldErrors: parsed.result.fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return { error: "Invalid email or password." };
  }

  // Only users with an admin profile may enter the admin area.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    await supabase.auth.signOut();
    return { error: "This account does not have admin access." };
  }

  redirect(safeNextPath(formData.get("next")));
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
