import type { Metadata } from "next";
import { HowIWork } from "@/components/services/how-i-work";
import { ServiceCard } from "@/components/services/service-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublishedServices } from "@/lib/queries/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Services",
  description: "Web development, API development and mobile apps — from idea to production.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <>
      <section className="container-page py-20">
        <SectionHeading
          as="h1"
          eyebrow="What I do"
          title="Services"
          description="From idea to production, I help teams ship reliable software."
          align="center"
        />
        <div className="mt-12">
          {services.length === 0 ? (
            <EmptyState title="No services listed yet" description="Add services from the admin panel." />
          ) : (
            <ul className="grid gap-6 md:grid-cols-3">
              {services.map((service) => (
                <li key={service.id}>
                  <ServiceCard service={service} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-12 flex justify-center">
          <Button href="/contact" size="lg">
            Discuss your project
          </Button>
        </div>
      </section>
      <HowIWork />
    </>
  );
}
