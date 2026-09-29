"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input, Textarea } from "@/components/ui/form";
import { submitContactMessage } from "@/lib/actions/contact";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", website: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setStatus(null);
    startTransition(async () => {
      const result = await submitContactMessage(values);
      if (result.ok) {
        setStatus({ tone: "success", text: result.message ?? "Message sent." });
        reset();
        return;
      }
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.[0]) {
            setError(field as keyof ContactInput, { message: messages[0] });
          }
        }
      }
      setStatus({ tone: "error", text: result.error });
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="Name" htmlFor="name" error={errors.name?.message}>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Jane Smith"
          invalid={Boolean(errors.name)}
          {...register("name")}
        />
      </Field>

      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="jane@company.com"
          invalid={Boolean(errors.email)}
          {...register("email")}
        />
      </Field>

      <Field label="Message" htmlFor="message" error={errors.message?.message}>
        <Textarea
          id="message"
          rows={6}
          placeholder="Tell me a bit about your project, timeline and budget."
          invalid={Boolean(errors.message)}
          {...register("message")}
        />
      </Field>

      {/* Honeypot: hidden from users, filled by bots. */}
      <div className="hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {status ? <FormMessage tone={status.tone}>{status.text}</FormMessage> : null}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send Message"}
        <Send className="size-4" aria-hidden />
      </Button>
      <p className="text-center text-xs leading-relaxed text-muted">
        I reply within two business days. Your details stay private.
      </p>
    </form>
  );
}
