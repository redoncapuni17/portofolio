import { z } from "zod";
import { optionalText, sortOrderSchema, stringList } from "./common";

export const serviceSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(80),
  description: z.string().trim().min(10, "Add a description").max(600),
  icon: optionalText,
  technologies: stringList,
  sort_order: sortOrderSchema,
  published: z.boolean().default(false),
});

export type ServiceInput = z.input<typeof serviceSchema>;
export type ServiceValues = z.output<typeof serviceSchema>;
