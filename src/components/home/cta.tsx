import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="container-page pb-24">
      <div className="reveal relative overflow-hidden rounded-[2rem] border border-accent bg-accent px-8 py-14 text-center shadow-card sm:px-16 sm:py-16 dark:border-line dark:bg-surface">
        <div
          className="pointer-events-none absolute -top-16 right-0 size-56 rounded-full bg-white/15 blur-3xl dark:bg-accent/25"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 left-8 size-48 rounded-full bg-white/10 blur-3xl dark:bg-accent/15"
          aria-hidden
        />
        <h2 className="relative text-3xl font-semibold text-white sm:text-4xl dark:text-heading">
          Have a project in mind?
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg dark:text-body">
          I am currently taking on new work. Tell me about your idea and I will get back to you within
          two business days.
        </p>
        <div className="relative mt-8 flex justify-center">
          <Button
            href="/contact"
            size="lg"
            className="bg-white! text-accent! shadow-none hover:bg-white/90! dark:bg-accent! dark:text-white! dark:hover:bg-accent-hover!"
          >
            Let&apos;s talk
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}
