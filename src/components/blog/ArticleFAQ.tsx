import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/blogContent";

/**
 * FAQ visible (accordéon) dérivée du markdown (## FAQ). Le texte affiché ici est
 * STRICTEMENT le même que celui injecté dans le FAQPage JSON-LD (même parseFaq) —
 * exigence Google. La classe .faq-answer est ciblée par le schema Speakable (AEO).
 */
export function ArticleFAQ({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Questions fréquentes</h2>
      <Accordion type="single" collapsible className="mt-6">
        {items.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
            <AccordionContent>
              <p className="faq-answer leading-relaxed text-muted-foreground">{f.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
