import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[color,background-color,box-shadow,transform] duration-200 focus-ring active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white shadow-soft hover:bg-accent-hover",
  secondary: "border border-line bg-surface text-heading shadow-soft hover:bg-wash",
  ghost: "text-body hover:bg-wash hover:text-heading",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type StyleProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

export function buttonClasses({ variant = "primary", size = "md", className }: StyleProps): string {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonAsButton = StyleProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
    external?: undefined;
  };

type ButtonAsLink = StyleProps & {
  href: string;
  external?: boolean;
  children: ReactNode;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant, size, className, ...props }: ButtonProps) {
  const classes = buttonClasses({ variant, size, className });

  if (props.href !== undefined) {
    const { href, external, children } = props;
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props;
  return <button type={type} className={classes} {...buttonProps} />;
}
