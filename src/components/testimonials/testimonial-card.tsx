import { Quote } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import type { Testimonial } from "@/types";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const role = [testimonial.position, testimonial.company].filter(Boolean).join(", ");

  return (
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-surface p-7 shadow-soft">
      <div className="flex items-center justify-between">
        <Quote className="size-6 text-accent" aria-hidden />
        <StarRating value={testimonial.rating} />
      </div>
      <blockquote className="mt-5 flex-1 text-base leading-relaxed text-heading">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <Avatar src={testimonial.image_url} name={testimonial.name} size={44} />
        <div>
          <p className="text-sm font-semibold text-heading">{testimonial.name}</p>
          {role ? <p className="text-xs text-body">{role}</p> : null}
        </div>
      </figcaption>
    </figure>
  );
}
