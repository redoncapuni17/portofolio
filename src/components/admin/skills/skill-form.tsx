"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFooter } from "@/components/admin/form-footer";
import { useActionForm } from "@/components/admin/use-action-form";
import { Checkbox, Field, Input, Select } from "@/components/ui/form";
import { iconNames } from "@/components/ui/icon";
import { saveSkill } from "@/lib/actions/content";
import { skillCategories, skillSchema, type SkillInput, type SkillValues } from "@/lib/validations/skill";
import type { Skill } from "@/types";

export function SkillForm({ skill }: { skill?: Skill }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SkillInput, unknown, SkillValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? "frontend",
      icon: skill?.icon ?? "",
      description: skill?.description ?? "",
      sort_order: skill?.sort_order ?? 0,
      published: skill?.published ?? true,
    },
  });
  const { pending, status, submit } = useActionForm<SkillInput>(setError);

  const onSubmit = handleSubmit((values) => {
    submit(() => saveSkill(values, skill?.id), { redirectTo: "/admin/skills" });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" invalid={Boolean(errors.name)} {...register("name")} />
        </Field>
        <Field label="Category" htmlFor="category" error={errors.category?.message}>
          <Select id="category" {...register("category")}>
            {skillCategories.map((category) => (
              <option key={category} value={category}>
                {category[0].toUpperCase() + category.slice(1)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Icon" htmlFor="icon" error={errors.icon?.message} hint="Optional. Pick a known icon name.">
          <Input id="icon" list="icon-names" placeholder="react" {...register("icon")} />
          <datalist id="icon-names">
            {iconNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </Field>
        <Field label="Description" htmlFor="description" error={errors.description?.message} className="sm:col-span-2">
          <Input id="description" placeholder="Short note shown on hover" {...register("description")} />
        </Field>
        <Field label="Sort order" htmlFor="sort_order" error={errors.sort_order?.message}>
          <Input id="sort_order" type="number" min={0} {...register("sort_order", { valueAsNumber: true })} />
        </Field>
      </div>
      <Checkbox label="Published" description="Show on the About page" {...register("published")} />
      <FormFooter pending={pending} submitLabel={skill ? "Save changes" : "Add skill"} cancelHref="/admin/skills" status={status} />
    </form>
  );
}
