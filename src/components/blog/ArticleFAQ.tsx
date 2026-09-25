import type { FaqItem } from "@/lib/blogContent";

/**
 * FAQ visible dérivée du markdown (## FAQ). Le texte affiché ici est STRICTEMENT
 * le même que celui injecté dans le FAQPage JSON-LD (même parseFaq) : exigence Google.
 * Questions et réponses restent affichées en entier (pas d'accordéon qui retire les
 * réponses du DOM) : c'est ce que lisent les moteurs et les assistants IA.
 * La classe .faq-answer est ciblée par le schema Speakable (AEO).
 */
export function ArticleFAQ({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="article-faq" className="mt-16 border-t border-foreground/80 pt-8">
      <h2
        id="article-faq"
        className="font-display text-[1.75rem] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[2rem]"
      >
        Questions fréquentes
      </h2>
      <div className="mt-4 border-b border-border">
        {items.map((f, i) => (
          <div key={i} className="border-t border-border py-6 first:border-t-0">
            <h3 className="font-display text-[1.1875rem] font-bold leading-snug">{f.q}</h3>
            <p className="faq-answer mt-2 leading-relaxed text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
