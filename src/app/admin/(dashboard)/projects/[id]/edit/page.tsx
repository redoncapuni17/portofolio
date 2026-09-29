import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/projects/project-form";
import { ScreenshotsManager } from "@/components/admin/projects/screenshots-manager";
import { buttonClasses } from "@/components/ui/button";
import { getProjectByIdAdmin, getTechnologies } from "@/lib/queries/projects";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]/edit">) {
  const { id } = await params;
  const [project, technologies] = await Promise.all([getProjectByIdAdmin(id), getTechnologies()]);
  if (!project) notFound();

  return (
    <>
      <PageHeader
        title={project.title}
        description={project.published ? "Published" : "Draft — not visible on the public site"}
        actions={
          project.published ? (
            <Link
              href={`/projects/${project.slug}`}
              target="_blank"
              className={buttonClasses({ variant: "secondary", size: "sm" })}
            >
              <ExternalLink className="size-4" aria-hidden />
              View live
            </Link>
          ) : null
        }
      />
      <div className="space-y-8">
        <ProjectForm project={project} technologies={technologies} />
        <ScreenshotsManager projectId={project.id} images={project.images} />
      </div>
    </>
  );
}
