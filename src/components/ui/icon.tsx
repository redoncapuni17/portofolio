import {
  Atom,
  Boxes,
  Braces,
  Cloud,
  Code2,
  Container,
  Database,
  FileCode2,
  GitBranch,
  Globe,
  Layers,
  Layout,
  Lightbulb,
  type LucideIcon,
  type LucideProps,
  Palette,
  Rocket,
  Server,
  Smartphone,
  Sparkles,
  Terminal,
  Triangle,
  Users,
  Wind,
  Workflow,
  Zap,
} from "lucide-react";
import { FigmaIcon } from "./brand-icons";

/**
 * Icon names stored in the database map to lucide icons here.
 * Add new keys as needed; unknown names fall back to a generic code icon.
 */
type IconComponent = LucideIcon | typeof FigmaIcon;

const registry: Record<string, IconComponent> = {
  react: Atom,
  nextjs: Triangle,
  typescript: Braces,
  javascript: FileCode2,
  nodejs: Server,
  python: Terminal,
  fastapi: Zap,
  django: Layers,
  postgresql: Database,
  sql: Database,
  redis: Boxes,
  docker: Container,
  tailwind: Wind,
  supabase: Database,
  vercel: Triangle,
  aws: Cloud,
  git: GitBranch,
  figma: FigmaIcon,
  graphql: Workflow,
  stripe: Layers,
  "react-native": Smartphone,
  expo: Smartphone,
  globe: Globe,
  server: Server,
  smartphone: Smartphone,
  layout: Layout,
  palette: Palette,
  rocket: Rocket,
  lightbulb: Lightbulb,
  users: Users,
  sparkles: Sparkles,
  code: Code2,
};

type IconProps = Omit<LucideProps, "name" | "ref"> & { name: string | null | undefined };

export function Icon({ name, ...props }: IconProps) {
  const Component = (name && registry[name.toLowerCase()]) || Code2;
  return <Component aria-hidden {...props} />;
}

export const iconNames = Object.keys(registry);
