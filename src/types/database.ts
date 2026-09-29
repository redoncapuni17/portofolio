/**
 * Hand-maintained Supabase database types.
 * Keep in sync with supabase/migrations/*.sql.
 * (You can regenerate with `supabase gen types typescript` once the CLI is set up.)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Timestamps = {
  created_at: string;
  updated_at: string;
};

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/* ---------- Row shapes ---------- */

export type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin";
  avatar_url: string | null;
} & Timestamps;

export type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string | null;
  problem: string | null;
  solution: string | null;
  results: string | null;
  role: string | null;
  timeline: string | null;
  project_type: string | null;
  live_url: string | null;
  github_url: string | null;
  cover_image: string | null;
  key_features: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
} & Timestamps;

export type ProjectImageRow = {
  id: string;
  project_id: string;
  image_url: string;
  image_type: "screenshot" | "cover" | "other";
  caption: string | null;
  sort_order: number;
  created_at: string;
};

export type TechnologyRow = {
  id: string;
  name: string;
  icon: string | null;
  created_at: string;
};

export type ProjectTechnologyRow = {
  id: string;
  project_id: string;
  technology_id: string;
};

export type SkillCategory = "frontend" | "backend" | "tools";

export type SkillRow = {
  id: string;
  name: string;
  category: SkillCategory;
  icon: string | null;
  description: string | null;
  sort_order: number;
  published: boolean;
} & Timestamps;

export type ExperienceType = "work" | "education";

export type ExperienceRow = {
  id: string;
  position: string;
  company: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  currently_working: boolean;
  description: string | null;
  type: ExperienceType;
  sort_order: number;
  published: boolean;
} & Timestamps;

export type ServiceRow = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  technologies: string[];
  sort_order: number;
  published: boolean;
} & Timestamps;

export type TestimonialRow = {
  id: string;
  name: string;
  position: string | null;
  company: string | null;
  quote: string;
  image_url: string | null;
  rating: number;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string | null;
  author: string | null;
  published: boolean;
  published_at: string | null;
} & Timestamps;

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

export type SiteSettingRow = {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
};

/* ---------- Table definitions ---------- */

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        ProfileRow,
        WithOptional<ProfileRow, "full_name" | "role" | "avatar_url" | "created_at" | "updated_at">
      >;
      projects: Table<
        ProjectRow,
        WithOptional<
          ProjectRow,
          | "id"
          | "description"
          | "problem"
          | "solution"
          | "results"
          | "role"
          | "timeline"
          | "project_type"
          | "live_url"
          | "github_url"
          | "cover_image"
          | "key_features"
          | "featured"
          | "published"
          | "sort_order"
          | "created_at"
          | "updated_at"
        >
      >;
      project_images: Table<
        ProjectImageRow,
        WithOptional<ProjectImageRow, "id" | "image_type" | "caption" | "sort_order" | "created_at">
      >;
      technologies: Table<TechnologyRow, WithOptional<TechnologyRow, "id" | "icon" | "created_at">>;
      project_technologies: Table<ProjectTechnologyRow, WithOptional<ProjectTechnologyRow, "id">>;
      skills: Table<
        SkillRow,
        WithOptional<
          SkillRow,
          "id" | "icon" | "description" | "sort_order" | "published" | "created_at" | "updated_at"
        >
      >;
      experience: Table<
        ExperienceRow,
        WithOptional<
          ExperienceRow,
          | "id"
          | "location"
          | "end_date"
          | "currently_working"
          | "description"
          | "sort_order"
          | "published"
          | "created_at"
          | "updated_at"
        >
      >;
      services: Table<
        ServiceRow,
        WithOptional<
          ServiceRow,
          "id" | "icon" | "technologies" | "sort_order" | "published" | "created_at" | "updated_at"
        >
      >;
      testimonials: Table<
        TestimonialRow,
        WithOptional<
          TestimonialRow,
          "id" | "position" | "company" | "image_url" | "rating" | "sort_order" | "published" | "created_at"
        >
      >;
      blog_posts: Table<
        BlogPostRow,
        WithOptional<
          BlogPostRow,
          | "id"
          | "cover_image"
          | "category"
          | "author"
          | "published"
          | "published_at"
          | "created_at"
          | "updated_at"
        >
      >;
      contact_messages: Table<
        ContactMessageRow,
        WithOptional<ContactMessageRow, "id" | "read" | "created_at">
      >;
      site_settings: Table<SiteSettingRow, WithOptional<SiteSettingRow, "id" | "value" | "updated_at">>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      skill_category: SkillCategory;
      experience_type: ExperienceType;
      project_image_type: ProjectImageRow["image_type"];
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
