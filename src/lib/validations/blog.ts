import { z } from "zod";
import { optionalText, optionalUrl, slugSchema } from "./common";

export const blogPostSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(160),
  slug: slugSchema,
  excerpt: z.string().trim().min(10, "Add a short excerpt").max(300),
  content: z.string().trim().min(50, "Content should be at least 50 characters"),
  cover_image: optionalUrl,
  category: optionalText,
  author: optionalText,
  published: z.boolean().default(false),
  published_at: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value))
    .refine((value) => value === null || !Number.isNaN(new Date(value).getTime()), {
      message: "Enter a valid date",
    }),
});

export type BlogPostInput = z.input<typeof blogPostSchema>;
export type BlogPostValues = z.output<typeof blogPostSchema>;
