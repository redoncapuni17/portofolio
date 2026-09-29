"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({ value }: { value: string }) {
  const match = /^(\d+)(.*)$/.exec(value.trim());
  const target = match ? Number(match[1]) : null;
  const suffix = match?.[2] ?? "";
  const [current, setCurrent] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (target === null) return;
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let timer = 0;
    let stopped = false;
    let started = false;

    const run = () => {
      if (started || stopped) return;
      started = true;
      window.clearInterval(timer);
      if (reduce) {
        setCurrent(value);
        return;
      }

      setCurrent(`0${suffix}`);
      const duration = 1000;
      const start = performance.now();
      const tick = (now: number) => {
        if (stopped) return;
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - progress) ** 3;
        setCurrent(`${Math.round(eased * target)}${suffix}`);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const check = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) run();
    };

    check();
    timer = window.setInterval(check, 200);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    return () => {
      stopped = true;
      window.clearInterval(timer);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [suffix, target, value]);

  return <span ref={ref}>{current}</span>;
}
