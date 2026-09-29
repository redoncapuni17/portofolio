import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import type { ContactMessage, Experience, Service, Skill, Testimonial } from "@/types";
import type { SkillCategory } from "@/types/database";
import { safeQuery } from "./_helpers";

/* =========================== Public (anon, cookie-less) =========================== */

export async function getPublishedSkills(): Promise<Skill[]> {
  const supabase = createPublicClient();
  return safeQuery(
    "skills.published",
    () =>
      supabase
        .from("skills")
        .select("*")
        .eq("published", true)
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true }),
    [],
  );
}

export function groupSkillsByCategory(skills: Skill[]): Record<SkillCategory, Skill[]> {
  const groups: Record<SkillCategory, Skill[]> = { frontend: [], backend: [], tools: [] };
  for (const skill of skills) groups[skill.category].push(skill);
  return groups;
}

export async function getPublishedExperience(): Promise<Experience[]> {
  const supabase = createPublicClient();
  return safeQuery(
    "experience.published",
    () =>
      supabase
        .from("experience")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("start_date", { ascending: false }),
    [],
  );
}

export async function getPublishedServices(): Promise<Service[]> {
  const supabase = createPublicClient();
  return safeQuery(
    "services.published",
    () =>
      supabase
        .from("services")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true }),
    [],
  );
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const supabase = createPublicClient();
  return safeQuery(
    "testimonials.published",
    () =>
      supabase
        .from("testimonials")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true }),
    [],
  );
}

/* =========================== Admin (cookie-bound session) =========================== */

export async function getAllSkillsAdmin(): Promise<Skill[]> {
  const supabase = await createClient();
  return safeQuery(
    "skills.admin",
    () =>
      supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true }),
    [],
  );
}

export async function getAllExperienceAdmin(): Promise<Experience[]> {
  const supabase = await createClient();
  return safeQuery(
    "experience.admin",
    () =>
      supabase
        .from("experience")
        .select("*")
        .order("type", { ascending: true })
        .order("sort_order", { ascending: true })
        .order("start_date", { ascending: false }),
    [],
  );
}

export async function getAllServicesAdmin(): Promise<Service[]> {
  const supabase = await createClient();
  return safeQuery(
    "services.admin",
    () => supabase.from("services").select("*").order("sort_order", { ascending: true }),
    [],
  );
}

export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  const supabase = await createClient();
  return safeQuery(
    "testimonials.admin",
    () => supabase.from("testimonials").select("*").order("sort_order", { ascending: true }),
    [],
  );
}

export async function getContactMessagesAdmin(): Promise<ContactMessage[]> {
  const supabase = await createClient();
  return safeQuery(
    "contact_messages.admin",
    () => supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    [],
  );
}

export async function getUnreadMessageCount(): Promise<number> {
  const supabase = await createClient();
  try {
    const { count, error } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("read", false);
    if (error) throw error;
    return count ?? 0;
  } catch (error) {
    console.error("[queries] contact_messages.unread:", error);
    return 0;
  }
}

export type DashboardStats = {
  projects: number;
  publishedProjects: number;
  posts: number;
  publishedPosts: number;
  testimonials: number;
  unreadMessages: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const count = async (
    table: "projects" | "blog_posts" | "testimonials",
    published?: boolean,
  ): Promise<number> => {
    try {
      let query = supabase.from(table).select("id", { count: "exact", head: true });
      if (published !== undefined) query = query.eq("published", published);
      const { count: total, error } = await query;
      if (error) throw error;
      return total ?? 0;
    } catch (error) {
      console.error(`[queries] count:${table}`, error);
      return 0;
    }
  };

  const [projects, publishedProjects, posts, publishedPosts, testimonials, unreadMessages] =
    await Promise.all([
      count("projects"),
      count("projects", true),
      count("blog_posts"),
      count("blog_posts", true),
      count("testimonials"),
      getUnreadMessageCount(),
    ]);

  return { projects, publishedProjects, posts, publishedPosts, testimonials, unreadMessages };
}
