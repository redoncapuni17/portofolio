import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ExperienceForm } from "@/components/admin/experience/experience-form";
import { FormPanel } from "@/components/admin/form-panel";
import { PageHeader } from "@/components/admin/page-header";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { RowActions } from "@/components/admin/row-actions";
import { Table, TableEmpty, TBody, TD, TH, THead, TR } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { deleteExperience, setExperiencePublished } from "@/lib/actions/content";
import { getAllExperienceAdmin } from "@/lib/queries/content";
import { formatDateRange } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Experience" };

export default async function AdminExperiencePage({ searchParams }: PageProps<"/admin/experience">) {
  const [{ new: isNew, edit }, items] = await Promise.all([searchParams, getAllExperienceAdmin()]);
  const editing = typeof edit === "string" ? items.find((item) => item.id === edit) : undefined;
  const showForm = isNew !== undefined || editing !== undefined;

  return (
    <>
      <PageHeader
        title="Experience & Education"
        description="Timeline entries shown on the About page."
        actions={
          <Link href="/admin/experience?new=1" className={buttonClasses({ size: "sm" })}>
            <Plus className="size-4" aria-hidden />
            Add entry
          </Link>
        }
      />

      {showForm ? (
        <FormPanel title={editing ? `Edit “${editing.position}”` : "New entry"} closeHref="/admin/experience">
          <ExperienceForm key={editing?.id ?? "new"} item={editing} />
        </FormPanel>
      ) : null}

      <Table>
        <THead>
          <TR>
            <TH>Position</TH>
            <TH>Type</TH>
            <TH>Period</TH>
            <TH>Published</TH>
            <TH className="text-right">Actions</TH>
          </TR>
        </THead>
        <TBody>
          {items.length === 0 ? (
            <TableEmpty colSpan={5}>No entries yet.</TableEmpty>
          ) : (
            items.map((item) => (
              <TR key={item.id}>
                <TD>
                  <span className="font-medium text-heading">{item.position}</span>
                  <p className="text-xs text-muted">
                    {item.company}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                </TD>
                <TD>
                  <Badge tone={item.type === "work" ? "accent" : "neutral"}>{item.type}</Badge>
                </TD>
                <TD className="whitespace-nowrap">{formatDateRange(item.start_date, item.end_date, item.currently_working)}</TD>
                <TD>
                  <PublishToggle published={item.published} onToggle={setExperiencePublished.bind(null, item.id)} />
                </TD>
                <TD>
                  <RowActions editHref={`/admin/experience?edit=${item.id}`} onDelete={deleteExperience.bind(null, item.id)} name={item.position} />
                </TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>
    </>
  );
}
