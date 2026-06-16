import { cn } from "@/lib/utils";
import { categoryLabel } from "@/lib/blogTaxonomy";

interface BlogCategoryBadgeProps {
  category: string;
  /** Mise en avant (accent orange rare) — réservé à 1 badge structurant par écran. */
  accent?: boolean;
  className?: string;
}

/**
 * Pastille de silo, pilotée par la taxonomie partagée (blogTaxonomy) et les tokens
 * de marque — fini les couleurs bleu/violet en dur et le repli trompeur « Général ».
 */
export function BlogCategoryBadge({ category, accent = false, className }: BlogCategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        accent
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-secondary text-secondary-foreground",
        className,
      )}
    >
      {categoryLabel(category)}
    </span>
  );
}
