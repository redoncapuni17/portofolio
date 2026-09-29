import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FormPanel } from "@/components/admin/form-panel";
import { PageHeader } from "@/components/admin/page-header";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { RowActions } from "@/components/admin/row-actions";
import { Table, TableEmpty, TBody, TD, TH, THead, TR } from "@/components/admin/table";
import { TestimonialForm } from "@/components/admin/testimonials/testimonial-form";
import { Avatar } from "@/components/ui/avatar";
import { buttonClasses } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { deleteTestimonial, setTestimonialPublished } from "@/lib/actions/content";
import { getAllTestimonialsAdmin } from "@/lib/queries/content";
import { truncate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage({ searchParams }: PageProps<"/admin/testimonials">) {
  const [{ new: isNew, edit }, testimonials] = await Promise.all([searchParams, getAllTestimonialsAdmin()]);
  const editing = typeof edit === "string" ? testimonials.find((item) => item.id === edit) : undefined;
  const showForm = isNew !== undefined || editing !== undefined;

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Client quotes shown on the Testimonials page."
        actions={
          <Link href="/admin/testimonials?new=1" className={buttonClasses({ size: "sm" })}>
            <Plus className="size-4" aria-hidden />
            Add testimonial
          </Link>
        }
      />

      {showForm ? (
        <FormPanel title={editing ? `Edit “${editing.name}”` : "New testimonial"} closeHref="/admin/testimonials">
          <TestimonialForm key={editing?.id ?? "new"} testimonial={editing} />
        </FormPanel>
      ) : null}

      <Table>
        <THead>
          <TR>
            <TH>Client</TH>
            <TH>Quote</TH>
            <TH>Rating</TH>
            <TH>Published</TH>
            <TH className="text-right">Actions</TH>
          </TR>
        </THead>
        <TBody>
          {testimonials.length === 0 ? (
            <TableEmpty colSpan={5}>No testimonials yet.</TableEmpty>
          ) : (
            testimonials.map((item) => (
              <TR key={item.id}>
                <TD>
                  <div className="flex items-center gap-3">
                    <Avatar src={item.image_url} name={item.name} size={36} />
                    <div>
                      <span className="font-medium text-heading">{item.name}</span>
                      <p className="text-xs text-muted">{[item.position, item.company].filter(Boolean).join(", ")}</p>
                    </div>
                  </div>
                </TD>
                <TD className="max-w-xs">{truncate(item.quote, 90)}</TD>
                <TD>
                  <StarRating value={item.rating} />
                </TD>
                <TD>
                  <PublishToggle published={item.published} onToggle={setTestimonialPublished.bind(null, item.id)} />
                </TD>
                <TD>
                  <RowActions editHref={`/admin/testimonials?edit=${item.id}`} onDelete={deleteTestimonial.bind(null, item.id)} name={item.name} />
                </TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>
    </>
  );
}
