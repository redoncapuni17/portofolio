import type { Metadata } from "next";
import { MessageCard } from "@/components/admin/messages/message-card";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getContactMessagesAdmin } from "@/lib/queries/content";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const messages = await getContactMessagesAdmin();
  const unread = messages.filter((message) => !message.read).length;

  return (
    <>
      <PageHeader
        title="Messages"
        description={
          messages.length === 0
            ? "Messages sent through the contact form appear here."
            : `${messages.length} message${messages.length === 1 ? "" : "s"} · ${unread} unread`
        }
      />

      {messages.length === 0 ? (
        <EmptyState title="Inbox is empty" description="New contact form submissions will show up here." />
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      )}
    </>
  );
}
