import "server-only";

import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { SiteSettings, SiteSettingsKey } from "@/types";
import { safeQuery } from "./_helpers";

export const DEFAULT_SETTINGS: SiteSettings = {
  developer_name: "Your Name",
  hero_title: "Full-Stack Software Developer",
  hero_description:
    "I build fast, accessible web applications from first commit to production.",
  email: "",
  github_url: "",
  linkedin_url: "",
  location: "",
  availability: "",
  profile_image: "",
  seo_title: "Full-Stack Software Developer Portfolio",
  seo_description:
    "Portfolio of a full-stack software developer specialising in React, Next.js, Node.js and Python.",
  years_experience: "5",
  projects_completed: "20",
};

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = createPublicClient();
  const rows = await safeQuery(
    "site_settings",
    () => supabase.from("site_settings").select("key, value"),
    [],
  );

  const settings: SiteSettings = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    if (row.key in settings && row.value !== null) {
      settings[row.key as SiteSettingsKey] = row.value;
    }
  }
  return settings;
});
