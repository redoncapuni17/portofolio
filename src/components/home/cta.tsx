import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="container-page pb-24">
      <div className="reveal rounded-3xl border border-line bg-surface px-8 py-14 text-center shadow-soft sm:px-16">
        <h2 className="text-3xl font-semibold sm:text-4xl">Have a project in mind?</h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
          I am currently taking on new work. Tell me about your idea and I will get back to you within
          two business days.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/contact" size="lg">
            Let&apos;s talk
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}
