"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFooter } from "@/components/admin/form-footer";
import { useActionForm } from "@/components/admin/use-action-form";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { saveExperience } from "@/lib/actions/content";
import {
  experienceSchema,
  experienceTypes,
  type ExperienceInput,
  type ExperienceValues,
} from "@/lib/validations/experience";
import type { Experience } from "@/types";

export function ExperienceForm({ item }: { item?: Experience }) {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<ExperienceInput, unknown, ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      position: item?.position ?? "",
      company: item?.company ?? "",
      location: item?.location ?? "",
      start_date: item?.start_date ?? "",
      end_date: item?.end_date ?? "",
      currently_working: item?.currently_working ?? false,
      description: item?.description ?? "",
      type: item?.type ?? "work",
      sort_order: item?.sort_order ?? 0,
      published: item?.published ?? true,
    },
  });
  const { pending, status, submit } = useActionForm<ExperienceInput>(setError);
  const current = useWatch({ control, name: "currently_working" });
  const type = useWatch({ control, name: "type" });

  const onSubmit = handleSubmit((values) => {
    submit(() => saveExperience(values, item?.id), { redirectTo: "/admin/experience" });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Type" htmlFor="type" error={errors.type?.message}>
          <Select id="type" {...register("type")}>
            {experienceTypes.map((value) => (
              <option key={value} value={value}>
                {value === "work" ? "Work" : "Education"}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={type === "education" ? "Degree / programme" : "Position"} htmlFor="position" error={errors.position?.message}>
          <Input id="position" invalid={Boolean(errors.position)} {...register("position")} />
        </Field>
        <Field label={type === "education" ? "School" : "Company"} htmlFor="company" error={errors.company?.message}>
          <Input id="company" invalid={Boolean(errors.company)} {...register("company")} />
        </Field>
        <Field label="Location" htmlFor="location" error={errors.location?.message}>
          <Input id="location" placeholder="Berlin, Germany / Remote" {...register("location")} />
        </Field>
        <Field label="Start date" htmlFor="start_date" error={errors.start_date?.message}>
          <Input id="start_date" type="date" invalid={Boolean(errors.start_date)} {...register("start_date")} />
        </Field>
        <Field label="End date" htmlFor="end_date" error={errors.end_date?.message}>
          <Input id="end_date" type="date" disabled={Boolean(current)} invalid={Boolean(errors.end_date)} {...register("end_date")} />
        </Field>
        <Field label="Description" htmlFor="description" error={errors.description?.message} className="sm:col-span-2 lg:col-span-3">
          <Textarea id="description" rows={3} {...register("description")} />
        </Field>
        <Field label="Sort order" htmlFor="sort_order" error={errors.sort_order?.message}>
          <Input id="sort_order" type="number" min={0} {...register("sort_order", { valueAsNumber: true })} />
        </Field>
      </div>
      <div className="flex flex-wrap gap-6">
        <Checkbox label="Currently here" description="No end date" {...register("currently_working")} />
        <Checkbox label="Published" description="Show on the About page" {...register("published")} />
      </div>
      <FormFooter pending={pending} submitLabel={item ? "Save changes" : "Add entry"} cancelHref="/admin/experience" status={status} />
    </form>
  );
}
