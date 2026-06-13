import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const versions = [
  {
    version: "v1.2",
    date: "Avril 2026",
    description:
      "Refonte UI Navy Premium, performance améliorée, OdocPilot Brain v1.1 (réponses plus précises), nouveaux filtres Analytics.",
  },
  {
    version: "v1.1",
    date: "Mars 2026",
    description:
      "Portail Fournisseur (dépôt factures sans compte), Smart Connectors Google Drive & Dropbox, Module RH congés automatisés.",
  },
  {
    version: "v1.0",
    date: "Février 2026",
    description:
      "🎉 Lancement officiel d'OdocPilot. Documents, Factures IA, OdocPilot Brain, Analytics, Gestion d'équipe.",
  },
];

export default function ChangelogPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim(), source: "changelog" });
      if (error && error.code === "23505") {
        toast({ title: "✓ Vous êtes déjà inscrit !", description: "Cette adresse est déjà dans notre liste." });
      } else if (error) {
        throw error;
      } else {
        toast({ title: "✓ Merci ! Vous êtes inscrit.", description: "Vous recevrez nos prochaines actualités." });
      }
      setEmail("");
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue. Veuillez réessayer.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Changelog OdocPilot — Nouveautés et mises à jour de la plateforme"
        description="Suivez l'évolution d'OdocPilot : nouvelles fonctionnalités IA, améliorations de performance et correctifs. Mises à jour hebdomadaires pour votre OS d'entreprise."
        canonical="/changelog"
      />

      <section className="w-full py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Changelog
            </h1>
            <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
              Toutes les nouveautés OdocPilot, version par version.
            </p>
          </MotionDiv>

          {/* Timeline */}
          <div className="relative border-l-2 border-border pl-8 space-y-10">
            {versions.map((v, i) => (
              <MotionDiv
                key={v.version}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Dot */}
                <div className="absolute -left-[calc(2rem+5px)] top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                <div className="p-6 rounded-xl bg-card border border-border shadow-card">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      {v.version}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">{v.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              </MotionDiv>
            ))}
          </div>

          {/* Newsletter CTA */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-8 rounded-xl bg-secondary/50 border border-border text-center"
          >
            <h3 className="text-lg font-bold text-foreground">Restez informés des prochaines mises à jour</h3>
            <p className="mt-2 text-sm text-muted-foreground">Recevez les nouveautés directement dans votre boîte mail.</p>
            <form onSubmit={handleNewsletter} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {loading ? "…" : "S'abonner"}
              </Button>
            </form>
          </MotionDiv>
        </div>
      </section>
    </div>
  );
}
