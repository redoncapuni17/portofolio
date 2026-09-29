import { z } from "zod";
import { optionalText, sortOrderSchema } from "./common";

export const skillCategories = ["frontend", "backend", "tools"] as const;

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  category: z.enum(skillCategories),
  icon: optionalText,
  description: optionalText,
  sort_order: sortOrderSchema,
  published: z.boolean().default(false),
});

export type SkillInput = z.input<typeof skillSchema>;
export type SkillValues = z.output<typeof skillSchema>;
