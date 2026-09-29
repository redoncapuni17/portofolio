import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug must be at least 2 characters")
  .max(80, "Slug is too long")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");

export const optionalUrl = z
  .union([z.literal(""), z.url("Enter a valid URL (https://…)")])
  .transform((value) => (value === "" ? null : value));

export const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value));

export const sortOrderSchema = z.coerce.number().int().min(0).max(10000).default(0);

/**
 * Accepts either an array of strings or a newline/comma separated string.
 */
export const stringList = z.preprocess((value) => {
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}, z.array(z.string().max(120)).max(50));

export const uuidSchema = z.uuid("Invalid identifier");
