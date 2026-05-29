import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, CheckCircle, Shield, Zap, FileText,
  Brain, Receipt, Lock, BadgeCheck, Globe, TrendingUp,
  AlertTriangle, Clock, Euro, Building2, Star, Scale,
  Calendar, ChevronRight,
} from "lucide-react";

const ORANGE = "hsl(30 100% 50%)";
const PETRIOL = "hsl(201 85% 22%)";
const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: [0.32, 0.72, 0, 1] as const },
});

// ─── DONNÉES ────────────────────────────────────────────────────────────────

const LOIS = [
  {
    icon: Scale,
    date: "Sept. 2026",
    titre: "Obligation e-facture — Grandes entreprises",
    loi: "Ordonnance n°2021-1190 du 15 sept. 2021 + Décret n°2022-1299",
    detail:
      "À partir du 1er septembre 2026, toutes les grandes entreprises françaises doivent émettre leurs factures B2B en format électronique structuré via une Plateforme de Dématérialisation Partenaire (PDP). Odoc est prêt.",
    urgence: "⚠️ Dans 5 mois",
    urgenceColor: "#ef4444",
  },
  {
    icon: Calendar,
    date: "2027",
    titre: "Extension aux ETI & PME",
    loi: "Décret n°2022-1299 du 7 octobre 2022",
    detail:
      "En 2027, l'obligation s'étend aux ETI et PME. Toute entreprise assujettie à la TVA devra émettre et recevoir des factures électroniques au format Factur-X, UBL ou CII. Anticipez maintenant, évitez les pénalités.",
    urgence: "📅 2027",
    urgenceColor: ORANGE,
  },
  {
    icon: Globe,
    date: "En vigueur",
    titre: "Directive européenne 2014/55/UE",
    loi: "Directive UE 2014/55/UE + Norme EN 16931",
    detail:
      "La norme européenne EN 16931 définit le format sémantique de la facture électronique. La génération native Factur-X/UBL 2.1/CII conforme EN 16931 est en cours de développement (échéance produit Q3 2026, en amont de l'obligation française).",
    urgence: "🚧 En développement — Q3 2026",
    urgenceColor: ORANGE,
  },
  {
    icon: Shield,
    date: "En vigueur",
    titre: "Archivage à valeur probante (référentiel NF Z42-013)",
    loi: "Norme AFNOR NF Z42-013 — référentiel",
    detail:
      "Odoc applique les principes de la norme NF Z42-013 (empreinte SHA-256, journal d'événements, traçabilité) pour ses archives. La certification officielle NF Z42-013 par un organisme accrédité n'est pas encore obtenue — projet inscrit à la roadmap 2026.",
    urgence: "🚧 Certification roadmap 2026",
    urgenceColor: ORANGE,
  },
];

const FEATURES = [
  {
    icon: Brain,
    title: "Extraction IA — montants, SIRET, IBAN, dates",
    desc: "L'IA lit et extrait automatiquement : montant HT/TVA/TTC, SIRET, IBAN, numéro de facture, date d'échéance, références. Réduit drastiquement la saisie manuelle.",
    badge: "🧠 IA",
  },
  {
    icon: FileText,
    title: "Lecture/détection Factur-X",
    desc: "Lecture et détection des formats Factur-X (PDF/A-3) dès aujourd'hui. Génération native Factur-X, UBL 2.1 et UN/CEFACT CII prévue Q3 2026, en amont de l'obligation.",
    badge: "📄 2026",
  },
  {
    icon: Lock,
    title: "Empreinte SHA-256 & horodatage",
    desc: "Chaque facture reçoit une empreinte SHA-256 horodatée à la seconde, utilisée pour le contrôle d'intégrité et le journal d'événements.",
    badge: "🔒 Crypto",
  },
  {
    icon: AlertTriangle,
    title: "Détection automatique par règles métier",
    desc: "Détection automatique des doublons, montants anormaux, OCR à faible confiance, TVA incohérente. Alerte avant tout paiement.",
    badge: "⚠️ Anti-fraude",
  },
  {
    icon: BadgeCheck,
    title: "Workflow de validation configurable",
    desc: "Circuit comptable → manager → DAF configurable en 2 clics. Approbation mobile, délégations, historique d'audit complet, notifications push.",
    badge: "✅ Workflow",
  },
  {
    icon: Building2,
    title: "Portail fournisseur sécurisé",
    desc: "Lien unique à envoyer à vos fournisseurs. Ils déposent leurs factures directement dans Odoc, au bon format légal, sans accès à vos données.",
    badge: "🔗 Portail",
  },
  {
    icon: TrendingUp,
    title: "Analytics TVA & export FEC",
    desc: "Tableaux de bord TVA collectée/déductible, charges par catégorie, trésorerie prévisionnelle. Export FEC natif en 1 clic pour votre expert-comptable.",
    badge: "📊 Analytics",
  },
  {
    icon: Zap,
    title: "Rapprochement par import CSV de relevés",
    desc: "Importez vos relevés bancaires au format CSV : Odoc rapproche vos factures, détecte les impayés et suit les encaissements. Open banking prévu en 2026.",
    badge: "⚡ Auto",
  },
];

const COMPARISON = [
  { feature: "Extraction automatique IA",           odoc: true,  excel: false, other: false },
  { feature: "Format Factur-X / UBL / CII (2026)", odoc: "Q3 2026", excel: false, other: false },
  { feature: "Archivage SHA-256 + journal d'événements", odoc: true,  excel: false, other: true  },
  { feature: "Directive UE 2014/55/UE — EN 16931",  odoc: "Q3 2026", excel: false, other: false },
  { feature: "Empreinte SHA-256 horodatée",          odoc: true,  excel: false, other: true  },
  { feature: "Détection automatique par règles",     odoc: true,  excel: false, other: false },
  { feature: "Portail fournisseur intégré",          odoc: true,  excel: false, other: false },
  { feature: "Export FEC natif",                     odoc: true,  excel: false, other: true  },
  { feature: "Couplé GED + RH + Projets",            odoc: true,  excel: false, other: false },
  { feature: "Prix mensuel (PME 3 utilisateurs)",   odoc: "89€", excel: "0€ (risque pénal)", other: "120€+" },
];

const FAQ = [
  {
    q: "Qu'est-ce que la réforme de la facturation électronique obligatoire 2026 ?",
    a: "L'ordonnance n°2021-1190 et le décret n°2022-1299 rendent obligatoire la facturation électronique B2B pour toutes les entreprises françaises assujetties à la TVA. Les grandes entreprises sont concernées dès septembre 2026, les PME et ETI en 2027. Les factures devront être émises via une Plateforme de Dématérialisation Partenaire (PDP) au format Factur-X, UBL ou CII.",
  },
  {
    q: "Odoc est-il reconnu comme Plateforme de Dématérialisation Partenaire (PDP) ?",
    a: "Odoc s'intègre avec les PDP certifiées et prépare sa propre certification. En attendant, vous pouvez utiliser Odoc pour gérer, archiver et valider vos factures, puis les soumettre via une PDP partenaire. Notre roadmap inclut la certification PDP complète avant septembre 2026.",
  },
  {
    q: "Que risque une entreprise qui n'est pas conforme en 2026 ?",
    a: "Les sanctions prévues par le Code général des impôts peuvent atteindre 15€ par facture non conforme, avec un plafond de 15 000€ par an. Au-delà des amendes, le risque de redressement fiscal et de perte de déductibilité de TVA est réel.",
  },
  {
    q: "Qu'est-ce que la norme NF Z42-013 et pourquoi est-elle importante ?",
    a: "C'est la norme AFNOR qui régit l'archivage électronique à valeur probante. Une facture archivée avec Odoc selon cette norme est juridiquement équivalente à un original papier. Elle est opposable devant un tribunal et lors d'un contrôle fiscal.",
  },
  {
    q: "La directive européenne 2014/55/UE concerne-t-elle les PME françaises ?",
    a: "Oui. Elle s'applique à toutes les entreprises qui facturent des entités publiques (B2G) et prépare le terrain pour le B2B. La norme EN 16931 qu'elle impose est identique aux formats exigés par la réforme française 2026. Se conformer maintenant vous prépare aux deux.",
  },
  {
    q: "Odoc peut-il remplacer mon logiciel de facturation actuel ?",
    a: "Oui. Odoc intègre la facturation IA dans un OS complet : documents, RH, projets, messagerie, analytics. Pour le même prix qu'un logiciel de facturation spécialisé, vous obtenez 11 modules métier. Aucune migration compliquée — import en 1 clic depuis Excel ou votre logiciel actuel.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "E-Facture — Facturation Électronique Obligatoire 2026 | Odoc",
  description:
    "Odoc automatise votre e-facture : conforme ordonnance 2021-1190, décret 2022-1299, directive UE 2014/55/UE, NF Z42-013. Prêt pour l'obligation 2026.",
  mainEntity: {
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
};

// ─── PAGE ───────────────────────────────────────────────────────────────────

export default function EFacturePage() {
  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="E-Facture Obligatoire 2026 — Conformité NF Z42-013 & Directive UE | Odoc"
        description="Préparez votre entreprise à l'obligation de facturation électronique 2026 (ordonnance 2021-1190). Odoc automatise vos e-factures : Factur-X, UBL, NF Z42-013, SHA-256. Essai gratuit."
        canonical="/e-facture"
        jsonLd={jsonLd}
      />

      <BackButton to="/" label="← Retour à l'accueil" />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="w-full relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px] opacity-15" style={{ background: ORANGE }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10" style={{ background: PETRIOL }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 text-center z-10">

          {/* Urgence bar */}
          <motion.div {...fade(0)}>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold mb-6 animate-pulse"
              style={{ background: "#ef444418", border: "1px solid #ef444444", color: "#ef4444" }}
            >
              ⚠️ Obligation e-facture B2B : septembre 2026 — Êtes-vous prêt ?
            </div>
          </motion.div>

          <motion.div {...fade(0.08)}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[1.05] text-foreground">
              E-Facture obligatoire en 2026.{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Odoc vous rend conforme aujourd'hui.
              </span>
            </h1>
          </motion.div>

          <motion.div {...fade(0.16)}>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
              L'<strong>ordonnance n°2021-1190</strong> et le <strong>décret n°2022-1299</strong> imposent
              la facturation électronique B2B dès 2026. Odoc automatise vos{" "}
              <strong>traitement de vos factures électroniques</strong> — extraction IA,
              empreinte SHA-256 horodatée, journal d'événements. Génération Factur-X/UBL native prévue Q3 2026.
            </p>
          </motion.div>

          <motion.div {...fade(0.24)}>
            <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground font-medium">
              {[
                "🔐 Empreinte SHA-256 + journal d'événements",
                "🇪🇺 EN 16931 / UBL 2.1 — Q3 2026",
                "🇫🇷 Factur-X lecture/détection",
                "🔒 SHA-256 horodaté",
                "🛡️ RGPD — hébergé France",
                "⚡ Setup 2 minutes",
              ].map((b) => <span key={b}>{b}</span>)}
            </div>
          </motion.div>

          <motion.div {...fade(0.32)}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`${APP_URL}/auth`} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base px-10 py-6 font-bold text-white transition-all duration-200 hover:scale-[1.03]"
                  style={{
                    background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                    boxShadow: `0 0 32px rgba(249,115,22,0.45)`,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 48px rgba(249,115,22,0.65)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 32px rgba(249,115,22,0.45)"; }}
                >
                  Me mettre en conformité gratuitement <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-6 border-white/20 hover:bg-white/10">
                  Voir les tarifs →
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              <CheckCircle className="inline h-3 w-3 mr-1 text-green-500" />
              Aucune carte bancaire ·{" "}
              <CheckCircle className="inline h-3 w-3 mr-1 text-green-500" />
              Conforme dès le premier jour ·{" "}
              <CheckCircle className="inline h-3 w-3 mr-1 text-green-500" />
              Support humain inclus
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <section className="w-full py-10 border-y border-border" style={{ background: `linear-gradient(90deg, ${ORANGE}08, ${PETRIOL}08)` }}>
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "15€",    label: "Amende par facture non conforme" },
            { val: "15 000€", label: "Plafond annuel de pénalités" },
            { val: "Sept. 2026", label: "Échéance grandes entreprises" },
            { val: "−75%",   label: "Temps traitement factures avec Odoc" },
          ].map((s, i) => (
            <motion.div key={s.label} {...fade(i * 0.08)}>
              <p className="text-2xl sm:text-3xl font-extrabold" style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>{s.val}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LOIS & OBLIGATIONS ───────────────────────────────────────── */}
      <section className="w-full py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fade(0)} className="text-center mb-14">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold mb-4"
              style={{ border: "1px solid #ef444444", background: "#ef444410", color: "#ef4444" }}
            >
              ⚖️ Obligations légales en vigueur
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Ce que la loi impose à votre entreprise —
              <span style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}> et comment Odoc vous protège.</span>
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
              Ne soyez pas pris au dépourvu. Chaque texte de loi a une échéance. Odoc vous prépare à tous.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {LOIS.map((loi, i) => {
              const Icon = loi.icon;
              return (
                <motion.div
                  key={loi.titre}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 rounded-xl border border-border bg-card hover:scale-[1.01] transition-all duration-300"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${ORANGE}14` }}>
                      <Icon className="h-5 w-5" style={{ color: ORANGE }} />
                    </div>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: `${loi.urgenceColor}18`, color: loi.urgenceColor, border: `1px solid ${loi.urgenceColor}44` }}
                    >
                      {loi.urgence}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{loi.titre}</h3>
                  <p className="mt-1 text-xs font-mono text-muted-foreground opacity-70">{loi.loi}</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{loi.detail}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold" style={{ color: ORANGE }}>
                    <CheckCircle className="h-3.5 w-3.5" /> Odoc vous couvre
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section className="w-full py-24 sm:py-32" style={{ background: `${PETRIOL}06` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fade(0)} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Tout ce que votre logiciel actuel{" "}
              <span style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>ne fait pas encore.</span>
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
              Extraction IA, conformité 2026, anti-fraude, portail fournisseur, analytics — en un seul outil.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className="relative p-5 rounded-xl border border-border bg-card hover:scale-[1.02] transition-all duration-300"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                >
                  <span
                    className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${ORANGE}18`, color: ORANGE, border: `1px solid ${ORANGE}33` }}
                  >
                    {f.badge}
                  </span>
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${ORANGE}14` }}>
                    <Icon className="h-5 w-5" style={{ color: ORANGE }} />
                  </div>
                  <h3 className="text-sm font-bold text-foreground leading-snug">{f.title}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA URGENCE ──────────────────────────────────────────────── */}
      <section className="w-full py-16" style={{ background: "#ef444408", borderTop: "1px solid #ef444422", borderBottom: "1px solid #ef444422" }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div {...fade(0)}>
            <p className="text-sm font-bold text-foreground mb-1">⚠️ Septembre 2026 — Il reste moins de 5 mois</p>
            <p className="text-xs text-muted-foreground mb-4">
              Les entreprises qui attendent la dernière minute font face à des prestataires débordés et des tarifs multipliés par 3.
            </p>
            <a href={`${APP_URL}/auth`} target="_blank" rel="noopener noreferrer">
              <Button
                className="font-bold text-white text-sm px-8 py-4 transition-all duration-200 hover:scale-[1.03]"
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                  boxShadow: `0 0 24px rgba(249,115,22,0.4)`,
                }}
              >
                Me mettre en conformité maintenant — c'est gratuit <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── COMPARATIF ───────────────────────────────────────────────── */}
      <section className="w-full py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fade(0)} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Odoc vs. Excel vs. logiciels classiques
            </h2>
            <p className="mt-3 text-muted-foreground">Pourquoi les PME migrent vers Odoc avant l'échéance 2026</p>
          </motion.div>

          <motion.div {...fade(0.1)} className="rounded-2xl border border-border overflow-hidden bg-card">
            <div className="grid grid-cols-4 text-xs font-bold text-center py-3 border-b border-border" style={{ background: `${ORANGE}08` }}>
              <div className="text-left pl-5 text-foreground">Critère</div>
              <div style={{ color: ORANGE }}>Odoc ✦</div>
              <div className="text-muted-foreground">Excel / PDF</div>
              <div className="text-muted-foreground">Logiciels classiques</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 text-xs text-center py-3 border-b border-border last:border-0 items-center ${i % 2 === 0 ? "" : "bg-secondary/30"}`}
              >
                <div className="text-left pl-5 text-foreground font-medium text-xs">{row.feature}</div>
                <div className="font-semibold" style={{ color: typeof row.odoc === "string" ? ORANGE : undefined }}>
                  {typeof row.odoc === "string" ? row.odoc : row.odoc ? <CheckCircle className="h-4 w-4 mx-auto text-green-500" /> : <span className="text-muted-foreground">✗</span>}
                </div>
                <div>
                  {typeof row.excel === "string" ? <span className="text-xs text-red-500 font-medium">{row.excel}</span> : row.excel ? <CheckCircle className="h-4 w-4 mx-auto text-green-500" /> : <span className="text-muted-foreground">✗</span>}
                </div>
                <div>
                  {typeof row.other === "string" ? <span className="text-xs text-muted-foreground">{row.other}</span> : row.other ? <CheckCircle className="h-4 w-4 mx-auto text-green-500" /> : <span className="text-muted-foreground">✗</span>}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ SEO ──────────────────────────────────────────────────── */}
      <section className="w-full py-24 sm:py-32" style={{ background: `${PETRIOL}06` }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fade(0)} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Tout savoir sur la réforme e-facture 2026
            </h2>
            <p className="mt-3 text-muted-foreground">Les vraies questions que se posent les dirigeants de PME</p>
          </motion.div>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <h3 className="text-sm font-bold text-foreground flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: ORANGE }} />
                  {item.q}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed pl-6">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section className="w-full py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            {...fade(0)}
            className="rounded-2xl p-10 sm:p-16"
            style={{
              background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
              boxShadow: `0 8px 64px rgba(249,115,22,0.35)`,
            }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Ne subissez pas la réforme 2026.<br />
              Transformez-la en avantage concurrentiel.
            </h2>
            <p className="mt-3 text-white/80 text-sm leading-relaxed">
              Les entreprises conformes dès aujourd'hui traitent leurs factures 75% plus vite,
              éliminent la fraude et économisent en moyenne <strong className="text-white">2h par jour</strong>.
              Setup en 2 minutes. Aucune carte bancaire.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`${APP_URL}/auth`} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="px-10 py-6 font-bold transition-all duration-200 hover:scale-[1.04]"
                  style={{ background: "white", color: PETRIOL, boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
                >
                  Créer mon compte gratuit <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6">
                  Voir les tarifs →
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/60">
              <CheckCircle className="inline h-3 w-3 mr-1" />
              Conforme dès le 1er jour ·{" "}
              <CheckCircle className="inline h-3 w-3 mr-1" />
              Support humain inclus ·{" "}
              <CheckCircle className="inline h-3 w-3 mr-1" />
              Annulation à tout moment
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
