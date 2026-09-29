import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectPublishToggle, ProjectRowActions } from "@/components/admin/projects/project-row-actions";
import { Table, TableEmpty, TBody, TD, TH, THead, TR } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { getAllProjectsAdmin } from "@/lib/queries/projects";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <>
      <PageHeader
        title="Projects"
        description={`${projects.length} project${projects.length === 1 ? "" : "s"}`}
        actions={
          <Link href="/admin/projects/new" className={buttonClasses({ size: "sm" })}>
            <Plus className="size-4" aria-hidden />
            New project
          </Link>
        }
      />

      <Table>
        <THead>
          <TR>
            <TH>Project</TH>
            <TH>Technologies</TH>
            <TH>Updated</TH>
            <TH>Published</TH>
            <TH className="text-right">Actions</TH>
          </TR>
        </THead>
        <TBody>
          {projects.length === 0 ? (
            <TableEmpty colSpan={5}>No projects yet. Create your first one.</TableEmpty>
          ) : (
            projects.map((project) => (
              <TR key={project.id}>
                <TD>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-heading">{project.title}</span>
                    {project.featured ? <Badge tone="accent">Featured</Badge> : null}
                  </div>
                  <p className="text-xs text-muted">/projects/{project.slug}</p>
                </TD>
                <TD>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <Badge key={tech.id}>{tech.name}</Badge>
                    ))}
                    {project.technologies.length > 4 ? (
                      <Badge>+{project.technologies.length - 4}</Badge>
                    ) : null}
                  </div>
                </TD>
                <TD className="whitespace-nowrap">{formatDate(project.updated_at)}</TD>
                <TD>
                  <ProjectPublishToggle id={project.id} published={project.published} />
                </TD>
                <TD>
                  <ProjectRowActions id={project.id} title={project.title} />
                </TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>
    </>
  );
}
