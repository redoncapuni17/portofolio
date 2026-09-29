import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PostPublishToggle, PostRowActions } from "@/components/admin/blog/post-row-actions";
import { PageHeader } from "@/components/admin/page-header";
import { Table, TableEmpty, TBody, TD, TH, THead, TR } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { getAllPostsAdmin } from "@/lib/queries/blog";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  const posts = await getAllPostsAdmin();

  return (
    <>
      <PageHeader
        title="Blog"
        description={`${posts.length} post${posts.length === 1 ? "" : "s"}`}
        actions={
          <Link href="/admin/blog/new" className={buttonClasses({ size: "sm" })}>
            <Plus className="size-4" aria-hidden />
            New post
          </Link>
        }
      />

      <Table>
        <THead>
          <TR>
            <TH>Post</TH>
            <TH>Category</TH>
            <TH>Published on</TH>
            <TH>Published</TH>
            <TH className="text-right">Actions</TH>
          </TR>
        </THead>
        <TBody>
          {posts.length === 0 ? (
            <TableEmpty colSpan={5}>No posts yet. Write your first article.</TableEmpty>
          ) : (
            posts.map((post) => (
              <TR key={post.id}>
                <TD>
                  <span className="font-medium text-heading">{post.title}</span>
                  <p className="text-xs text-muted">/blog/{post.slug}</p>
                </TD>
                <TD>{post.category ? <Badge>{post.category}</Badge> : <span className="text-muted">—</span>}</TD>
                <TD className="whitespace-nowrap">{formatDate(post.published_at) || <span className="text-muted">—</span>}</TD>
                <TD>
                  <PostPublishToggle id={post.id} published={post.published} />
                </TD>
                <TD>
                  <PostRowActions id={post.id} title={post.title} />
                </TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>
    </>
  );
}
