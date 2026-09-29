"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFooter } from "@/components/admin/form-footer";
import { ImageUpload } from "@/components/admin/image-upload";
import { useActionForm } from "@/components/admin/use-action-form";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/form";
import { createProject, updateProject } from "@/lib/actions/projects";
import { slugify } from "@/lib/utils/slugify";
import { projectSchema, type ProjectInput, type ProjectValues } from "@/lib/validations/project";
import type { ProjectDetail, Technology } from "@/types";
import { TechnologyPicker } from "./technology-picker";

/** Field values match the schema's input type so the zod resolver lines up exactly. */
type FormValues = ProjectInput;

function toFormValues(project?: ProjectDetail): FormValues {
  return {
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    short_description: project?.short_description ?? "",
    description: project?.description ?? "",
    problem: project?.problem ?? "",
    solution: project?.solution ?? "",
    results: project?.results ?? "",
    role: project?.role ?? "",
    timeline: project?.timeline ?? "",
    project_type: project?.project_type ?? "",
    live_url: project?.live_url ?? "",
    github_url: project?.github_url ?? "",
    cover_image: project?.cover_image ?? "",
    key_features: project?.key_features.join("\n") ?? "",
    technology_ids: project?.technologies.map((tech) => tech.id) ?? [],
    featured: project?.featured ?? false,
    published: project?.published ?? false,
    sort_order: project?.sort_order ?? 0,
  };
}

export function ProjectForm({ project, technologies }: { project?: ProjectDetail; technologies: Technology[] }) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues, unknown, ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: toFormValues(project),
  });

  const { pending, status, submit } = useActionForm<FormValues>(setError);

  const onSubmit = handleSubmit((values) => {
    if (project) {
      submit(() => updateProject(project.id, values), { successMessage: "Project saved." });
    } else {
      submit(() => createProject(values), {
        redirectTo: (data) => (data ? `/admin/projects/${data.id}/edit` : "/admin/projects"),
      });
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <section className="grid gap-6 rounded-2xl border border-line bg-surface p-6 shadow-soft lg:grid-cols-2">
        <Field label="Title" htmlFor="title" error={errors.title?.message}>
          <Input
            id="title"
            invalid={Boolean(errors.title)}
            {...register("title", {
              onBlur: (event) => {
                // Auto-fill the slug from the title when it is still empty.
                if (!getValues("slug")) {
                  setValue("slug", slugify(event.target.value), { shouldValidate: true });
                }
              },
            })}
          />
        </Field>

        <Field label="Slug" htmlFor="slug" error={errors.slug?.message} hint="Used in the URL: /projects/your-slug">
          <Input id="slug" invalid={Boolean(errors.slug)} {...register("slug")} />
        </Field>

        <Field
          label="Short description"
          htmlFor="short_description"
          error={errors.short_description?.message}
          className="lg:col-span-2"
        >
          <Input id="short_description" maxLength={200} invalid={Boolean(errors.short_description)} {...register("short_description")} />
        </Field>

        <Field label="Long description" htmlFor="description" error={errors.description?.message} className="lg:col-span-2">
          <Textarea id="description" rows={5} {...register("description")} />
        </Field>

        <Field label="The problem" htmlFor="problem" error={errors.problem?.message}>
          <Textarea id="problem" rows={4} {...register("problem")} />
        </Field>
        <Field label="The solution" htmlFor="solution" error={errors.solution?.message}>
          <Textarea id="solution" rows={4} {...register("solution")} />
        </Field>
        <Field label="Results" htmlFor="results" error={errors.results?.message} className="lg:col-span-2">
          <Textarea id="results" rows={3} {...register("results")} />
        </Field>
      </section>

      <section className="grid gap-6 rounded-2xl border border-line bg-surface p-6 shadow-soft lg:grid-cols-3">
        <Field label="Role" htmlFor="role" error={errors.role?.message}>
          <Input id="role" placeholder="Lead Full-Stack Developer" {...register("role")} />
        </Field>
        <Field label="Timeline" htmlFor="timeline" error={errors.timeline?.message}>
          <Input id="timeline" placeholder="3 months" {...register("timeline")} />
        </Field>
        <Field label="Project type" htmlFor="project_type" error={errors.project_type?.message}>
          <Input id="project_type" placeholder="Web Application" {...register("project_type")} />
        </Field>
        <Field label="Live demo URL" htmlFor="live_url" error={errors.live_url?.message}>
          <Input id="live_url" type="url" placeholder="https://…" invalid={Boolean(errors.live_url)} {...register("live_url")} />
        </Field>
        <Field label="GitHub URL" htmlFor="github_url" error={errors.github_url?.message}>
          <Input id="github_url" type="url" placeholder="https://github.com/…" invalid={Boolean(errors.github_url)} {...register("github_url")} />
        </Field>
        <Field label="Sort order" htmlFor="sort_order" error={errors.sort_order?.message} hint="Lower numbers appear first">
          <Input id="sort_order" type="number" min={0} {...register("sort_order", { valueAsNumber: true })} />
        </Field>

        <Field
          label="Key features"
          htmlFor="key_features"
          error={errors.key_features?.message}
          hint="One feature per line"
          className="lg:col-span-3"
        >
          <Textarea id="key_features" rows={4} {...register("key_features")} />
        </Field>

        <div className="lg:col-span-3">
          <Controller
            control={control}
            name="technology_ids"
            render={({ field }) => (
              <TechnologyPicker
                technologies={technologies}
                selected={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </section>

      <section className="grid gap-6 rounded-2xl border border-line bg-surface p-6 shadow-soft lg:grid-cols-[1fr_280px]">
        <Controller
          control={control}
          name="cover_image"
          render={({ field }) => (
            <ImageUpload
              bucket="projects"
              folder={project ? `${project.id}/cover` : "covers"}
              label="Cover image"
              value={typeof field.value === "string" ? field.value : null}
              onChange={(url) => field.onChange(url ?? "")}
            />
          )}
        />
        <div className="space-y-4">
          <Checkbox label="Published" description="Visible on the public site" {...register("published")} />
          <Checkbox label="Featured" description="Show on the home page" {...register("featured")} />
        </div>
      </section>

      <FormFooter
        pending={pending}
        submitLabel={project ? "Save changes" : "Create project"}
        cancelHref="/admin/projects"
        status={status}
      />
    </form>
  );
}
