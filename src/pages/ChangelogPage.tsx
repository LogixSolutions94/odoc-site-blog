import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import { subscribeNewsletter } from "@/lib/newsletter";

const versions = [
  {
    version: "Juin 2026",
    description:
      "Diagnostic de conformité et générateur Factur-X gratuits, sans compte. Refonte du site autour de la conformité à la facturation électronique 2026/2027. Mesure d'audience respectueuse de la vie privée (chargée uniquement après consentement).",
  },
  {
    version: "Mai 2026",
    description:
      "Génération de factures au format légal Factur-X (PDF/A-3 + données structurées). Export FEC pour l'expert-comptable, conforme aux 18 colonnes attendues par la DGFiP.",
  },
  {
    version: "Avril 2026",
    description:
      "Lecture IA des factures reçues : fournisseur, montant, TVA et échéance extraits et proposés, à valider d'un clic. Recherche de documents en langage naturel.",
  },
  {
    version: "Mars 2026",
    description:
      "Copilote Brain : répond à vos questions à partir de vos propres documents et prépare l'action correspondante. Données et IA hébergées en France.",
  },
];

export default function ChangelogPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await subscribeNewsletter(email, "changelog", website);
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Erreur", description: result.error, variant: "destructive" });
      return;
    }
    toast({ title: "✓ Merci ! Vous êtes inscrit.", description: "Vous recevrez nos prochaines actualités." });
    setEmail("");
  }

  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Changelog OdocPilot — nouveautés et mises à jour"
        description="Suivez l'évolution d'OdocPilot, mois par mois : génération Factur-X, lecture IA des factures, export FEC, copilote Brain, diagnostic de conformité. Données et IA hébergées en France."
        canonical="/changelog"
      />

      <section className="w-full py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Ce qu'on a livré</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Changelog</h1>
            <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
              Toutes les nouveautés OdocPilot, mois par mois.
            </p>
          </MotionDiv>

          {/* Timeline */}
          <div className="relative border-l-2 border-border pl-8 space-y-10">
            {versions.map((v, i) => (
              <MotionDiv key={v.version} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08, duration: 0.5 }} viewport={{ once: true }} className="relative">
                <div className="absolute -left-[calc(2rem+5px)] top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{v.version}</span>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              </MotionDiv>
            ))}
          </div>

          {/* Newsletter CTA */}
          <MotionDiv initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-16 rounded-2xl border border-border bg-secondary/50 p-8 text-center">
            <h3 className="text-lg font-bold text-foreground">Restez informé des prochaines nouveautés</h3>
            <p className="mt-2 text-sm text-muted-foreground">Conformité e-facture, nouveautés produit — directement dans votre boîte mail.</p>
            <form onSubmit={handleNewsletter} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
                <label htmlFor="cl-website">Website</label>
                <input type="text" id="cl-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <Input type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1" />
              <Button type="submit" disabled={loading} className="bg-gradient-cta text-primary-foreground">{loading ? "…" : "S'abonner"}</Button>
            </form>
          </MotionDiv>
        </div>
      </section>
    </div>
  );
}
