import { Code2, Gauge, Lightbulb, Users } from "lucide-react";

const principles = [
  {
    title: "Clean Code",
    description:
      "Readable, well-tested code with clear boundaries so the next developer (often future me) can move quickly.",
    Icon: Code2,
  },
  {
    title: "Performance",
    description:
      "Fast by default: server rendering, optimised images and measured Core Web Vitals on every release.",
    Icon: Gauge,
  },
  {
    title: "Collaboration",
    description:
      "Short feedback loops, transparent progress and honest estimates. No surprises at the end of a sprint.",
    Icon: Users,
  },
  {
    title: "Product Thinking",
    description:
      "I care about the problem behind the ticket and push back when a simpler solution serves users better.",
    Icon: Lightbulb,
  },
] as const;

export function HowIWork() {
  return (
    <section className="border-t border-line bg-surface" aria-labelledby="how-i-work">
      <div className="container-page py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Process</p>
        <h2 id="how-i-work" className="mt-3 text-3xl font-semibold">
          How I Work
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map(({ title, description, Icon }) => (
            <li key={title} className="rounded-2xl border border-line bg-canvas p-6">
              <Icon className="size-5 text-accent" aria-hidden />
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
