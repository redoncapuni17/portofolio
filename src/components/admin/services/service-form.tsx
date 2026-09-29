"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFooter } from "@/components/admin/form-footer";
import { useActionForm } from "@/components/admin/use-action-form";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/form";
import { iconNames } from "@/components/ui/icon";
import { saveService } from "@/lib/actions/content";
import { serviceSchema, type ServiceInput, type ServiceValues } from "@/lib/validations/service";
import type { Service } from "@/types";

export function ServiceForm({ service }: { service?: Service }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ServiceInput, unknown, ServiceValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: service?.title ?? "",
      description: service?.description ?? "",
      icon: service?.icon ?? "",
      technologies: service?.technologies.join(", ") ?? "",
      sort_order: service?.sort_order ?? 0,
      published: service?.published ?? true,
    },
  });
  const { pending, status, submit } = useActionForm<ServiceInput>(setError);

  const onSubmit = handleSubmit((values) => {
    submit(() => saveService(values, service?.id), { redirectTo: "/admin/services" });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title" htmlFor="title" error={errors.title?.message}>
          <Input id="title" invalid={Boolean(errors.title)} {...register("title")} />
        </Field>
        <Field label="Icon" htmlFor="icon" error={errors.icon?.message} hint="e.g. globe, server, smartphone">
          <Input id="icon" list="service-icon-names" {...register("icon")} />
          <datalist id="service-icon-names">
            {iconNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </Field>
        <Field label="Description" htmlFor="description" error={errors.description?.message} className="sm:col-span-2">
          <Textarea id="description" rows={3} invalid={Boolean(errors.description)} {...register("description")} />
        </Field>
        <Field label="Technologies" htmlFor="technologies" error={errors.technologies?.message} hint="Comma separated">
          <Input id="technologies" placeholder="React, Next.js, TypeScript" {...register("technologies")} />
        </Field>
        <Field label="Sort order" htmlFor="sort_order" error={errors.sort_order?.message}>
          <Input id="sort_order" type="number" min={0} {...register("sort_order", { valueAsNumber: true })} />
        </Field>
      </div>
      <Checkbox label="Published" description="Show on the Services page" {...register("published")} />
      <FormFooter pending={pending} submitLabel={service ? "Save changes" : "Add service"} cancelHref="/admin/services" status={status} />
    </form>
  );
}
