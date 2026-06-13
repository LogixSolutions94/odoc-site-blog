import { Link } from "react-router-dom";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { BackButton } from "@/components/BackButton";
import { TrustCredentials } from "@/components/TrustCredentials";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Check, CheckCircle2, Shield, FileText,
  Brain, Search, BadgeCheck, Globe, FileOutput,
  PlugZap, Clock, Calendar, ChevronRight, MapPin, Sparkles,
} from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
// Lead magnets (pages construites en parallèle) : le funnel /e-facture y mène.
const DIAGNOSTIC = "/diagnostic";
const GENERATEUR = "/generateur-factur-x";

const heroFade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: [0.32, 0.72, 0, 1] as const },
});
const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.45 },
});

// ─── DONNÉES ────────────────────────────────────────────────────────────────

const LOIS = [
  {
    icon: PlugZap,
    date: "15/10/2024",
    titre: "Fin du portail public gratuit",
    loi: "Décision DGFiP — abandon du Portail Public de Facturation",
    detail:
      "L'État a abandonné le Portail Public de Facturation : passer par une plateforme agréée (PA) privée devient le chemin obligatoire pour émettre, recevoir et transmettre ses factures.",
    badge: "Acté",
    tone: "muted" as const,
  },
  {
    icon: Calendar,
    date: "01/09/2026",
    titre: "Réception obligatoire — toutes les entreprises",
    loi: "Ordonnance n°2021-1190 · Décret n°2022-1299",
    detail:
      "Toute entreprise assujettie à la TVA (y compris les micro-entreprises) doit pouvoir recevoir ses factures fournisseurs au format électronique structuré via une plateforme agréée.",
    badge: "Échéance n°1",
    tone: "primary" as const,
  },
  {
    icon: Calendar,
    date: "01/09/2027",
    titre: "Émission + e-reporting — TPE / PME",
    loi: "Ordonnance n°2021-1190 · Décret n°2022-1299",
    detail:
      "Les TPE, PME et micro-entreprises doivent à leur tour émettre leurs factures au format électronique et transmettre leur e-reporting (données de transaction et de paiement).",
    badge: "Échéance n°2",
    tone: "primary" as const,
  },
  {
    icon: Globe,
    date: "Format légal",
    titre: "Factur-X — format européen EN 16931",
    loi: "Directive UE 2014/55/UE · norme EN 16931",
    detail:
      "Une facture électronique n'est pas un PDF par e-mail : c'est un fichier structuré (Factur-X = PDF lisible + données XML intégrées). OdocPilot génère vos factures directement à ce format conforme, sans paramétrage.",
    badge: "Disponible",
    tone: "muted" as const,
  },
];

const FEATURES = [
  {
    icon: FileText,
    title: "Génération Factur-X conforme",
    desc: "Vos factures sortent au format Factur-X (PDF/A-3 + données structurées) attendu par la réforme, prêtes à télécharger — sans paramétrage technique.",
    soon: false,
  },
  {
    icon: Brain,
    title: "Lecture IA de vos factures reçues",
    desc: "Déposez une facture : l'IA en extrait le fournisseur, le montant, la TVA et l'échéance, et propose le compte. Vous validez d'un clic — rien n'est engagé sans vous.",
    soon: false,
  },
  {
    icon: Search,
    title: "Recherche en langage naturel",
    desc: "« Toutes les factures EDF de 2025 » en français courant : la GED retrouve vos documents instantanément, sans dossier à créer.",
    soon: false,
  },
  {
    icon: FileOutput,
    title: "Export FEC pour l'expert-comptable",
    desc: "Un Fichier des Écritures Comptables propre, exporté en un clic, à transmettre à votre cabinet sans manipulation.",
    soon: false,
  },
  {
    icon: Brain,
    title: "Copilote qui répond sur vos données",
    desc: "« Qui me doit de l'argent ce mois-ci ? » : réponse claire, sourcée sur vos documents, et action préparée que vous validez.",
    soon: false,
  },
  {
    icon: Clock,
    title: "Transmission & rapprochement bancaire",
    desc: "Transmission via plateforme agréée partenaire et rapprochement bancaire : raccordement en cours, livrés avant les échéances.",
    soon: true,
  },
];

const COMPARISON = [
  { feature: "Génération Factur-X (PDF/A-3 + XML)",      odoc: true,      excel: "Non conforme", other: true },
  { feature: "Lecture IA des factures reçues",           odoc: true,      excel: false,          other: false },
  { feature: "Recherche en langage naturel",             odoc: true,      excel: false,          other: false },
  { feature: "Export FEC pour l'expert-comptable",       odoc: true,      excel: false,          other: true },
  { feature: "Données et IA hébergées en France",        odoc: true,      excel: "—",            other: "Variable" },
  { feature: "Vous gardez le dernier mot (validation)",  odoc: true,      excel: "—",            other: false },
  { feature: "Prix mensuel (par entreprise)",            odoc: "dès 49€", excel: "—",            other: "Variable" },
];

const FAQ = [
  {
    q: "Qui est concerné par la facturation électronique, et à partir de quand ?",
    a: "Toute entreprise française assujettie à la TVA, y compris les micro-entreprises. La réception de factures au format électronique devient obligatoire au 1ᵉʳ septembre 2026 ; l'émission et l'e-reporting suivent au 1ᵉʳ septembre 2027 pour les TPE, PME et micro-entreprises. Les factures transiteront par une plateforme agréée (PA), au format Factur-X, UBL ou CII.",
  },
  {
    q: "OdocPilot transmet-il déjà mes factures à l'administration ?",
    a: "Soyons transparents : aujourd'hui, OdocPilot génère vos factures au format légal Factur-X et prépare votre conformité. La transmission via une plateforme agréée partenaire est en cours de raccordement et sera prête avant l'échéance. Nous préférons vous dire précisément ce qui est actif plutôt que de promettre une transmission qui n'est pas encore branchée.",
  },
  {
    q: "Que risque une entreprise non conforme ?",
    a: "La loi de finances 2026 prévoit une amende de 50 € par facture émise dans un format non conforme et de 500 € par manquement à l'e-reporting, après une période de tolérance. Au-delà des amendes, une facturation non conforme complique les contrôles et la récupération de la TVA.",
  },
  {
    q: "L'IA fait-elle ma comptabilité toute seule ?",
    a: "Non, et c'est un choix assumé. L'IA prépare le travail : elle lit vos factures, en extrait les informations, classe vos documents et prépare vos relances. Mais rien n'est validé, envoyé ni comptabilisé sans vous. Vous validez d'un clic, ou vous corrigez. Vous gardez toujours le dernier mot.",
  },
  {
    q: "Est-ce compatible avec mon expert-comptable ?",
    a: "Oui. OdocPilot ne remplace pas votre expert-comptable : il prépare des données propres et classées. Vous exportez votre FEC en un clic pour le lui transmettre. L'outil s'intègre à votre organisation au lieu de la bousculer.",
  },
  {
    q: "Mes données sont-elles en sécurité ?",
    a: "Vos documents sont hébergés en France, et l'intelligence artificielle qui les analyse — Mistral, un modèle français — l'est également : aucun transfert vers des services américains. OdocPilot est conforme au RGPD, aligné sur l'AI Act, et s'inscrit dans une démarche Numérique Responsable et d'IA frugale.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://odocpilot.com/e-facture",
      name: "Facturation électronique 2026/2027 — préparez votre conformité avec OdocPilot",
      description:
        "Réception obligatoire au 1ᵉʳ septembre 2026, émission en 2027 : OdocPilot prépare votre conformité e-facture. Génération Factur-X, lecture IA des factures, export FEC. Données et IA hébergées en France.",
      inLanguage: "fr-FR",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://odocpilot.com" },
        { "@type": "ListItem", position: 2, name: "Conformité facture électronique", item: "https://odocpilot.com/e-facture" },
      ],
    },
  ],
};

// ─── PAGE ───────────────────────────────────────────────────────────────────

export default function EFacturePage() {
  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Facturation électronique 2026/2027 : préparez votre conformité | OdocPilot"
        description="Réception obligatoire au 1ᵉʳ septembre 2026, émission en 2027 : OdocPilot prépare votre conformité e-facture. Génération Factur-X, lecture IA des factures, export FEC. L'IA prépare, vous validez. Données et IA hébergées en France. Essai 14 jours sans carte bancaire."
        canonical="/e-facture"
        jsonLd={jsonLd}
      />

      <BackButton to="/" label="← Retour à l'accueil" />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="w-full relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/3 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 text-center">
          <MotionDiv {...heroFade(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <Clock className="h-3.5 w-3.5" /> Réception obligatoire au 1ᵉʳ septembre 2026 — êtes-vous prêt ?
            </span>
          </MotionDiv>

          <MotionDiv {...heroFade(0.08)}>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.3rem] font-extrabold tracking-tight leading-[1.07] text-foreground">
              La facturation électronique devient obligatoire.{" "}
              <span className="bg-gradient-cta bg-clip-text text-transparent">OdocPilot vous y prépare, vous validez en un clic.</span>
            </h1>
          </MotionDiv>

          <MotionDiv {...heroFade(0.16)}>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
              Dès le <strong className="text-foreground">1ᵉʳ septembre 2026</strong>, toute entreprise assujettie à la TVA devra recevoir ses factures au format électronique structuré via une <strong className="text-foreground">plateforme agréée</strong> ; l'émission suivra en 2027. OdocPilot génère vos factures au format légal <strong className="text-foreground">Factur-X</strong>, lit et classe vos factures reçues, et prépare votre administratif — pendant que vous gardez la décision finale.
            </p>
          </MotionDiv>

          <MotionDiv {...heroFade(0.24)}>
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
              {["Factur-X conforme", "Lecture IA des factures", "Export FEC en 1 clic", "Données et IA en France", "L'IA prépare, vous validez"].map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-primary" /> {b}
                </span>
              ))}
            </div>
          </MotionDiv>

          <MotionDiv {...heroFade(0.32)}>
            <div className="mt-8 flex flex-col items-center sm:flex-row sm:justify-center gap-3">
              <Link to={DIAGNOSTIC} data-umami-event="cta-efacture-diagnostic-hero">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-cta text-primary-foreground font-bold px-8 py-6 text-base shadow-lg shadow-primary/20 hover:opacity-95">
                  <Sparkles className="mr-2 h-5 w-5" /> Vérifier ma conformité (3 min)
                </Button>
              </Link>
              <Link to={GENERATEUR} data-umami-event="cta-efacture-generateur-hero">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-base">
                  Générer une facture Factur-X <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1"><Check className="h-3 w-3 text-primary" /> Gratuit</span>
              <span className="inline-flex items-center gap-1"><Check className="h-3 w-3 text-primary" /> Sans carte bancaire</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" /> Données en France</span>
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* ── STATS (faits réglementaires) ─────────────────────────────── */}
      <section className="w-full py-10 border-y border-border bg-secondary/60">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "01/09/2026", label: "Réception obligatoire (toutes entreprises)" },
            { val: "50 €", label: "Amende par facture non conforme" },
            { val: "500 €", label: "Par manquement à l'e-reporting" },
            { val: "100 % France", label: "Données et IA hébergées en France" },
          ].map((s, i) => (
            <MotionDiv key={s.label} {...inView(i * 0.08)}>
              <p className="text-2xl sm:text-3xl font-extrabold tabular-nums bg-gradient-cta bg-clip-text text-transparent">{s.val}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-snug">{s.label}</p>
            </MotionDiv>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Source :{" "}
          <a href="https://www.impots.gouv.fr/professionnel/facturation-electronique" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">impots.gouv.fr</a>{" "}· loi de finances 2026 · calendrier à jour juin 2026.
        </p>
      </section>

      {/* ── CALENDRIER & OBLIGATIONS ─────────────────────────────────── */}
      <section className="w-full py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv {...inView(0)} className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Le calendrier officiel</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Ce que la réforme impose — <span className="bg-gradient-cta bg-clip-text text-transparent">et comment OdocPilot vous y prépare.</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Chaque échéance a une date. OdocPilot vous prépare à chacune, en distinguant toujours ce qui est actif de ce qui arrive.
            </p>
          </MotionDiv>

          <div className="grid gap-5 sm:grid-cols-2">
            {LOIS.map((loi, i) => {
              const Icon = loi.icon;
              const isPrimary = loi.tone === "primary";
              return (
                <MotionDiv key={loi.titre} {...inView(i * 0.08)} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isPrimary ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted text-muted-foreground border border-border"}`}>
                      {loi.badge}
                    </span>
                  </div>
                  <p className="text-2xl font-extrabold tracking-tight tabular-nums text-primary">{loi.date}</p>
                  <h3 className="mt-1 font-bold text-foreground">{loi.titre}</h3>
                  <p className="mt-1 text-xs font-mono text-muted-foreground/70">{loi.loi}</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{loi.detail}</p>
                </MotionDiv>
              );
            })}
          </div>

          {/* Encart transmission honnête */}
          <MotionDiv {...inView(0.1)} className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
            <Shield className="h-5 w-5 flex-shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">En toute transparence :</strong> aujourd'hui, OdocPilot génère vos factures au format légal Factur-X et prépare votre conformité. La <strong className="text-foreground">transmission via une plateforme agréée partenaire</strong> est en cours de raccordement — vous serez prêt le jour J.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section className="w-full py-24 bg-secondary/60 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv {...inView(0)} className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Ce qu'OdocPilot fait pour votre conformité</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Des fonctions réelles, <span className="bg-gradient-cta bg-clip-text text-transparent">montrées plutôt que promises.</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Ce que l'outil fait aujourd'hui — la transmission via plateforme agréée et le rapprochement bancaire sont annoncés honnêtement comme « bientôt ».
            </p>
          </MotionDiv>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <MotionDiv key={f.title} {...inView(i * 0.06)}
                  className={`relative rounded-2xl border bg-card p-5 shadow-card ${f.soon ? "border-dashed" : "border-border"}`}>
                  <span className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-semibold ${f.soon ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary border border-primary/30"}`}>
                    {f.soon ? "Bientôt" : "Disponible"}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground leading-snug">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARATIF ───────────────────────────────────────────────── */}
      <section className="w-full py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv {...inView(0)} className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Comparatif</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">OdocPilot, le tableur et les logiciels classiques</h2>
            <p className="mt-3 text-muted-foreground">Ce qui change concrètement pour préparer l'échéance 2026.</p>
          </MotionDiv>

          <MotionDiv {...inView(0.1)} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="grid grid-cols-4 border-b border-border bg-primary/5 py-3 text-center text-xs font-bold">
              <div className="pl-5 text-left text-foreground">Critère</div>
              <div className="text-primary">OdocPilot</div>
              <div className="text-muted-foreground">Tableur / PDF</div>
              <div className="text-muted-foreground">Logiciels classiques</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-4 items-center border-b border-border py-3 text-center text-xs last:border-0 ${i % 2 === 0 ? "" : "bg-secondary/40"}`}>
                <div className="pl-5 text-left font-medium text-foreground">{row.feature}</div>
                <div className="font-semibold text-primary">
                  {typeof row.odoc === "string" ? row.odoc : row.odoc ? <CheckCircle2 className="mx-auto h-4 w-4 text-primary" /> : <span className="text-muted-foreground">✗</span>}
                </div>
                <div>
                  {typeof row.excel === "string" ? <span className="text-muted-foreground">{row.excel}</span> : row.excel ? <CheckCircle2 className="mx-auto h-4 w-4 text-primary" /> : <span className="text-muted-foreground">✗</span>}
                </div>
                <div>
                  {typeof row.other === "string" ? <span className="text-muted-foreground">{row.other}</span> : row.other ? <CheckCircle2 className="mx-auto h-4 w-4 text-primary" /> : <span className="text-muted-foreground">✗</span>}
                </div>
              </div>
            ))}
          </MotionDiv>
        </div>
      </section>

      {/* ── FAQ SEO ──────────────────────────────────────────────────── */}
      <section className="w-full py-24 bg-secondary/60 border-y border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv {...inView(0)} className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Vos questions, nos réponses franches</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">La réforme e-facture, sans zone d'ombre</h2>
            <p className="mt-3 text-muted-foreground">Les vraies questions que se posent les dirigeants.</p>
          </MotionDiv>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <MotionDiv key={item.q} {...inView(i * 0.06)} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h3 className="flex items-start gap-2 font-bold text-foreground">
                  <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  {item.q}
                </h3>
                <p className="mt-2 pl-6 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </MotionDiv>
            ))}
          </div>

          <TrustCredentials className="mt-10" />
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section className="w-full py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <MotionDiv {...inView(0)} className="rounded-3xl bg-gradient-cta p-10 sm:p-16 shadow-elevated">
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-primary-foreground">
              Prenez de l'avance sur la réforme 2026.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/85">
              Vérifiez votre conformité en 3 minutes, générez vos factures au format légal Factur-X, et laissez l'IA préparer votre administratif sur vos propres documents — vous gardez le dernier mot. Gratuit, sans carte bancaire.
            </p>
            <div className="mt-8 flex flex-col items-center sm:flex-row sm:justify-center gap-3">
              <Link to={DIAGNOSTIC} data-umami-event="cta-efacture-diagnostic-final">
                <Button size="lg" className="w-full sm:w-auto bg-background text-foreground hover:bg-background/90 px-8 py-6 font-bold shadow-lg">
                  <Sparkles className="mr-2 h-5 w-5 text-primary" /> Vérifier ma conformité (3 min)
                </Button>
              </Link>
              <Link to={GENERATEUR} data-umami-event="cta-efacture-generateur-final">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6">
                  Générer ma facture Factur-X <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <p className="mt-4 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-primary-foreground/80">
              <span className="inline-flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Sans carte bancaire</span>
              <span className="inline-flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Sans engagement</span>
              <span className="inline-flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Données en France</span>
            </p>
          </MotionDiv>
        </div>
      </section>
    </div>
  );
}
