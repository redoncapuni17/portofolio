import { z } from "zod";
import { optionalText, sortOrderSchema } from "./common";

export const experienceTypes = ["work", "education"] as const;

const dateString = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the format YYYY-MM-DD");

export const experienceSchema = z
  .object({
    position: z.string().trim().min(2, "Position is required").max(120),
    company: z.string().trim().min(1, "Company / school is required").max(120),
    location: optionalText,
    start_date: dateString,
    end_date: z
      .string()
      .trim()
      .transform((value) => (value === "" ? null : value))
      .refine((value) => value === null || /^\d{4}-\d{2}-\d{2}$/.test(value), {
        message: "Use the format YYYY-MM-DD",
      }),
    currently_working: z.boolean().default(false),
    description: optionalText,
    type: z.enum(experienceTypes),
    sort_order: sortOrderSchema,
    published: z.boolean().default(false),
  })
  .refine((data) => data.currently_working || data.end_date !== null, {
    message: "Add an end date or mark as current",
    path: ["end_date"],
  })
  .refine(
    (data) => data.end_date === null || new Date(data.end_date) >= new Date(data.start_date),
    { message: "End date must be after the start date", path: ["end_date"] },
  );

export type ExperienceInput = z.input<typeof experienceSchema>;
export type ExperienceValues = z.output<typeof experienceSchema>;
