import { Link } from "react-router-dom";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { TrustCredentials } from "@/components/TrustCredentials";
import {
  ArrowRight,
  Check,
  Store,
  Scale,
  Calculator,
  ReceiptText,
  BellRing,
  Wallet,
  CalendarClock,
  FolderInput,
  Users,
  FileCheck2,
  Quote,
} from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;

type Win = { icon: typeof Store; title: string; desc: string };
type Metier = {
  slug: string;
  badgeIcon: typeof Store;
  badge: string;
  h1a: string;
  h1b: string;
  sub: string;
  pains: string[];
  painsTitle: string;
  wins: Win[];
  testimonial: { quote: string; name: string };
  ctaA: string;
  ctaB: string;
  seoTitle: string;
  seoDesc: string;
};

const METIERS: Record<string, Metier> = {
  commerce: {
    slug: "commerce",
    badgeIcon: Store,
    badge: "Pensé pour les commerçants & prestataires",
    h1a: "Votre commerce tourne.",
    h1b: "La gestion suit toute seule.",
    sub: "OdocPilot gère vos factures, votre fichier clients et votre trésorerie — et un assistant IA s'occupe de l'administratif pendant que vous vous occupez de vos clients.",
    painsTitle: "Le quotidien qu'on aimerait alléger",
    pains: [
      "Les factures qu'on tape le soir, après la fermeture",
      "Le fichier clients éparpillé entre carnet, mail et tableur",
      "Les paiements en retard qu'on n'ose pas relancer",
      "Aucune vue claire sur ce qui rentre vraiment",
    ],
    wins: [
      { icon: ReceiptText, title: "Facturez en quelques secondes", desc: "Devis et factures pros en quelques clics, prêts à envoyer et à encaisser. Plus de modèle Word bricolé." },
      { icon: BellRing, title: "Soyez payé plus vite", desc: "L'assistant relance vos clients en retard, au bon moment. Vous récupérez votre argent sans la corvée." },
      { icon: Wallet, title: "Pilotez votre trésorerie", desc: "Ce qui rentre, ce qui sort, ce qui reste à encaisser : tout en un coup d'œil, en temps réel." },
    ],
    testimonial: { quote: "« Je facture entre deux clients depuis mon téléphone, et les relances partent toutes seules. Je ne perds plus une soirée sur la compta. »", name: "Sophie L. · Commerçante, Nantes · bêta-testeuse" },
    ctaA: "Je teste gratuitement",
    ctaB: "Voir le tarif",
    seoTitle: "Logiciel de gestion pour commerçants & TPE de services | OdocPilot",
    seoDesc: "OdocPilot réunit facturation, fichier clients et trésorerie pour les commerces et prestataires, avec un assistant IA qui gère l'administratif. Hébergé en France, essai gratuit 14 jours.",
  },
  "professions-liberales": {
    slug: "professions-liberales",
    badgeIcon: Scale,
    badge: "Pensé pour les professions libérales",
    h1a: "Concentrez-vous sur vos clients.",
    h1b: "Pas sur l'administratif.",
    sub: "OdocPilot prépare vos notes d'honoraires et vos factures, classe vos documents et gère vos rendez-vous — pendant que vous exercez votre métier.",
    painsTitle: "Ce qui grignote votre temps",
    pains: [
      "Les notes d'honoraires rédigées à la main, en double",
      "Les documents clients éparpillés et difficiles à retrouver",
      "Les rendez-vous et échéances qu'on suit de tête",
      "La conformité (RGPD, facture électronique) qui inquiète",
    ],
    wins: [
      { icon: ReceiptText, title: "Notes d'honoraires & factures simples", desc: "Créez et envoyez des documents propres en quelques clics, prêts à signer et à régler en ligne." },
      { icon: FolderInput, title: "Vos documents, classés tout seuls", desc: "Photographiez ou importez : tout est lu, rangé et retrouvable en une recherche. Fini les dossiers perdus." },
      { icon: CalendarClock, title: "Rendez-vous & échéances maîtrisés", desc: "Agenda, rappels automatiques, alertes sur ce qui compte. Vous n'oubliez plus rien." },
    ],
    testimonial: { quote: "« Mes notes d'honoraires se font en deux clics et mes dossiers sont enfin rangés au même endroit. J'ai gagné un temps fou. »", name: "Maître D. · Profession libérale, Lyon · bêta-testeur" },
    ctaA: "Je teste gratuitement",
    ctaB: "Voir le tarif",
    seoTitle: "Logiciel de gestion pour professions libérales | OdocPilot",
    seoDesc: "OdocPilot gère notes d'honoraires, factures, documents et rendez-vous pour les professions libérales, avec un assistant IA. Hébergé en France, conforme RGPD, essai gratuit 14 jours.",
  },
  "cabinets-comptables": {
    slug: "cabinets-comptables",
    badgeIcon: Calculator,
    badge: "Pensé pour les cabinets comptables",
    h1a: "Des données clients propres.",
    h1b: "Beaucoup moins de relances.",
    sub: "OdocPilot aide vos clients TPE/PME à centraliser factures et documents — et vous récupérez des données à jour, prêtes à exploiter, sans courir après les pièces.",
    painsTitle: "La galère qu'on connaît tous",
    pains: [
      "Courir après les pièces manquantes chaque mois",
      "Ressaisir des documents reçus en vrac par mail",
      "Jongler entre les outils de chaque client",
      "Préparer la conformité facture électronique 2026",
    ],
    wins: [
      { icon: Users, title: "Tous vos clients au même endroit", desc: "Un espace clair par client, des données structurées, fini le multi-outils ingérable." },
      { icon: FolderInput, title: "Les pièces arrivent propres", desc: "Vos clients photographient, OdocPilot classe et extrait : vous récupérez des données à jour, sans relancer." },
      { icon: FileCheck2, title: "Export FEC & conformité", desc: "Données exportables proprement, et accompagnement vers la facture électronique 2026 pour vos clients." },
    ],
    testimonial: { quote: "« Mes clients déposent leurs pièces au fil de l'eau, je récupère des données propres. Je passe moins de temps à relancer, plus à conseiller. »", name: "Karine M. · Experte-comptable, Bordeaux · partenaire bêta" },
    ctaA: "Devenir partenaire",
    ctaB: "Voir le tarif",
    seoTitle: "OdocPilot pour les cabinets comptables — données clients propres",
    seoDesc: "OdocPilot aide vos clients TPE/PME à centraliser leurs pièces, et vous récupérez des données propres et à jour. Moins de relances, export FEC, conforme facture 2026. Hébergé en France.",
  },
};

export default function MetierPage({ slug }: { slug: string }) {
  const m = METIERS[slug];
  if (!m) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold text-foreground">Page introuvable</h1>
        <Link to="/" className="mt-4 inline-block text-primary font-semibold">Retour à l'accueil →</Link>
      </div>
    );
  }
  const Badge = m.badgeIcon;
  return (
    <div className="flex flex-col items-center">
      <SEOHead title={m.seoTitle} description={m.seoDesc} canonical={`/${m.slug}`} />

      {/* HERO */}
      <section className="w-full relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 -left-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 text-center">
          <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5">
              <Badge className="h-3.5 w-3.5" /> {m.badge}
            </span>
          </MotionDiv>
          <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.6 }}>
            <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] text-foreground">
              {m.h1a} <span className="bg-gradient-cta bg-clip-text text-transparent">{m.h1b}</span>
            </h1>
          </MotionDiv>
          <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.6 }}>
            <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">{m.sub}</p>
          </MotionDiv>
          <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.5 }}>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <a href={SIGNUP} target="_blank" rel="noopener noreferrer" data-umami-event="cta-essai-gratuit">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-cta text-primary-foreground font-bold px-7 py-6 text-base shadow-lg shadow-primary/20 hover:opacity-95">{m.ctaA} <ArrowRight className="ml-2 h-5 w-5" /></Button>
              </a>
              <Link to="/pricing"><Button size="lg" variant="outline" className="w-full sm:w-auto px-7 py-6 text-base">{m.ctaB}</Button></Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">14 jours gratuits · Sans carte bancaire · Hébergé en France</p>
          </MotionDiv>
        </div>
      </section>

      {/* PROBLÈME */}
      <section className="w-full bg-secondary/60 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{m.painsTitle}</h2>
          <ul className="mt-8 grid sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto">
            {m.pains.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-xl bg-card border border-border p-4 text-sm text-foreground"><span className="text-primary">✗</span>{p}</li>
            ))}
          </ul>
          <p className="mt-8 text-xl font-bold text-foreground">Ce n'est pas une fatalité. Il vous manquait juste le bon outil.</p>
        </div>
      </section>

      {/* CE QU'ODOCPILOT FAIT */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Ce qu'OdocPilot fait pour vous</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {m.wins.map((w, i) => {
            const Icon = w.icon;
            return (
              <MotionDiv key={w.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.45 }} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
                <h3 className="mt-4 font-bold text-lg text-foreground">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
              </MotionDiv>
            );
          })}
        </div>
      </section>

      {/* FACTURE 2026 */}
      <section className="w-full bg-secondary/60 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5"><ReceiptText className="h-3.5 w-3.5" /> Réforme 2026</span>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold leading-tight text-foreground">La facture électronique, sans prise de tête</h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">Dès le 1ᵉʳ septembre 2026, toute entreprise assujettie à la TVA devra recevoir ses factures au format électronique ; l'émission suivra en 2027. OdocPilot génère vos factures au format légal Factur-X et vous accompagne pas à pas vers la conformité.</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            {["Factur-X conforme", "Accompagnement en français", "Données et IA en France"].map((t) => (
              <li key={t} className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-foreground"><Check className="h-4 w-4 text-primary" />{t}</li>
            ))}
          </ul>
          <div className="mt-8">
            <Link to="/diagnostic" data-umami-event="cta-diagnostic"><Button size="lg" variant="outline">Vérifier ma conformité (3 min) <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGE */}
      <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="rounded-3xl border border-border bg-card p-9 shadow-card">
          <Quote className="h-7 w-7 text-primary/40 mx-auto" />
          <p className="mt-3 text-xl text-foreground leading-relaxed">{m.testimonial.quote}</p>
          <p className="mt-5 text-sm text-muted-foreground">{m.testimonial.name}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">Prêt à vous simplifier la vie ?</h2>
        <p className="mt-5 text-lg text-muted-foreground">Essayez OdocPilot 14 jours, sans carte bancaire.</p>
        <div className="mt-8 flex justify-center">
          <a href={SIGNUP} data-umami-event="cta-essai-gratuit">
            <Button size="lg" className="bg-gradient-cta text-primary-foreground text-base font-bold px-8 py-6 shadow-lg shadow-primary/20 hover:opacity-95">{m.ctaA} <ArrowRight className="ml-2 h-5 w-5" /></Button>
          </a>
        </div>
        <TrustCredentials className="mt-10" />
      </section>
    </div>
  );
}
