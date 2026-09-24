import { useId, useState } from "react";
import { Check } from "lucide-react";
import { subscribeNewsletter } from "@/lib/newsletter";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fr } from "@/lib/typo";

interface NewsletterInlineProps {
  source: string;
  title?: string;
  description?: string;
  cta?: string;
  placeholder?: string;
  /** Nom d'événement Umami posé sur le bouton d'envoi. */
  umamiEvent?: string;
}

/**
 * Capture email INLINE (jamais en popup), avec une promesse précise et tenable :
 * l'inscription enregistre l'adresse, aucun e-mail automatique n'est envoyé.
 * Aucun chiffre d'abonnés affiché. Réutilisable (blog, livre blanc, outils).
 */
export function NewsletterInline({
  source,
  title = "Être prévenu quand la réforme change",
  description = "Nous vous écrivons quand une date ou une règle de la facture électronique change. Pas de spam.",
  cta = "Me prévenir",
  placeholder = "vous@entreprise.fr",
  umamiEvent,
}: NewsletterInlineProps) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();
  const uid = useId();
  const emailId = `${uid}-email`;
  const honeypotId = `${uid}-website`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await subscribeNewsletter(email, source, website);
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Une erreur est survenue", description: result.error, variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: "C'est noté", description: "Nous vous écrirons quand quelque chose change vraiment." });
  };

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="font-display text-xl font-bold leading-snug">{fr(title)}</h2>
      <p className="mt-2 max-w-[56ch] text-[0.9375rem] leading-relaxed text-muted-foreground">{fr(description)}</p>

      {done ? (
        <p role="status" className="mt-5 inline-flex items-center gap-2 font-bold">
          <Check size={18} strokeWidth={2.5} aria-hidden="true" />
          {fr("C'est noté : vous serez prévenu par e-mail.")}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-5 flex max-w-[34rem] flex-col gap-2.5 sm:flex-row">
          <div className="pointer-events-none absolute opacity-0" aria-hidden="true">
            <label htmlFor={honeypotId}>Website</label>
            <input
              type="text"
              id={honeypotId}
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <label htmlFor={emailId} className="sr-only">
            Votre adresse e-mail
          </label>
          <Input
            id={emailId}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="h-12 rounded-lg px-4 text-base"
          />
          <button type="submit" disabled={loading} className="btn-ink shrink-0 disabled:opacity-60" data-umami-event={umamiEvent}>
            {loading ? "Envoi…" : cta}
          </button>
        </form>
      )}
    </section>
  );
}
