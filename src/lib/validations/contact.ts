import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.email("Enter a valid email address").trim().max(200),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a little more (at least 10 characters)")
    .max(3000, "Message is too long"),
  // Honeypot field; must stay empty.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
