import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { CheckCircle2, Settings, Clock, ArrowRight } from "lucide-react";

const phases = [
  {
    badge: "Disponible aujourd'hui",
    tone: "done" as const,
    icon: CheckCircle2,
    title: "Ce qui fonctionne déjà",
    items: [
      "Génération de factures au format légal Factur-X",
      "Lecture IA des factures reçues (montant, TVA, échéance), à valider",
      "Recherche de documents en langage naturel",
      "Export FEC pour votre expert-comptable",
      "Copilote Brain : répond sur vos données et prépare les actions",
      "Diagnostic de conformité et générateur Factur-X gratuits",
    ],
  },
  {
    badge: "En cours — avant les échéances",
    tone: "doing" as const,
    icon: Settings,
    title: "Ce que nous raccordons d'ici 2026/2027",
    items: [
      "Transmission et réception des factures via une plateforme agréée partenaire",
      "Rapprochement bancaire (agrégation des comptes)",
      "e-reporting (transmission des données à l'administration)",
      "Tableaux de bord dirigeant enrichis",
    ],
  },
  {
    badge: "À venir",
    tone: "next" as const,
    icon: Clock,
    title: "Les prochaines étapes",
    items: [
      "Application mobile (déposer une facture depuis le terrain)",
      "Automatisations avancées des relances et rappels",
      "Connecteurs avec vos outils du quotidien",
      "Modèles sectoriels (BTP, commerce, professions libérales)",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Roadmap OdocPilot — ce qui est disponible, en cours et à venir"
        description="Notre feuille de route en toute transparence : génération Factur-X et lecture IA disponibles aujourd'hui ; raccordement à une plateforme agréée et rapprochement bancaire en cours avant les échéances 2026/2027."
        canonical="/roadmap"
      />

      <section className="w-full py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">En toute transparence</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Notre feuille de route</h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Nous distinguons toujours ce qui est actif de ce qui arrive. Voici où nous en sommes, honnêtement — et ce que nous raccordons avant les échéances de la réforme.
            </p>
          </MotionDiv>

          <div className="space-y-6">
            {phases.map((phase, p) => {
              const Icon = phase.icon;
              const badgeClass =
                phase.tone === "done"
                  ? "bg-primary/10 text-primary border-primary/30"
                  : phase.tone === "doing"
                  ? "bg-primary/5 text-primary border-primary/20"
                  : "bg-muted text-muted-foreground border-border";
              return (
                <MotionDiv key={phase.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: p * 0.08, duration: 0.5 }} viewport={{ once: true }}
                  className="rounded-2xl border border-border bg-card p-7 sm:p-8 shadow-card">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold mb-3 ${badgeClass}`}>{phase.badge}</span>
                      <h2 className="text-xl font-bold text-foreground">{phase.title}</h2>
                      <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                        {phase.items.map((it) => (
                          <li key={it} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />{it}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </MotionDiv>
              );
            })}
          </div>

          <MotionDiv initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-12 rounded-2xl border border-border bg-secondary/50 p-8 text-center">
            <h3 className="text-lg font-bold text-foreground">Une fonctionnalité vous manque ?</h3>
            <p className="mt-2 text-sm text-muted-foreground">On construit OdocPilot avec les dirigeants qui l'utilisent. Dites-nous ce qui compte pour vous.</p>
            <div className="mt-6">
              <Link to="/contact">
                <Button size="lg" className="bg-gradient-cta text-primary-foreground font-bold">Nous écrire <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </div>
          </MotionDiv>
        </div>
      </section>
    </div>
  );
}
