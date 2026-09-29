import type { Metadata } from "next";
import { TestimonialCard } from "@/components/testimonials/testimonial-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublishedTestimonials } from "@/lib/queries/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What clients and colleagues say about working with me.",
  alternates: { canonical: "/testimonials" },
};

export default async function TestimonialsPage() {
  const testimonials = await getPublishedTestimonials();

  return (
    <>
      <section className="screen-section">
        <div className="container-page w-full py-8">
          <SectionHeading
            className="enter"
            as="h1"
            eyebrow="Testimonials"
            title="What clients say"
            description="Feedback from the teams I have worked with."
            align="center"
          />
        </div>
      </section>
      <section className="container-page py-20">
        <div>
        {testimonials.length === 0 ? (
          <EmptyState title="No testimonials yet" description="Add testimonials from the admin panel." />
        ) : (
          <ul className="stagger grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <li key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </li>
            ))}
          </ul>
        )}
        </div>
      </section>
    </>
  );
}
