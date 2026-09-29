"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFooter } from "@/components/admin/form-footer";
import { ImageUpload } from "@/components/admin/image-upload";
import { useActionForm } from "@/components/admin/use-action-form";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/form";
import { createPost, updatePost } from "@/lib/actions/blog";
import { slugify } from "@/lib/utils/slugify";
import { blogPostSchema, type BlogPostInput, type BlogPostValues } from "@/lib/validations/blog";
import type { BlogPost } from "@/types";

function toDateInput(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function toFormValues(post?: BlogPost): BlogPostInput {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    cover_image: post?.cover_image ?? "",
    category: post?.category ?? "",
    author: post?.author ?? "",
    published: post?.published ?? false,
    published_at: toDateInput(post?.published_at),
  };
}

export function PostForm({ post }: { post?: BlogPost }) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BlogPostInput, unknown, BlogPostValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: toFormValues(post),
  });

  const { pending, status, submit } = useActionForm<BlogPostInput>(setError);

  const onSubmit = handleSubmit((values) => {
    if (post) {
      submit(() => updatePost(post.id, values), { successMessage: "Post saved." });
    } else {
      submit(() => createPost(values), {
        redirectTo: (data) => (data ? `/admin/blog/${data.id}/edit` : "/admin/blog"),
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
                if (!getValues("slug")) {
                  setValue("slug", slugify(event.target.value), { shouldValidate: true });
                }
              },
            })}
          />
        </Field>
        <Field label="Slug" htmlFor="slug" error={errors.slug?.message} hint="Used in the URL: /blog/your-slug">
          <Input id="slug" invalid={Boolean(errors.slug)} {...register("slug")} />
        </Field>

        <Field label="Excerpt" htmlFor="excerpt" error={errors.excerpt?.message} className="lg:col-span-2">
          <Textarea id="excerpt" rows={2} maxLength={300} invalid={Boolean(errors.excerpt)} {...register("excerpt")} />
        </Field>

        <Field
          label="Content"
          htmlFor="content"
          error={errors.content?.message}
          hint="Plain text or light Markdown: ## headings, - lists, **bold**, `code`"
          className="lg:col-span-2"
        >
          <Textarea id="content" rows={18} className="font-mono text-[13px]" invalid={Boolean(errors.content)} {...register("content")} />
        </Field>
      </section>

      <section className="grid gap-6 rounded-2xl border border-line bg-surface p-6 shadow-soft lg:grid-cols-[1fr_320px]">
        <Controller
          control={control}
          name="cover_image"
          render={({ field }) => (
            <ImageUpload
              bucket="blog"
              folder={post ? post.id : "covers"}
              label="Cover image"
              value={typeof field.value === "string" ? field.value : null}
              onChange={(url) => field.onChange(url ?? "")}
            />
          )}
        />
        <div className="space-y-5">
          <Field label="Category" htmlFor="category" error={errors.category?.message}>
            <Input id="category" placeholder="Performance" {...register("category")} />
          </Field>
          <Field label="Author" htmlFor="author" error={errors.author?.message}>
            <Input id="author" placeholder="Your name" {...register("author")} />
          </Field>
          <Field
            label="Publish date"
            htmlFor="published_at"
            error={errors.published_at?.message}
            hint="Leave empty to use the date you first publish"
          >
            <Input id="published_at" type="date" {...register("published_at")} />
          </Field>
          <Checkbox label="Published" description="Visible on the public blog" {...register("published")} />
        </div>
      </section>

      <FormFooter
        pending={pending}
        submitLabel={post ? "Save changes" : "Create post"}
        cancelHref="/admin/blog"
        status={status}
      />
    </form>
  );
}
