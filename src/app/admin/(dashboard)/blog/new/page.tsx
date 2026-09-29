import type { Metadata } from "next";
import { PostForm } from "@/components/admin/blog/post-form";
import { PageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = { title: "New post" };

export default function NewPostPage() {
  return (
    <>
      <PageHeader title="New post" description="Draft an article. Publish it when it is ready." />
      <PostForm />
    </>
  );
}
