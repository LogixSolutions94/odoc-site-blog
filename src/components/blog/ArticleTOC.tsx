import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/blogContent";

/**
 * Sommaire ancré : suit le défilement et marque la section en cours.
 * Le parent ne le rend que pour les articles longs (≥ 4 H2) et le masque en mobile.
 * Navigation 100 % liens d'ancre standards (accessible au clavier, lisible sans JS).
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
    <nav aria-label="Sommaire" className="text-[0.9375rem]">
      <p className="mb-3 font-display text-base font-bold">Sommaire</p>
      <ul className="space-y-0.5 border-l border-border">
        {headings.map((h) => (
          <li key={h.id} className={cn(h.depth === 3 && "ml-3 text-[0.875rem]")}>
            <a
              href={`#${h.id}`}
              aria-current={activeId === h.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-1.5 pl-3 leading-snug transition-colors duration-200 focus-visible:outline-offset-[-2px]",
                activeId === h.id
                  ? "border-foreground font-bold text-foreground"
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
