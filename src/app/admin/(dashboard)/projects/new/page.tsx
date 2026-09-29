import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/projects/project-form";
import { getTechnologies } from "@/lib/queries/projects";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  const technologies = await getTechnologies();

  return (
    <>
      <PageHeader
        title="New project"
        description="Fill in the details below. You can add screenshots after the project is created."
      />
      <ProjectForm technologies={technologies} />
    </>
  );
}
