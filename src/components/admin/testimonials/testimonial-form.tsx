"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFooter } from "@/components/admin/form-footer";
import { ImageUpload } from "@/components/admin/image-upload";
import { useActionForm } from "@/components/admin/use-action-form";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { saveTestimonial } from "@/lib/actions/content";
import { testimonialSchema, type TestimonialInput, type TestimonialValues } from "@/lib/validations/testimonial";
import type { Testimonial } from "@/types";

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<TestimonialInput, unknown, TestimonialValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: testimonial?.name ?? "",
      position: testimonial?.position ?? "",
      company: testimonial?.company ?? "",
      quote: testimonial?.quote ?? "",
      image_url: testimonial?.image_url ?? "",
      rating: testimonial?.rating ?? 5,
      sort_order: testimonial?.sort_order ?? 0,
      published: testimonial?.published ?? true,
    },
  });
  const { pending, status, submit } = useActionForm<TestimonialInput>(setError);

  const onSubmit = handleSubmit((values) => {
    submit(() => saveTestimonial(values, testimonial?.id), { redirectTo: "/admin/testimonials" });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Client name" htmlFor="name" error={errors.name?.message}>
            <Input id="name" invalid={Boolean(errors.name)} {...register("name")} />
          </Field>
          <Field label="Position" htmlFor="position" error={errors.position?.message}>
            <Input id="position" placeholder="Head of Product" {...register("position")} />
          </Field>
          <Field label="Company" htmlFor="company" error={errors.company?.message}>
            <Input id="company" {...register("company")} />
          </Field>
          <Field label="Rating" htmlFor="rating" error={errors.rating?.message}>
            <Select id="rating" {...register("rating", { valueAsNumber: true })}>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} star{value === 1 ? "" : "s"}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Quote" htmlFor="quote" error={errors.quote?.message} className="sm:col-span-2">
            <Textarea id="quote" rows={4} invalid={Boolean(errors.quote)} {...register("quote")} />
          </Field>
          <Field label="Sort order" htmlFor="sort_order" error={errors.sort_order?.message}>
            <Input id="sort_order" type="number" min={0} {...register("sort_order", { valueAsNumber: true })} />
          </Field>
        </div>

        <Controller
          control={control}
          name="image_url"
          render={({ field }) => (
            <ImageUpload
              bucket="testimonials"
              folder="avatars"
              label="Client photo"
              aspect="square"
              value={typeof field.value === "string" ? field.value : null}
              onChange={(url) => field.onChange(url ?? "")}
            />
          )}
        />
      </div>
      <Checkbox label="Published" description="Show on the Testimonials page" {...register("published")} />
      <FormFooter
        pending={pending}
        submitLabel={testimonial ? "Save changes" : "Add testimonial"}
        cancelHref="/admin/testimonials"
        status={status}
      />
    </form>
  );
}
