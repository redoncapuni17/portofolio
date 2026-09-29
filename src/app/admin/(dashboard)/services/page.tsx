import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FormPanel } from "@/components/admin/form-panel";
import { PageHeader } from "@/components/admin/page-header";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { RowActions } from "@/components/admin/row-actions";
import { ServiceForm } from "@/components/admin/services/service-form";
import { Table, TableEmpty, TBody, TD, TH, THead, TR } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { deleteService, setServicePublished } from "@/lib/actions/content";
import { getAllServicesAdmin } from "@/lib/queries/content";
import { truncate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage({ searchParams }: PageProps<"/admin/services">) {
  const [{ new: isNew, edit }, services] = await Promise.all([searchParams, getAllServicesAdmin()]);
  const editing = typeof edit === "string" ? services.find((service) => service.id === edit) : undefined;
  const showForm = isNew !== undefined || editing !== undefined;

  return (
    <>
      <PageHeader
        title="Services"
        description="What you offer, shown on the Services page."
        actions={
          <Link href="/admin/services?new=1" className={buttonClasses({ size: "sm" })}>
            <Plus className="size-4" aria-hidden />
            Add service
          </Link>
        }
      />

      {showForm ? (
        <FormPanel title={editing ? `Edit “${editing.title}”` : "New service"} closeHref="/admin/services">
          <ServiceForm key={editing?.id ?? "new"} service={editing} />
        </FormPanel>
      ) : null}

      <Table>
        <THead>
          <TR>
            <TH>Service</TH>
            <TH>Technologies</TH>
            <TH>Order</TH>
            <TH>Published</TH>
            <TH className="text-right">Actions</TH>
          </TR>
        </THead>
        <TBody>
          {services.length === 0 ? (
            <TableEmpty colSpan={5}>No services yet.</TableEmpty>
          ) : (
            services.map((service) => (
              <TR key={service.id}>
                <TD>
                  <div className="flex items-start gap-2.5">
                    <Icon name={service.icon} className="mt-0.5 size-4 shrink-0 text-accent" />
                    <div>
                      <span className="font-medium text-heading">{service.title}</span>
                      <p className="text-xs text-muted">{truncate(service.description, 90)}</p>
                    </div>
                  </div>
                </TD>
                <TD>
                  <div className="flex flex-wrap gap-1">
                    {service.technologies.slice(0, 4).map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </TD>
                <TD>{service.sort_order}</TD>
                <TD>
                  <PublishToggle published={service.published} onToggle={setServicePublished.bind(null, service.id)} />
                </TD>
                <TD>
                  <RowActions editHref={`/admin/services?edit=${service.id}`} onDelete={deleteService.bind(null, service.id)} name={service.title} />
                </TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>
    </>
  );
}
