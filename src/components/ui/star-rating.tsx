import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }, (_, index) => (
        <Star
          key={index}
          className={cn(
            "size-4",
            index < value ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}
