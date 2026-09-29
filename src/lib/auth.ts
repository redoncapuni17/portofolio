import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export type AdminSession = {
  userId: string;
  email: string;
  profile: Profile | null;
};

/**
 * Returns the current authenticated user (verified against Supabase Auth)
 * or null. Memoised per request.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * Data-access-layer guard. Verifies the session server-side and ensures the
 * user has the `admin` role in `profiles`. Redirects to the login page if
 * not authenticated, and signs out non-admins.
 */
export const requireAdmin = cache(async (): Promise<AdminSession> => {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    await supabase.auth.signOut();
    redirect("/admin/login?error=forbidden");
  }

  return { userId: user.id, email: user.email ?? profile.email, profile };
});
