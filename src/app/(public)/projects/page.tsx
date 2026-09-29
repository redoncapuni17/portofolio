import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/project-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublishedProjects } from "@/lib/queries/projects";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects",
  description: "A selection of web applications, APIs and mobile apps I have designed, built and shipped.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <section className="container-page py-20">
      <SectionHeading
        as="h1"
        eyebrow="Selected work"
        title="Projects"
        description="A selection of products I have designed, built and shipped — from marketing sites to production APIs."
      />
      <div className="mt-12">
        <ProjectGrid projects={projects} />
      </div>
    </section>
  );
}
