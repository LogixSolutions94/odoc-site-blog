import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SEOHead } from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CONTACT_EMAIL, PUBLISHER } from "@/lib/marketing";
import { fr } from "@/lib/typo";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Indiquez votre nom.").max(100, "100 caractères au maximum."),
  email: z.string().trim().email("Cette adresse e-mail ne semble pas valide.").max(255, "255 caractères au maximum."),
  company: z.string().trim().max(100, "100 caractères au maximum.").optional(),
  message: z.string().trim().min(1, "Écrivez votre message.").max(2000, "2 000 caractères au maximum."),
});

type ContactForm = z.infer<typeof contactSchema>;

/*
 * Textes lus au build par le prérendu (scripts/lib/page-source.ts) : props de <SEOHead>,
 * <h1> et premier paragraphe. Littéraux uniquement (ni fr(), ni import), espaces
 * insécables tapées : U+202F avant ? ! ; %, U+00A0 avant : et €.
 */
const SEO_TITLE = "Contacter OdocPilot : c'est le fondateur qui répond";
const SEO_DESCRIPTION =
  "Une question sur la facture électronique, une offre ou l'application ? Écrivez à contact@odocpilot.com ou via ce formulaire : c'est le fondateur qui répond.";
const H1 = "Une question ? Écrivez-nous.";
const INTRO =
  "Sur la facture électronique, une offre ou l'application, c'est le fondateur qui vous répond : M. Brahimi R., qui conçoit et développe OdocPilot.";

const QUICK_ANSWERS = [
  { to: "/diagnostic", label: "Suis-je concerné par la facture électronique ?" },
  { to: "/verificateur", label: "Ma facture est-elle conforme ?" },
  { to: "/e-facture", label: "Ce qui change en 2026 et en 2027" },
  { to: "/pricing", label: "Combien coûte OdocPilot ?" },
];

const labelClass = "block text-[0.9375rem] font-bold";
const errorClass = "mt-1.5 text-[0.875rem] text-destructive";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (formData.get("website")) return;

    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: (formData.get("company") as string) || undefined,
      message: formData.get("message") as string,
    };

    const result = contactSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactForm;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: result.data,
      });

      if (error) throw error;

      toast({
        title: "Message envoyé",
        description: "Merci. Le fondateur vous répondra par e-mail.",
      });
      (event.target as HTMLFormElement).reset();
    } catch {
      toast({
        title: "L'envoi n'a pas abouti",
        description: fr(`Réessayez dans un instant, ou écrivez directement à ${CONTACT_EMAIL}.`),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-[1240px] gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
      <SEOHead
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        canonical="/contact"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contacter OdocPilot",
          url: "https://odocpilot.com/contact",
          mainEntity: {
            "@type": "Organization",
            name: "OdocPilot",
            url: "https://odocpilot.com",
            email: CONTACT_EMAIL,
            founder: { "@type": "Person", name: PUBLISHER.name },
          },
        }}
      />

      <div>
        <p className="text-sm font-bold text-muted-foreground">Contact</p>
        <h1 className="mt-4 font-display display-tight text-[clamp(2.4rem,5.2vw,4.25rem)] font-bold leading-[1.02]">{H1}</h1>
        <p className="mt-6 max-w-[32rem] text-[1.1875rem] leading-relaxed text-muted-foreground">{INTRO}</p>
        <p className="mt-6 text-[1.0625rem]">
          {fr("Par e-mail : ")}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-data link-underline">
            {CONTACT_EMAIL}
          </a>
        </p>

        <div className="mt-12">
          <h2 className="font-display text-xl font-bold">Réponses rapides</h2>
          <ul className="mt-4 border-t border-foreground/80">
            {QUICK_ANSWERS.map((item) => (
              <li key={item.to} className="border-b border-border">
                <Link to={item.to} className="group flex items-center justify-between gap-6 py-4 font-bold">
                  {fr(item.label)}
                  <ArrowRight
                    size={16}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="lg:pt-2">
        <form
          onSubmit={handleSubmit}
          aria-labelledby="formulaire-titre"
          className="relative space-y-6 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sheet sm:p-8"
        >
          <h2 id="formulaire-titre" className="font-display text-2xl font-bold">
            Votre message
          </h2>

          {/* Piège à robots : invisible pour les humains, ignoré au clavier. */}
          <div className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input type="text" name="website" id="website" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>
                Nom
              </label>
              <Input
                type="text"
                name="name"
                id="name"
                required
                autoComplete="name"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="mt-2 h-11 text-base"
              />
              {errors.name && (
                <p id="name-error" className={errorClass}>
                  {fr(errors.name)}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Adresse e-mail
              </label>
              <Input
                type="email"
                name="email"
                id="email"
                required
                autoComplete="email"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="mt-2 h-11 text-base"
              />
              {errors.email && (
                <p id="email-error" className={errorClass}>
                  {fr(errors.email)}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="company" className={labelClass}>
              Entreprise <span className="font-normal text-muted-foreground">(facultatif)</span>
            </label>
            <Input
              type="text"
              name="company"
              id="company"
              autoComplete="organization"
              aria-invalid={errors.company ? true : undefined}
              aria-describedby={errors.company ? "company-error" : undefined}
              className="mt-2 h-11 text-base"
            />
            {errors.company && (
              <p id="company-error" className={errorClass}>
                {fr(errors.company)}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="message" className={labelClass}>
              Votre message
            </label>
            <Textarea
              name="message"
              id="message"
              rows={6}
              required
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? "message-error" : undefined}
              className="mt-2 text-base"
            />
            {errors.message && (
              <p id="message-error" className={errorClass}>
                {fr(errors.message)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-ink w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={18} strokeWidth={1.75} className="animate-spin" aria-hidden="true" />}
            {loading ? "Envoi en cours" : "Envoyer le message"}
          </button>

          <p className="text-[0.875rem] leading-relaxed text-muted-foreground">
            {fr("Votre message sert uniquement à vous répondre : il n'est ni revendu, ni ajouté à une liste d'envoi. ")}
            <Link to="/politique-confidentialite" className="link-underline">
              Politique de confidentialité
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
