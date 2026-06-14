import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Mail } from "lucide-react";

interface NewsletterInlineProps {
  source: string;
  title?: string;
  description?: string;
  cta?: string;
  placeholder?: string;
}

/**
 * Capture email INLINE (jamais en popup), avec une promesse précise et honnête liée
 * à l'échéance e-facture. Aucun chiffre d'abonnés fabriqué. Réutilisable.
 */
export function NewsletterInline({
  source,
  title = "Veille e-facturation",
  description = "On vous prévient quand quelque chose change vraiment dans la réforme 2026/2027 — pas de spam, juste l'essentiel.",
  cta = "Me tenir au courant",
  placeholder = "vous@entreprise.fr",
}: NewsletterInlineProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: value, source });
    setLoading(false);
    // Un email déjà inscrit (contrainte d'unicité) = succès côté utilisateur.
    if (error && !/duplicate|unique/i.test(error.message)) {
      toast({ title: "Une erreur est survenue", description: "Réessayez dans un instant.", variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: "C'est noté", description: "On vous prévient quand quelque chose change vraiment." });
  };

  return (
    <section className="mt-12 rounded-2xl border border-border bg-secondary/60 p-7 sm:p-9">
      <div className="flex items-start gap-3">
        <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
          <Mail className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>

          {done ? (
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <Check className="h-4 w-4 text-primary" /> C'est confirmé — vérifiez votre boîte mail.
            </p>
          ) : (
            <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                aria-label="Votre adresse email"
                className="h-11 sm:max-w-xs"
              />
              <Button type="submit" disabled={loading} className="h-11 bg-gradient-cta text-primary-foreground">
                {loading ? "…" : cta}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
