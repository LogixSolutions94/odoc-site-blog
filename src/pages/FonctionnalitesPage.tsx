import { Link } from "react-router-dom";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { FeaturePreview } from "@/components/FeaturePreview";
import { ArrowRight, Check, Banknote, Brain, FolderKanban, Users } from "lucide-react";
import { KeyMark } from "@/components/KeyMark";
import { SIGNUP_URL, TRIAL } from "@/lib/marketing";
import { OCR } from "@/content/ocr";

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
      "Relances d'impayés préparées automatiquement",
      "Suivi des encaissements",
      "Factures au format légal Factur-X (réforme 2026)",
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
    title: OCR.title,
    intro: OCR.intro,
    points: [
      "Lecture IA des factures (photo ou import) : montant, TVA, échéance extraits",
      "Classement intelligent, plus de dossiers perdus",
      "Recherche d'un document en langage naturel",
      "Vos documents reliés à vos factures et à vos clients",
      "Export FEC pour votre expert-comptable, en un clic",
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
      "Invitez vos collaborateurs, donnez à chacun le bon accès, suivez vos projets, gérez les congés et échangez — sans quitter OdocPilot. Un seul outil pour le terrain, le bureau et la compta.",
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

export default function FonctionnalitesPage() {
  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Factur-X et OCR des factures fournisseurs | OdocPilot"
        description="Créez vos factures Factur-X, extrayez les données des factures fournisseurs et vérifiez-les avant validation. Essai 14 jours sans carte bancaire."
        canonical="/fonctionnalites"
      />

      {/* Hero */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-14 text-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5">Conformité 2026 + gestion par l'IA</span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">Tout ce qu'OdocPilot <KeyMark>prépare</KeyMark> pour vous</h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground">
            Créez vos factures au format Factur-X et réduisez la saisie de vos factures fournisseurs grâce à la lecture automatique par IA. Contrôlez les informations extraites, puis validez-les.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3">
            <a href={SIGNUP_URL} className="btn-ink" data-umami-event="cta-fonctionnalites-hero">Essayer sur mes factures <ArrowRight className="ml-2 h-4 w-4" /></a>
            <p className="text-sm text-muted-foreground">{TRIAL.short}</p>
            <Link to="/diagnostic" className="text-sm underline underline-offset-4" data-umami-event="cta-fonctionnalites-diagnostic-hero">Facture électronique : vérifier mes obligations gratuitement</Link>
            <a href="#documents" className="text-sm underline underline-offset-4">Comment fonctionne la lecture des factures fournisseurs ?</a>
          </div>
        </div>
      </section>

      {/* Groupes-bénéfices */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-24">
        {groups.map((g, i) => {
          const Icon = g.icon;
          const reverse = i % 2 === 1;
          return (
            <MotionDiv id={g.key} key={g.key} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid scroll-mt-24 lg:grid-cols-2 gap-10 items-center">
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
                {g.key === "documents" && (
                  <div className="mt-6 space-y-3 border-t border-border pt-5">
                    <p className="text-sm text-muted-foreground">{OCR.limitation}</p>
                    <Link to="/e-facture" className="block text-sm underline underline-offset-4">Comprendre la différence avec la facture électronique</Link>
                    <a href={SIGNUP_URL} className="btn-ink" data-umami-event="cta-fonctionnalites-ocr">Tester la lecture de mes factures</a>
                    <p className="text-sm text-muted-foreground">{TRIAL.short}</p>
                  </div>
                )}
              </div>
              <div className={reverse ? "lg:order-1" : ""}>
                <FeaturePreview kind={g.key} />
              </div>
            </MotionDiv>
          );
        })}
      </section>

      {/* CTA */}
      <section className="w-full py-20 bg-secondary/60 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Le plus simple, c'est d'essayer.</h2>
          <p className="mt-4 text-lg text-muted-foreground">{TRIAL.short}. Importez une facture et vérifiez les informations proposées.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <a href={SIGNUP_URL} className="btn-ink" data-umami-event="cta-fonctionnalites-final">Essayer gratuitement <ArrowRight className="ml-2 h-5 w-5" /></a>
            <Link to="/diagnostic" data-umami-event="cta-diagnostic"><Button size="lg" variant="outline">Vérifier ma conformité (3 min)</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
