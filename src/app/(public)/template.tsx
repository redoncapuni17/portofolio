"use client";

import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    const y = window.scrollY;
    window.scrollTo(0, y + 1);
    window.scrollTo(0, y);
    root.style.scrollBehavior = previous;
  }, []);

  return <div className="page-enter">{children}</div>;
}
