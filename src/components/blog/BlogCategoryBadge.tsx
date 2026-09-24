import { cn } from "@/lib/utils";
import { categoryLabel } from "@/lib/blogTaxonomy";

interface BlogCategoryBadgeProps {
  category: string;
  /** Mise en avant : texte à l'encre pleine plutôt qu'à l'encre diluée. */
  accent?: boolean;
  className?: string;
}

/**
 * Catégorie (silo) d'un article, en texte simple : sur la vitrine « Papeterie »,
 * une catégorie se lit comme un surtitre, pas comme une pastille.
 * Libellé piloté par la taxonomie partagée (blogTaxonomy).
 */
export function BlogCategoryBadge({ category, accent = false, className }: BlogCategoryBadgeProps) {
  return (
    <span className={cn("text-sm font-bold", accent ? "text-foreground" : "text-muted-foreground", className)}>
      {categoryLabel(category)}
    </span>
  );
}
