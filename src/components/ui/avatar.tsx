import Image from "next/image";
import { cn } from "@/lib/utils/cn";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  src,
  name,
  size = 48,
  className,
  priority,
}: {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  const dimension = { width: size, height: size };

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        {...dimension}
        priority={priority}
        className={cn("rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "flex items-center justify-center rounded-full bg-accent-soft font-semibold text-accent",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.max(12, size * 0.36) }}
    >
      {initials(name) || "?"}
    </div>
  );
}
