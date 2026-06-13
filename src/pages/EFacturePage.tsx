import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { BackButton } from "@/components/BackButton";
import { TrustCredentials } from "@/components/TrustCredentials";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, CheckCircle, Shield, FileText,
  Brain, Search, BadgeCheck, Globe, FileOutput,
  PlugZap, Clock, Calendar, ChevronRight, MapPin,
} from "lucide-react";

const ORANGE = "hsl(30 100% 50%)";
const PETRIOL = "hsl(201 85% 22%)";
const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: [0.32, 0.72, 0, 1] as const },
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
    urgence: "Acté",
    urgenceColor: PETRIOL,
  },
  {
    icon: Calendar,
    date: "01/09/2026",
    titre: "Réception obligatoire — toutes les entreprises",
    loi: "Ordonnance n°2021-1190 · Décret n°2022-1299",
    detail:
      "Toute entreprise assujettie à la TVA (y compris les micro-entreprises) doit pouvoir recevoir ses factures fournisseurs au format électronique structuré via une plateforme agréée.",
    urgence: "Échéance n°1",
    urgenceColor: "#ef4444",
  },
  {
    icon: Calendar,
    date: "01/09/2027",
    titre: "Émission + e-reporting — TPE / PME",
    loi: "Ordonnance n°2021-1190 · Décret n°2022-1299",
    detail:
      "Les TPE, PME et micro-entreprises doivent à leur tour émettre leurs factures au format électronique et transmettre leur e-reporting (données de transaction et de paiement).",
    urgence: "Échéance n°2",
    urgenceColor: ORANGE,
  },
  {
    icon: Globe,
    date: "Format légal",
    titre: "Factur-X — format européen EN 16931",
    loi: "Directive UE 2014/55/UE · norme EN 16931",
    detail:
      "Une facture électronique n'est pas un PDF par e-mail : c'est un fichier structuré (Factur-X = PDF lisible + données XML intégrées). OdocPilot génère vos factures directement à ce format conforme, sans paramétrage.",
    urgence: "Disponible",
    urgenceColor: PETRIOL,
  },
];

const FEATURES = [
  {
    icon: FileText,
    title: "Génération Factur-X conforme",
    desc: "Vos factures sortent au format Factur-X (PDF/A-3 + données structurées) attendu par la réforme, prêtes à télécharger — sans paramétrage technique.",
    badge: "Disponible",
  },
  {
    icon: Brain,
    title: "Lecture IA de vos factures reçues",
    desc: "Déposez une facture : l'IA en extrait le fournisseur, le montant, la TVA et l'échéance, et propose le compte. Vous validez d'un clic — rien n'est engagé sans vous.",
    badge: "Disponible",
  },
  {
    icon: Search,
    title: "Recherche en langage naturel",
    desc: "« Toutes les factures EDF de 2025 » en français courant : la GED retrouve vos documents instantanément, sans dossier à créer.",
    badge: "Disponible",
  },
  {
    icon: FileOutput,
    title: "Export FEC pour l'expert-comptable",
    desc: "Un Fichier des Écritures Comptables propre, exporté en un clic, à transmettre à votre cabinet sans manipulation.",
    badge: "Disponible",
  },
  {
    icon: Brain,
    title: "Copilote qui répond sur vos données",
    desc: "« Qui me doit de l'argent ce mois-ci ? » : réponse claire, sourcée sur vos documents, et action préparée que vous validez.",
    badge: "Disponible",
  },
  {
    icon: Clock,
    title: "Transmission & rapprochement bancaire",
    desc: "Transmission via plateforme agréée partenaire et rapprochement bancaire : raccordement en cours, livrés avant les échéances.",
    badge: "Bientôt",
  },
];

const COMPARISON = [
  { feature: "Génération Factur-X (PDF/A-3 + XML)",   odoc: true,  excel: "Non conforme", other: true  },
  { feature: "Lecture IA des factures reçues",        odoc: true,  excel: false, other: false },
  { feature: "Recherche en langage naturel",          odoc: true,  excel: false, other: false },
  { feature: "Export FEC pour l'expert-comptable",    odoc: true,  excel: false, other: true  },
  { feature: "Données et IA hébergées en France",     odoc: true,  excel: "—",   other: "Variable" },
  { feature: "Vous gardez le dernier mot (validation)", odoc: true, excel: "—",  other: false },
  { feature: "Prix mensuel (par entreprise)",         odoc: "dès 49€", excel: "—", other: "Variable" },
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
  "@type": "WebPage",
  name: "Facturation électronique 2026/2027 — préparez votre conformité avec OdocPilot",
  description:
    "Réception obligatoire au 1ᵉʳ septembre 2026, émission en 2027 : OdocPilot prépare votre conformité e-facture. Génération Factur-X, lecture IA des factures, export FEC. Données et IA hébergées en France.",
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
        title="Facturation électronique 2026/2027 : préparez votre conformité | OdocPilot"
        description="Réception obligatoire au 1ᵉʳ septembre 2026, émission en 2027 : OdocPilot prépare votre conformité e-facture. Génération Factur-X, lecture IA des factures, export FEC. L'IA prépare, vous validez. Données et IA hébergées en France. Essai 14 jours sans carte bancaire."
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
          <motion.div {...fade(0)}>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold mb-6"
              style={{ background: "#ef444418", border: "1px solid #ef444444", color: "#ef4444" }}
            >
              Réception obligatoire au 1ᵉʳ septembre 2026 — êtes-vous prêt ?
            </div>
          </motion.div>

          <motion.div {...fade(0.08)}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[1.05] text-foreground">
              La facturation électronique devient obligatoire.{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                OdocPilot vous y prépare, vous validez en un clic.
              </span>
            </h1>
          </motion.div>

          <motion.div {...fade(0.16)}>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
              Dès le <strong>1ᵉʳ septembre 2026</strong>, toute entreprise assujettie à la TVA devra recevoir ses factures
              au format électronique structuré via une <strong>plateforme agréée</strong> ; l'émission suivra en 2027.
              OdocPilot génère vos factures au format légal <strong>Factur-X</strong>, lit et classe vos factures reçues,
              et prépare votre administratif — pendant que vous gardez la décision finale.
            </p>
          </motion.div>

          <motion.div {...fade(0.24)}>
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground font-medium">
              {[
                "Factur-X conforme",
                "Lecture IA des factures",
                "Export FEC en 1 clic",
                "Données et IA en France",
                "L'IA prépare, vous validez",
              ].map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" style={{ color: ORANGE }} /> {b}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div {...fade(0.32)}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a href={SIGNUP} data-umami-event="cta-efacture-hero">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base px-10 py-6 font-bold text-white transition-all duration-200 hover:scale-[1.03]"
                  style={{
                    background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                    boxShadow: `0 0 32px rgba(249,115,22,0.45)`,
                  }}
                >
                  Démarrer l'essai 14 jours <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-6">
                  Voir les tarifs →
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              <CheckCircle className="inline h-3 w-3 mr-1" style={{ color: ORANGE }} />
              Sans carte bancaire ·{" "}
              <CheckCircle className="inline h-3 w-3 mr-1" style={{ color: ORANGE }} />
              Sans engagement ·{" "}
              <MapPin className="inline h-3 w-3 mr-1" style={{ color: ORANGE }} />
              Données en France
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── STATS (faits réglementaires) ─────────────────────────────── */}
      <section className="w-full py-10 border-y border-border" style={{ background: `linear-gradient(90deg, ${ORANGE}08, ${PETRIOL}08)` }}>
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "01/09/2026", label: "Réception obligatoire (toutes entreprises)" },
            { val: "50 €", label: "Amende par facture non conforme" },
            { val: "500 €", label: "Par manquement à l'e-reporting" },
            { val: "100 % France", label: "Données et IA hébergées en France" },
          ].map((s, i) => (
            <motion.div key={s.label} {...fade(i * 0.08)}>
              <p className="text-2xl sm:text-3xl font-extrabold tabular-nums" style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>{s.val}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Source :{" "}
          <a href="https://www.impots.gouv.fr/professionnel/facturation-electronique" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">impots.gouv.fr</a>{" "}· loi de finances 2026 · calendrier à jour juin 2026.
        </p>
      </section>

      {/* ── CALENDRIER & OBLIGATIONS ─────────────────────────────────── */}
      <section className="w-full py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fade(0)} className="text-center mb-14">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold mb-4"
              style={{ border: `1px solid ${PETRIOL}44`, background: `${PETRIOL}10`, color: PETRIOL }}
            >
              Le calendrier officiel
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Ce que la réforme impose —
              <span style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}> et comment OdocPilot vous y prépare.</span>
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
              Chaque échéance a une date. OdocPilot vous prépare à chacune, en distinguant toujours ce qui est actif de ce qui arrive.
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
                  className="p-6 rounded-xl border border-border bg-card"
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
                  <p className="text-2xl font-extrabold tracking-tight tabular-nums" style={{ color: ORANGE }}>{loi.date}</p>
                  <h3 className="mt-1 text-sm font-bold text-foreground">{loi.titre}</h3>
                  <p className="mt-1 text-xs font-mono text-muted-foreground opacity-70">{loi.loi}</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{loi.detail}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Encart transmission honnête */}
          <motion.div {...fade(0.2)} className="mt-6 rounded-xl border border-border bg-card p-5 flex items-start gap-3">
            <Shield className="h-5 w-5 flex-shrink-0" style={{ color: ORANGE }} />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">En toute transparence :</strong> aujourd'hui, OdocPilot génère vos factures au format légal Factur-X et prépare votre conformité. La <strong className="text-foreground">transmission via une plateforme agréée partenaire</strong> est en cours de raccordement — vous serez prêt le jour J.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section className="w-full py-24 sm:py-32" style={{ background: `${PETRIOL}06` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fade(0)} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Des fonctions réelles,{" "}
              <span style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>montrées plutôt que promises.</span>
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
              Ce que l'outil fait aujourd'hui — la transmission via plateforme agréée et le rapprochement bancaire sont annoncés honnêtement comme « bientôt ».
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const soon = f.badge === "Bientôt";
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className={`relative p-5 rounded-xl border bg-card ${soon ? "border-dashed border-border" : "border-border"}`}
                >
                  <span
                    className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={soon
                      ? { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }
                      : { background: `${ORANGE}18`, color: ORANGE, border: `1px solid ${ORANGE}33` }}
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

      {/* ── COMPARATIF ───────────────────────────────────────────────── */}
      <section className="w-full py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fade(0)} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              OdocPilot, le tableur et les logiciels classiques
            </h2>
            <p className="mt-3 text-muted-foreground">Ce qui change concrètement pour préparer l'échéance 2026</p>
          </motion.div>

          <motion.div {...fade(0.1)} className="rounded-2xl border border-border overflow-hidden bg-card">
            <div className="grid grid-cols-4 text-xs font-bold text-center py-3 border-b border-border" style={{ background: `${ORANGE}08` }}>
              <div className="text-left pl-5 text-foreground">Critère</div>
              <div style={{ color: ORANGE }}>OdocPilot</div>
              <div className="text-muted-foreground">Tableur / PDF</div>
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
                  {typeof row.excel === "string" ? <span className="text-xs text-muted-foreground">{row.excel}</span> : row.excel ? <CheckCircle className="h-4 w-4 mx-auto text-green-500" /> : <span className="text-muted-foreground">✗</span>}
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
              La réforme e-facture, sans zone d'ombre
            </h2>
            <p className="mt-3 text-muted-foreground">Les vraies questions que se posent les dirigeants</p>
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

          <TrustCredentials className="mt-10" />
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
              Prenez de l'avance sur la réforme 2026.
            </h2>
            <p className="mt-3 text-white/80 text-sm leading-relaxed">
              Générez vos factures au format légal Factur-X, laissez l'IA préparer votre administratif sur vos propres documents,
              et gardez le dernier mot. Mise en route en quelques minutes, sans carte bancaire.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a href={SIGNUP} data-umami-event="cta-efacture-final">
                <Button
                  size="lg"
                  className="px-10 py-6 font-bold transition-all duration-200 hover:scale-[1.04]"
                  style={{ background: "white", color: PETRIOL, boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
                >
                  Démarrer l'essai 14 jours <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6">
                  Voir les tarifs →
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/70 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Sans carte bancaire</span>
              <span className="inline-flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Sans engagement</span>
              <span className="inline-flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Données en France</span>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
