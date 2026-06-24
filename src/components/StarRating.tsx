import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ rating, size = 14, className }: { rating: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted-foreground/30"}
        />
      ))}
    </span>
  );
}
