import { z } from "zod";
import { optionalText, optionalUrl, sortOrderSchema } from "./common";

export const testimonialSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  position: optionalText,
  company: optionalText,
  quote: z.string().trim().min(10, "Quote is too short").max(1000),
  image_url: optionalUrl,
  rating: z.coerce.number().int().min(1).max(5).default(5),
  sort_order: sortOrderSchema,
  published: z.boolean().default(false),
});

export type TestimonialInput = z.input<typeof testimonialSchema>;
export type TestimonialValues = z.output<typeof testimonialSchema>;
