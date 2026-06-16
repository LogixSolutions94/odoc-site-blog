import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/blogContent";

/**
 * Sommaire ancré : suit le scroll et surligne la section active.
 * Le parent ne le rend que pour les articles longs (≥ 4 H2) et le masque en mobile.
 * Navigation 100% liens d'ancre standards (accessible clavier + lisible sans JS).
 */
export function ArticleTOC({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el != null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="Sommaire" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Sur cette page
      </p>
      <ul className="space-y-1 border-l border-border">
        {headings.map((h) => (
          <li key={h.id} className={cn(h.depth === 3 && "ml-3")}>
            <a
              href={`#${h.id}`}
              className={cn(
                "-ml-px block border-l-2 py-1 pl-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeId === h.id
                  ? "border-primary font-medium text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
