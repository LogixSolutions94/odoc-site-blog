import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { CheckCircle, Settings, Clock, ArrowRight } from "lucide-react";

const phases = [
  {
    badge: "✓ En production",
    badgeClass: "bg-green-500/10 text-green-600 border-green-500/20",
    title: "Phase 1 — Les fondations (disponible)",
    description:
      "Les 11 modules core disponibles dès aujourd'hui — Documents, Factures IA, OdocPilot Brain, Analytics, Équipe, RH, Projets, Messagerie, Portail Fournisseur, Smart Connectors, Calendrier partagé. CRM basique inclus dans le plan Essential.",
    icon: CheckCircle,
    iconClass: "text-green-600",
  },
  {
    badge: "⚙ En cours",
    badgeClass: "bg-accent/10 text-accent border-accent/20",
    title: "Phase 2 — Expansion",
    description:
      "Certification PDP (facturation électronique obligatoire 2026), intégrations avancées (Slack, Notion, HubSpot), OdocPilot Brain v1.2 (mémoire longue, multi-documents), mode hors-ligne, rapports dirigeant personnalisables.",
    icon: Settings,
    iconClass: "text-accent",
  },
  {
    badge: "◷ À venir",
    badgeClass: "bg-muted text-muted-foreground border-border",
    title: "Phase 3 — Écosystème",
    description:
      "Application mobile iOS & Android, API publique documentée, Marketplace d'intégrations partenaires, OdocPilot Brain v2 (multi-agents autonomes), tableau de bord prédictif IA.",
    icon: Clock,
    iconClass: "text-muted-foreground",
  },
];

export default function RoadmapPage() {
  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Roadmap OdocPilot — Fonctionnalités à venir et en développement"
        description="Découvrez les prochaines fonctionnalités d'OdocPilot : certification PDP 2026, OdocPilot Brain v2, API publique et app mobile. Votez pour les features qui comptent."
        canonical="/roadmap"
      />

      <section className="w-full py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Notre Roadmap
            </h1>
            <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
              Nous construisons OdocPilot pour les entreprises qui avancent vite. Voici ce qui arrive.
            </p>
          </MotionDiv>

          <div className="space-y-6">
            {phases.map((phase, i) => {
              const Icon = phase.icon;
              return (
                <MotionDiv
                  key={phase.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-xl bg-card border border-border shadow-card"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary/5 flex-shrink-0">
                      <Icon className={`h-5 w-5 ${phase.iconClass}`} />
                    </div>
                    <div>
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold mb-3 ${phase.badgeClass}`}>
                        {phase.badge}
                      </span>
                      <h2 className="text-xl font-bold text-foreground">{phase.title}</h2>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{phase.description}</p>
                    </div>
                  </div>
                </MotionDiv>
              );
            })}
          </div>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 p-8 rounded-xl bg-secondary/50 border border-border text-center"
          >
            <h3 className="text-lg font-bold text-foreground">Une idée ? Une fonctionnalité manquante ?</h3>
            <p className="mt-2 text-sm text-muted-foreground">Partagez vos suggestions avec notre équipe.</p>
            <div className="mt-6">
              <Link to="/contact">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Nous contacter <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </MotionDiv>
        </div>
      </section>
    </div>
  );
}
