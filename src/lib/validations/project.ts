import { z } from "zod";
import {
  optionalText,
  optionalUrl,
  slugSchema,
  sortOrderSchema,
  stringList,
  uuidSchema,
} from "./common";

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(120),
  slug: slugSchema,
  short_description: z.string().trim().min(10, "Add a short description").max(200),
  description: optionalText,
  problem: optionalText,
  solution: optionalText,
  results: optionalText,
  role: optionalText,
  timeline: optionalText,
  project_type: optionalText,
  live_url: optionalUrl,
  github_url: optionalUrl,
  cover_image: optionalUrl,
  key_features: stringList,
  technology_ids: z.array(uuidSchema).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  sort_order: sortOrderSchema,
});

export type ProjectInput = z.input<typeof projectSchema>;
export type ProjectValues = z.output<typeof projectSchema>;

export const projectImageSchema = z.object({
  project_id: uuidSchema,
  image_url: z.url(),
  image_type: z.enum(["screenshot", "cover", "other"]).default("screenshot"),
  caption: optionalText,
  sort_order: sortOrderSchema,
});

export type ProjectImageInput = z.infer<typeof projectImageSchema>;

export const technologySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  icon: optionalText,
});
