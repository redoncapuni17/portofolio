import type {
  BlogPostRow,
  ContactMessageRow,
  ExperienceRow,
  ProfileRow,
  ProjectImageRow,
  ProjectRow,
  ServiceRow,
  SiteSettingRow,
  SkillRow,
  TechnologyRow,
  TestimonialRow,
} from "./database";

export type Profile = ProfileRow;
export type Project = ProjectRow;
export type ProjectImage = ProjectImageRow;
export type Technology = TechnologyRow;
export type Skill = SkillRow;
export type Experience = ExperienceRow;
export type Service = ServiceRow;
export type Testimonial = TestimonialRow;
export type BlogPost = BlogPostRow;
export type ContactMessage = ContactMessageRow;
export type SiteSetting = SiteSettingRow;

/** Project with its related technologies (joined through project_technologies). */
export type ProjectWithTech = Project & {
  technologies: Technology[];
};

/** Full project detail for the public detail page. */
export type ProjectDetail = ProjectWithTech & {
  images: ProjectImage[];
};

export type SiteSettingsKey =
  | "developer_name"
  | "hero_title"
  | "hero_description"
  | "email"
  | "github_url"
  | "linkedin_url"
  | "location"
  | "availability"
  | "profile_image"
  | "seo_title"
  | "seo_description"
  | "years_experience"
  | "projects_completed";

export type SiteSettings = Record<SiteSettingsKey, string>;

/** Generic result returned from server actions consumed by client forms. */
export type ActionFailure = { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export type ActionResult<T = undefined> = { ok: true; data?: T; message?: string } | ActionFailure;
