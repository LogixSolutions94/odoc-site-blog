import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import {
  FileText,
  Receipt,
  Brain,
  BarChart3,
  Users,
  UserCog,
  KanbanSquare,
  MessageSquare,
  Link2,
  Cloud,
  Calendar,
} from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";

const modules = [
  {
    id: "documents",
    icon: FileText,
    title: "Gestion Documentaire",
    description: "Uploadez, classez et retrouvez n'importe quel document en secondes. L'IA extrait les données clés automatiquement et les organise dans une arborescence intelligente.",
    benefits: [
      "Import par glisser-déposer, email dédié ou API",
      "Classification automatique par type de document",
      "OCR et extraction de données IA",
      "Recherche en langage naturel",
      "Archivage sécurisé avec historique complet",
    ],
    screenshotLabel: "Aperçu — Gestion documentaire IA",
  },
  {
    id: "factures-ia",
    icon: Receipt,
    title: "Factures IA",
    description: "Extraction automatique, workflow de validation, conformité NF Z42-013, détection de fraude et archivage légal SHA-256. De la réception au paiement, tout est automatisé.",
    benefits: [
      "Extraction automatique des montants, TVA, fournisseurs",
      "Workflow de validation multi-niveaux",
      "Conformité NF Z42-013 et Factur-X",
      "Détection de doublons et de fraude",
      "Archivage à valeur probante SHA-256",
    ],
    screenshotLabel: "Aperçu — Traitement factures IA",
  },
  {
    id: "odoc-brain",
    icon: Brain,
    title: "Odoc Brain (Copilot IA)",
    description: "Posez n'importe quelle question sur vos documents en langage naturel. Obtenez des réponses précises avec sources, citations et recommandations.",
    benefits: [
      "Questions en langage naturel sur tous vos documents",
      "Réponses sourcées avec citations exactes",
      "Analyse croisée de plusieurs documents",
      "Résumés automatiques de contrats et rapports",
      "Suggestions proactives et alertes intelligentes",
    ],
    screenshotLabel: "Aperçu — Odoc Brain",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Analytics Multi-Métiers",
    description: "Tableaux de bord Général, Comptable, Juridique et Administratif. Visualisez vos KPIs en temps réel et exportez vos rapports en PDF et CSV.",
    benefits: [
      "Dashboard général avec vue d'ensemble",
      "Vue comptable : CA, dépenses, trésorerie",
      "Vue juridique : contrats, échéances, alertes",
      "Vue administrative : documents traités, volumétrie",
      "Export PDF et CSV en un clic",
    ],
    screenshotLabel: "Aperçu — Analytics multi-métiers",
  },
  {
    id: "equipe",
    icon: Users,
    title: "Gestion d'Équipe",
    description: "Invitez vos collaborateurs, assignez des rôles (comptable, juriste, admin) et gérez les accès par profil. Chacun voit exactement ce dont il a besoin.",
    benefits: [
      "Invitation par email en un clic",
      "Rôles prédéfinis : admin, comptable, juriste, lecteur",
      "Rôles owner / admin / member / viewer",
      "Journal d'activité et traçabilité complète",
      "Gestion des équipes et départements",
    ],
    screenshotLabel: "Aperçu — Gestion d'équipe",
  },
  {
    id: "rh",
    icon: UserCog,
    title: "Module RH",
    description: "Gestion des employés, suivi des congés, approbations automatiques et export des données RH. Tout ce qu'il faut pour piloter vos ressources humaines.",
    benefits: [
      "Fiches employés complètes",
      "Suivi des congés et absences",
      "Workflows d'approbation automatiques",
      "Export des données RH (CSV, PDF)",
      "Alertes de renouvellement de contrats",
    ],
    screenshotLabel: "Aperçu — Module RH",
  },
  {
    id: "projets",
    icon: KanbanSquare,
    title: "Projets Kanban",
    description: "Créez vos projets, assignez des tâches avec priorités et suivez l'avancement en vue Kanban ou liste. Simple, visuel et collaboratif.",
    benefits: [
      "Vue Kanban et vue liste",
      "Tâches avec priorités, assignation et échéances",
      "Commentaires et pièces jointes par tâche",
      "Filtres et recherche avancée",
      "Notifications en temps réel",
    ],
    screenshotLabel: "Aperçu — Projets Kanban",
  },
  {
    id: "messagerie",
    icon: MessageSquare,
    title: "Messagerie Interne",
    description: "Canaux d'équipe, messages temps réel, @mentions et pièces jointes. Communiquez avec votre équipe sans quitter Odoc.",
    benefits: [
      "Canaux publics et privés",
      "Messages en temps réel",
      "@mentions et notifications",
      "Partage de fichiers et documents Odoc",
      "Recherche dans l'historique des conversations",
    ],
    screenshotLabel: "Aperçu — Messagerie interne",
  },
  {
    id: "portail-fournisseur",
    icon: Link2,
    title: "Portail Fournisseur",
    description: "Envoyez un lien sécurisé à vos fournisseurs pour qu'ils déposent leurs factures directement dans Odoc. Plus de mails perdus.",
    benefits: [
      "Lien sécurisé unique par fournisseur",
      "Upload direct dans votre espace Odoc",
      "Notifications de réception automatiques",
      "Historique complet des dépôts",
      "Aucun compte requis pour le fournisseur",
    ],
    screenshotLabel: "Aperçu — Portail fournisseur",
  },
  {
    id: "connectors",
    icon: Cloud,
    title: "Smart Connectors",
    description: "Connectez Google Drive et Dropbox pour synchroniser vos documents automatiquement dans Odoc. Votre écosystème, unifié.",
    benefits: [
      "Import automatique Google Drive",
      "Import automatique Dropbox",
      "Import automatique des nouveaux fichiers",
      "Mapping de dossiers personnalisable",
      "API ouverte pour intégrations custom",
    ],
    screenshotLabel: "Aperçu — Smart Connectors",
  },
  {
    id: "calendrier",
    icon: Calendar,
    title: "Calendrier Partagé",
    description: "Calendrier partagé Odoc : planifiez et partagez les événements de votre équipe. Vue agenda, rappels automatiques, partage en un clic. Intégration Google Calendar prévue Q4 2026.",
    benefits: [
      "Vue agenda partagée par équipe",
      "Rappels automatiques par email",
      "Intégration Google Calendar — prévue Q4 2026",
      "Création d'événements depuis les tâches Kanban",
      "Disponibilités et planification simplifiées",
    ],
    screenshotLabel: "Aperçu — Calendrier Partagé",
  },
];

export default function FonctionnalitesPage() {
  const [activeSection, setActiveSection] = useState(modules[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    modules.forEach((m) => {
      const el = document.getElementById(m.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Fonctionnalités — Odoc | Les 11 modules de l'OS d'entreprise IA"
        description="Découvrez les 11 modules d'Odoc : documents, factures IA, Odoc Brain, analytics, équipe, RH, projets, messagerie, calendrier, portail fournisseur et smart connectors."
        canonical="/fonctionnalites"
      />

      {/* Hero */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-14 text-center">
        <MotionDiv>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Les 11 modules de votre OS IA
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground">
            Chaque module est conçu pour automatiser une facette de votre entreprise. Ensemble, ils forment un employé IA complet.
          </p>
        </MotionDiv>
      </section>

      {/* Modules with sticky nav */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <div className="flex gap-12">
          {/* Sticky sidebar */}
          <nav className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              {modules.map((m) => (
                <a
                  key={m.id}
                  href={`#${m.id}`}
                  className={`block rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                    activeSection === m.id
                      ? "bg-primary/10 text-primary font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {m.title}
                </a>
              ))}
            </div>
          </nav>

          {/* Sections */}
          <div className="flex-1 space-y-28">
            {modules.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={m.id} id={m.id} className="scroll-mt-24">
                  <MotionDiv
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="grid gap-10 lg:grid-cols-2 items-center"
                  >
                    <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">{m.title}</h2>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{m.description}</p>
                      <ul className="mt-6 space-y-3">
                        {m.benefits.map((b) => (
                          <li key={b} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      className={`rounded-xl bg-secondary border border-border aspect-video flex items-center justify-center shadow-card ${
                        i % 2 === 1 ? "lg:order-1" : ""
                      }`}
                    >
                      <span className="text-sm text-muted-foreground font-medium">{m.screenshotLabel}</span>
                    </div>
                  </MotionDiv>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-card rounded-2xl p-10 sm:p-14 shadow-elevated border border-border">
            <MotionDiv>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Prêt à découvrir Odoc en action ?</h2>
              <p className="mt-4 text-lg text-muted-foreground">Essayez gratuitement ou demandez une démonstration personnalisée.</p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <a href={`${APP_URL}/auth`} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Essayer gratuitement</Button>
                </a>
                <Link to="/contact">
                  <Button size="lg" variant="outline">Demander une démo</Button>
                </Link>
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>
    </div>
  );
}
