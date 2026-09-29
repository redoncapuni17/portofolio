import { z } from "zod";
import { optionalText, optionalUrl } from "./common";

export const settingsSchema = z.object({
  developer_name: z.string().trim().min(2, "Name is required").max(80),
  hero_title: z.string().trim().min(2, "Hero title is required").max(120),
  hero_description: z.string().trim().max(400),
  email: z.union([z.literal(""), z.email("Enter a valid email")]),
  github_url: optionalUrl,
  linkedin_url: optionalUrl,
  location: optionalText,
  availability: optionalText,
  profile_image: optionalUrl,
  seo_title: z.string().trim().max(70),
  seo_description: z.string().trim().max(200),
  years_experience: z.string().trim().max(5),
  projects_completed: z.string().trim().max(6),
});

export type SettingsInput = z.input<typeof settingsSchema>;
export type SettingsValues = z.output<typeof settingsSchema>;
