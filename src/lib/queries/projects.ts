import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import type { Project, ProjectDetail, ProjectWithTech, Technology } from "@/types";
import { safeQuery } from "./_helpers";

type ProjectTechJoin = {
  technology: Technology | null;
};

type ProjectRowWithJoin = Project & { project_technologies: ProjectTechJoin[] };

function flattenTechnologies(row: ProjectRowWithJoin): ProjectWithTech {
  const { project_technologies, ...project } = row;
  const technologies = project_technologies
    .map((join) => join.technology)
    .filter((tech): tech is Technology => tech !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
  return { ...project, technologies };
}

const PROJECT_WITH_TECH = "*, project_technologies(technology:technologies(*))";

/* ---------------- Public (anon, cookie-less) ---------------- */

export async function getPublishedProjects(): Promise<ProjectWithTech[]> {
  const supabase = createPublicClient();
  const rows = await safeQuery<ProjectRowWithJoin[]>(
    "projects.published",
    () =>
      supabase
        .from("projects")
        .select(PROJECT_WITH_TECH)
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .returns<ProjectRowWithJoin[]>(),
    [],
  );
  return rows.map(flattenTechnologies);
}

export async function getFeaturedProjects(limit = 3): Promise<ProjectWithTech[]> {
  const supabase = createPublicClient();
  const rows = await safeQuery<ProjectRowWithJoin[]>(
    "projects.featured",
    () =>
      supabase
        .from("projects")
        .select(PROJECT_WITH_TECH)
        .eq("published", true)
        .eq("featured", true)
        .order("sort_order", { ascending: true })
        .limit(limit)
        .returns<ProjectRowWithJoin[]>(),
    [],
  );
  return rows.map(flattenTechnologies);
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const supabase = createPublicClient();
  const row = await safeQuery<ProjectRowWithJoin | null>(
    `projects.slug:${slug}`,
    () =>
      supabase
        .from("projects")
        .select(PROJECT_WITH_TECH)
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle<ProjectRowWithJoin>(),
    null,
  );
  if (!row) return null;

  const images = await safeQuery(
    `project_images:${row.id}`,
    () =>
      supabase
        .from("project_images")
        .select("*")
        .eq("project_id", row.id)
        .order("sort_order", { ascending: true }),
    [],
  );

  return { ...flattenTechnologies(row), images };
}

export async function getPublishedProjectSlugs(): Promise<Pick<Project, "slug" | "updated_at">[]> {
  const supabase = createPublicClient();
  return safeQuery(
    "projects.slugs",
    () => supabase.from("projects").select("slug, updated_at").eq("published", true),
    [],
  );
}

export async function getTechnologies(): Promise<Technology[]> {
  const supabase = createPublicClient();
  return safeQuery(
    "technologies",
    () => supabase.from("technologies").select("*").order("name", { ascending: true }),
    [],
  );
}

/* ---------------- Admin (cookie-bound session; RLS grants admins full access) ---------------- */

export async function getAllProjectsAdmin(): Promise<ProjectWithTech[]> {
  const supabase = await createClient();
  const rows = await safeQuery<ProjectRowWithJoin[]>(
    "projects.admin.all",
    () =>
      supabase
        .from("projects")
        .select(PROJECT_WITH_TECH)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .returns<ProjectRowWithJoin[]>(),
    [],
  );
  return rows.map(flattenTechnologies);
}

export async function getProjectByIdAdmin(id: string): Promise<ProjectDetail | null> {
  const supabase = await createClient();
  const row = await safeQuery<ProjectRowWithJoin | null>(
    `projects.admin:${id}`,
    () =>
      supabase
        .from("projects")
        .select(PROJECT_WITH_TECH)
        .eq("id", id)
        .maybeSingle<ProjectRowWithJoin>(),
    null,
  );
  if (!row) return null;

  const images = await safeQuery(
    `project_images.admin:${id}`,
    () =>
      supabase
        .from("project_images")
        .select("*")
        .eq("project_id", id)
        .order("sort_order", { ascending: true }),
    [],
  );

  return { ...flattenTechnologies(row), images };
}
