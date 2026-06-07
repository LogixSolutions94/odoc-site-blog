import { useState } from "react";
import { Link } from "react-router-dom";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Banknote, Brain, FolderKanban, Users } from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth`;

type Group = {
  key: string;
  icon: typeof Banknote;
  eyebrow: string;
  title: string;
  intro: string;
  points: string[];
  image?: string; // /images/features/<key>.webp — affichée si présente, sinon placeholder
  label: string;
};

const groups: Group[] = [
  {
    key: "facturation",
    icon: Banknote,
    eyebrow: "Facturez & soyez payé",
    title: "Vos devis et factures, sans la corvée",
    intro:
      "Créez un devis en quelques secondes, envoyez-le, faites-le signer en ligne, transformez-le en facture. Et laissez l'assistant relancer vos clients à votre place — vous êtes payé plus vite, sans courir après personne.",
    points: [
      "Devis et factures pros en quelques clics",
      "Signature en ligne du devis par le client",
      "Relances d'impayés automatiques, au bon moment",
      "Suivi des encaissements en temps réel",
      "Prêt pour la facture électronique 2026",
    ],
    image: "/images/features/facturation.webp",
    label: "Aperçu — Devis, factures & relances",
  },
  {
    key: "pilotage",
    icon: Brain,
    eyebrow: "Pilotez sans être comptable",
    title: "Posez une question, obtenez la réponse",
    intro:
      "« Qui me doit de l'argent ? », « Combien j'ai facturé ce mois-ci ? » : votre assistant répond en français clair, à partir de vos vraies données. Et vos tableaux de bord vous montrent où va votre argent, d'un seul regard.",
    points: [
      "Assistant IA qui répond en langage naturel",
      "Réponses sourcées sur vos documents",
      "Tableaux de bord chiffre d'affaires & trésorerie",
      "Alertes sur les échéances qui comptent",
      "Export PDF / CSV pour votre comptable",
    ],
    image: "/images/features/pilotage.webp",
    label: "Aperçu — Assistant IA & tableaux de bord",
  },
  {
    key: "documents",
    icon: FolderKanban,
    eyebrow: "Tout votre administratif rangé",
    title: "Photographiez, c'est classé",
    intro:
      "Prenez une facture fournisseur en photo : montants, TVA, échéance sont extraits et rangés automatiquement au bon endroit. Vos documents sont centralisés, retrouvables en une recherche, et reliés au reste de votre activité.",
    points: [
      "Saisie automatique des factures (photo ou import)",
      "Classement intelligent, plus de dossiers perdus",
      "Recherche d'un document en langage naturel",
      "Import depuis Google Drive et Dropbox",
      "Portail fournisseur : ils déposent, vous recevez",
    ],
    image: "/images/features/documents.webp",
    label: "Aperçu — Documents & saisie automatique",
  },
  {
    key: "equipe",
    icon: Users,
    eyebrow: "Faites tourner votre équipe",
    title: "Toute votre équipe, au même endroit",
    intro:
      "Invitez vos collaborateurs, donnez à chacun le bon accès, suivez vos projets, gérez les congés et échangez — sans quitter Odoc. Un seul outil pour le terrain, le bureau et la compta.",
    points: [
      "Invitations & rôles (chacun voit ce qu'il doit voir)",
      "Projets et tâches en vue Kanban ou liste",
      "Congés et absences suivis simplement",
      "Messagerie d'équipe intégrée",
      "Calendrier partagé avec rappels automatiques",
    ],
    image: "/images/features/equipe.webp",
    label: "Aperçu — Équipe, projets & calendrier",
  },
];

/** Affiche la vraie capture si le fichier existe, sinon un placeholder propre. */
function FeatureVisual({ src, label }: { src?: string; label: string }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={label}
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full rounded-2xl border border-border shadow-elevated aspect-video object-cover"
      />
    );
  }
  return (
    <div className="rounded-2xl bg-secondary border border-border aspect-video flex items-center justify-center shadow-card">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

export default function FonctionnalitesPage() {
  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Fonctionnalités — Odoc | Devis, factures, IA & gestion tout-en-un"
        description="Découvrez tout ce qu'Odoc fait pour vous : devis et factures, relances automatiques, assistant IA, saisie automatique des documents, équipe et projets. Un seul outil, hébergé en France."
        canonical="/fonctionnalites"
      />

      {/* Hero */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-14 text-center">
        <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5">Tout-en-un</span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">Tout ce qu'Odoc fait à votre place</h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground">
            Pas une liste de fonctions techniques — une liste de soucis en moins. Voici concrètement ce que vous gagnez, jour après jour.
          </p>
        </MotionDiv>
      </section>

      {/* Groupes-bénéfices */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-24">
        {groups.map((g, i) => {
          const Icon = g.icon;
          const reverse = i % 2 === 1;
          return (
            <MotionDiv key={g.key} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid lg:grid-cols-2 gap-10 items-center">
              <div className={reverse ? "lg:order-2" : ""}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
                  <p className="text-sm font-semibold text-primary">{g.eyebrow}</p>
                </div>
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{g.title}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{g.intro}</p>
                <ul className="mt-6 space-y-3">
                  {g.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={reverse ? "lg:order-1" : ""}>
                <FeatureVisual src={g.image} label={g.label} />
              </div>
            </MotionDiv>
          );
        })}
      </section>

      {/* CTA */}
      <section className="w-full py-20 bg-secondary/60 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Le plus simple, c'est d'essayer.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Gratuit 14 jours, sans carte bancaire. Vous verrez la différence dès la première facture.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <a href={SIGNUP} target="_blank" rel="noopener noreferrer" data-umami-event="cta-essai-gratuit">
              <Button size="lg" className="bg-gradient-cta text-primary-foreground font-bold">Essayer gratuitement <ArrowRight className="ml-2 h-5 w-5" /></Button>
            </a>
            <Link to="/contact"><Button size="lg" variant="outline">Demander une démo</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
