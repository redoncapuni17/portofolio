import type { Metadata } from "next";
import { CallToAction } from "@/components/home/cta";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { TechStack } from "@/components/home/tech-stack";
import { getFeaturedProjects } from "@/lib/queries/projects";
import { getSiteSettings } from "@/lib/queries/settings";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.seo_title || `${settings.developer_name} — ${settings.hero_title}`,
    description: settings.seo_description,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [settings, featured] = await Promise.all([getSiteSettings(), getFeaturedProjects()]);

  return (
    <>
      <Hero settings={settings} />
      <TechStack />
      <Stats settings={settings} />
      <FeaturedProjects projects={featured} />
      <CallToAction />
    </>
  );
}
