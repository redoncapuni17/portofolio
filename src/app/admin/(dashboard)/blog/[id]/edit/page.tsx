import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PostForm } from "@/components/admin/blog/post-form";
import { PageHeader } from "@/components/admin/page-header";
import { buttonClasses } from "@/components/ui/button";
import { getPostByIdAdmin } from "@/lib/queries/blog";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: PageProps<"/admin/blog/[id]/edit">) {
  const { id } = await params;
  const post = await getPostByIdAdmin(id);
  if (!post) notFound();

  return (
    <>
      <PageHeader
        title={post.title}
        description={post.published ? "Published" : "Draft — not visible on the public site"}
        actions={
          post.published ? (
            <Link href={`/blog/${post.slug}`} target="_blank" className={buttonClasses({ variant: "secondary", size: "sm" })}>
              <ExternalLink className="size-4" aria-hidden />
              View live
            </Link>
          ) : null
        }
      />
      <PostForm post={post} />
    </>
  );
}
