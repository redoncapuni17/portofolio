import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FormPanel } from "@/components/admin/form-panel";
import { PageHeader } from "@/components/admin/page-header";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { RowActions } from "@/components/admin/row-actions";
import { SkillForm } from "@/components/admin/skills/skill-form";
import { Table, TableEmpty, TBody, TD, TH, THead, TR } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { deleteSkill, setSkillPublished } from "@/lib/actions/content";
import { getAllSkillsAdmin } from "@/lib/queries/content";

export const metadata: Metadata = { title: "Skills" };

export default async function AdminSkillsPage({ searchParams }: PageProps<"/admin/skills">) {
  const [{ new: isNew, edit }, skills] = await Promise.all([searchParams, getAllSkillsAdmin()]);
  const editing = typeof edit === "string" ? skills.find((skill) => skill.id === edit) : undefined;
  const showForm = isNew !== undefined || editing !== undefined;

  return (
    <>
      <PageHeader
        title="Skills"
        description="Grouped into Frontend, Backend and Tools on the About page."
        actions={
          <Link href="/admin/skills?new=1" className={buttonClasses({ size: "sm" })}>
            <Plus className="size-4" aria-hidden />
            Add skill
          </Link>
        }
      />

      {showForm ? (
        <FormPanel title={editing ? `Edit “${editing.name}”` : "New skill"} closeHref="/admin/skills">
          <SkillForm key={editing?.id ?? "new"} skill={editing} />
        </FormPanel>
      ) : null}

      <Table>
        <THead>
          <TR>
            <TH>Skill</TH>
            <TH>Category</TH>
            <TH>Order</TH>
            <TH>Published</TH>
            <TH className="text-right">Actions</TH>
          </TR>
        </THead>
        <TBody>
          {skills.length === 0 ? (
            <TableEmpty colSpan={5}>No skills yet.</TableEmpty>
          ) : (
            skills.map((skill) => (
              <TR key={skill.id}>
                <TD>
                  <div className="flex items-center gap-2.5">
                    <Icon name={skill.icon} className="size-4 text-accent" />
                    <span className="font-medium text-heading">{skill.name}</span>
                  </div>
                </TD>
                <TD>
                  <Badge>{skill.category}</Badge>
                </TD>
                <TD>{skill.sort_order}</TD>
                <TD>
                  <PublishToggle published={skill.published} onToggle={setSkillPublished.bind(null, skill.id)} />
                </TD>
                <TD>
                  <RowActions editHref={`/admin/skills?edit=${skill.id}`} onDelete={deleteSkill.bind(null, skill.id)} name={skill.name} />
                </TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>
    </>
  );
}
