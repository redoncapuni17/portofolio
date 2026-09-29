import type { Metadata } from "next";
import { PostCard } from "@/components/blog/post-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublishedPosts } from "@/lib/queries/blog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on web performance, architecture and the craft of building software.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="container-page py-20">
      <SectionHeading
        as="h1"
        eyebrow="Writing"
        title="Blog"
        description="Notes on web performance, architecture and the craft of building software."
      />
      <div className="mt-12">
        {posts.length === 0 ? (
          <EmptyState title="No articles yet" description="Published posts will appear here." />
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
