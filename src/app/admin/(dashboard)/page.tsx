import Link from "next/link";
import { ArrowRight, FileText, FolderKanban, Mail, MessageSquareQuote } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getContactMessagesAdmin, getDashboardStats } from "@/lib/queries/content";
import { formatDate, truncate } from "@/lib/utils/format";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const [stats, messages] = await Promise.all([getDashboardStats(), getContactMessagesAdmin()]);
  const recent = messages.slice(0, 5);

  const cards = [
    {
      label: "Projects",
      value: stats.projects,
      hint: `${stats.publishedProjects} published`,
      href: "/admin/projects",
      Icon: FolderKanban,
    },
    {
      label: "Blog posts",
      value: stats.posts,
      hint: `${stats.publishedPosts} published`,
      href: "/admin/blog",
      Icon: FileText,
    },
    {
      label: "Testimonials",
      value: stats.testimonials,
      hint: "client quotes",
      href: "/admin/testimonials",
      Icon: MessageSquareQuote,
    },
    {
      label: "Unread messages",
      value: stats.unreadMessages,
      hint: `${messages.length} total`,
      href: "/admin/messages",
      Icon: Mail,
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Signed in as ${session.email}. Here is what is happening on your site.`}
        actions={
          <>
            <Link href="/admin/projects/new" className={buttonClasses({ size: "sm" })}>
              New project
            </Link>
            <Link href="/admin/blog/new" className={buttonClasses({ size: "sm", variant: "secondary" })}>
              New post
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, hint, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-2xl border border-line bg-surface p-5 shadow-soft transition-shadow hover:shadow-card focus-ring"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-body">{label}</span>
              <Icon className="size-4 text-muted group-hover:text-accent" aria-hidden />
            </div>
            <p className="mt-3 text-3xl font-semibold text-heading">{value}</p>
            <p className="mt-1 text-xs text-muted">{hint}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10" aria-labelledby="recent-messages">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="recent-messages" className="text-lg font-semibold">
            Recent messages
          </h2>
          <Link
            href="/admin/messages"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover focus-ring rounded"
          >
            View all
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface/60 p-10 text-center text-sm text-muted">
            No messages yet.
          </div>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
            {recent.map((message) => (
              <li key={message.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-heading">{message.name}</p>
                    {!message.read ? <Badge tone="accent">New</Badge> : null}
                  </div>
                  <p className="truncate text-xs text-muted">{message.email}</p>
                  <p className="mt-1 text-sm text-body">{truncate(message.message, 120)}</p>
                </div>
                <time className="shrink-0 text-xs text-muted" dateTime={message.created_at}>
                  {formatDate(message.created_at)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
