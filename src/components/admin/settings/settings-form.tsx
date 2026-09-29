"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFooter } from "@/components/admin/form-footer";
import { ImageUpload } from "@/components/admin/image-upload";
import { useActionForm } from "@/components/admin/use-action-form";
import { Field, Input, Textarea } from "@/components/ui/form";
import { updateSettings } from "@/lib/actions/settings";
import { settingsSchema, type SettingsInput, type SettingsValues } from "@/lib/validations/settings";
import type { SiteSettings } from "@/types";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<SettingsInput, unknown, SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });
  const { pending, status, submit } = useActionForm<SettingsInput>(setError);

  const onSubmit = handleSubmit((values) => {
    submit(() => updateSettings(values), { successMessage: "Settings saved." });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <section className="rounded-2xl border border-line bg-surface p-6 shadow-soft">
        <h2 className="text-base font-semibold">Profile</h2>
        <p className="mb-6 text-sm text-body">Shown in the hero, navbar and footer.</p>
        <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name" htmlFor="developer_name" error={errors.developer_name?.message}>
              <Input id="developer_name" invalid={Boolean(errors.developer_name)} {...register("developer_name")} />
            </Field>
            <Field label="Hero title" htmlFor="hero_title" error={errors.hero_title?.message}>
              <Input id="hero_title" placeholder="Full-Stack Software Developer" {...register("hero_title")} />
            </Field>
            <Field label="Hero description" htmlFor="hero_description" error={errors.hero_description?.message} className="sm:col-span-2">
              <Textarea id="hero_description" rows={3} maxLength={400} {...register("hero_description")} />
            </Field>
            <Field label="Location" htmlFor="location" error={errors.location?.message}>
              <Input id="location" placeholder="Tirana, Albania" {...register("location")} />
            </Field>
            <Field label="Availability" htmlFor="availability" error={errors.availability?.message}>
              <Input id="availability" placeholder="Available for new projects" {...register("availability")} />
            </Field>
          </div>
          <Controller
            control={control}
            name="profile_image"
            render={({ field }) => (
              <ImageUpload
                bucket="profile"
                folder="avatar"
                label="Profile photo"
                aspect="square"
                value={typeof field.value === "string" ? field.value : null}
                onChange={(url) => field.onChange(url ?? "")}
              />
            )}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-6 shadow-soft">
        <h2 className="text-base font-semibold">Contact & social</h2>
        <p className="mb-6 text-sm text-body">Links used in the footer and contact page.</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Public email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" invalid={Boolean(errors.email)} {...register("email")} />
          </Field>
          <Field label="GitHub URL" htmlFor="github_url" error={errors.github_url?.message}>
            <Input id="github_url" type="url" placeholder="https://github.com/you" {...register("github_url")} />
          </Field>
          <Field label="LinkedIn URL" htmlFor="linkedin_url" error={errors.linkedin_url?.message}>
            <Input id="linkedin_url" type="url" placeholder="https://linkedin.com/in/you" {...register("linkedin_url")} />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-6 shadow-soft">
        <h2 className="text-base font-semibold">Stats & SEO</h2>
        <p className="mb-6 text-sm text-body">Numbers on the home page and default search metadata.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Years of experience" htmlFor="years_experience" error={errors.years_experience?.message}>
            <Input id="years_experience" placeholder="5" {...register("years_experience")} />
          </Field>
          <Field label="Projects completed" htmlFor="projects_completed" error={errors.projects_completed?.message}>
            <Input id="projects_completed" placeholder="20" {...register("projects_completed")} />
          </Field>
          <Field label="SEO title" htmlFor="seo_title" error={errors.seo_title?.message} hint="Up to 70 characters">
            <Input id="seo_title" maxLength={70} {...register("seo_title")} />
          </Field>
          <Field label="SEO description" htmlFor="seo_description" error={errors.seo_description?.message} hint="Up to 200 characters">
            <Textarea id="seo_description" rows={2} maxLength={200} {...register("seo_description")} />
          </Field>
        </div>
      </section>

      <FormFooter pending={pending} submitLabel="Save settings" status={status} />
    </form>
  );
}
