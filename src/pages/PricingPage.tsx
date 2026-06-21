import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { TrustCredentials } from "@/components/TrustCredentials";
import { Check, MapPin, CreditCard, RotateCcw, Sparkles, Receipt, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;

const plans = [
  {
    name: "Conformité",
    monthlyPrice: 0,
    annualPrice: 0,
    target: "Se mettre en conformité, gratuitement",
    badge: "Gratuit" as string | null,
    highlight: false,
    features: [
      "Générateur de factures Factur-X illimité",
      "Diagnostic + vérificateur de conformité",
      "Recevez et lisez vos premières factures avec l'IA",
      "1 utilisateur · hébergé en France",
      "Sans carte bancaire, sans engagement",
    ],
    cta: "Commencer gratuitement",
    ctaLink: SIGNUP,
  },
  {
    name: "Essential",
    monthlyPrice: 49,
    annualPrice: 39,
    target: "Indépendant, solo, TPE",
    badge: null as string | null,
    highlight: false,
    features: [
      "Devis & factures illimités",
      "Factures au format Factur-X conforme",
      "Lecture IA des factures reçues",
      "Recherche de documents en langage naturel",
      "Export FEC pour votre expert-comptable",
      "Hébergé en France · conforme RGPD",
      "Support par email",
    ],
    cta: "Commencer gratuitement",
    ctaLink: SIGNUP,
  },
  {
    name: "Pro",
    monthlyPrice: 89,
    annualPrice: 71,
    target: "Le copilote IA complet",
    badge: "Le plus choisi",
    highlight: true,
    features: [
      "Tout Essential, multi-utilisateurs sans surcoût",
      "Copilote Brain : répond sur vos données, prépare les actions",
      "Relances clients préparées automatiquement",
      "Suivi de trésorerie",
      "Tableaux de bord & automatisations",
      "Classement intelligent des documents",
      "Support prioritaire",
    ],
    cta: "Commencer gratuitement",
    ctaLink: SIGNUP,
  },
  {
    name: "Manager",
    monthlyPrice: 149,
    annualPrice: 119,
    target: "Multi-équipes, dirigeants",
    badge: null,
    highlight: false,
    features: [
      "Tout Pro",
      "Multi-équipes & délégation",
      "Rapports dirigeant personnalisés",
      "Documents illimités",
      "Accompagnement à la mise en conformité",
      "Support dédié",
    ],
    cta: "Commencer gratuitement",
    ctaLink: SIGNUP,
  },
];

const compare = [
  { label: "Générateur de factures Factur-X", gratuit: "Illimité", essential: "Illimité", pro: "Illimité", manager: "Illimité" },
  { label: "Diagnostic + vérificateur de conformité", gratuit: true, essential: true, pro: true, manager: true },
  { label: "Lecture IA des factures reçues", gratuit: "Découverte", essential: true, pro: true, manager: true },
  { label: "Recherche en langage naturel", gratuit: false, essential: true, pro: true, manager: true },
  { label: "Export FEC pour l'expert-comptable", gratuit: false, essential: true, pro: true, manager: true },
  { label: "Utilisateurs", gratuit: "1", essential: "1", pro: "Illimités", manager: "Illimités" },
  { label: "Copilote Brain", gratuit: false, essential: false, pro: true, manager: true },
  { label: "Relances préparées automatiquement", gratuit: false, essential: false, pro: true, manager: true },
  { label: "Multi-équipes & délégation", gratuit: false, essential: false, pro: false, manager: true },
];

const faqItems = [
  { question: "Y a-t-il un coût par utilisateur ?", answer: "Non. Le prix de votre plan est tout compris : à partir du plan Pro, vous ajoutez vos collaborateurs sans aucun supplément. Vous savez exactement ce que vous payez, et votre facture ne gonfle pas quand votre équipe grandit." },
  { question: "Suis-je prêt pour la facturation électronique 2026 ?", answer: "Dès le 1ᵉʳ septembre 2026, toute entreprise assujettie à la TVA devra recevoir ses factures au format électronique structuré ; l'émission suivra en 2027. OdocPilot génère vos factures au format légal Factur-X et prépare votre conformité étape par étape. La transmission via une plateforme agréée partenaire est en cours de raccordement et sera prête avant l'échéance." },
  { question: "Dois-je payer pour commencer ?", answer: "Non. Vous démarrez gratuitement avec le palier Conformité (0€) et les outils sans compte (générateur Factur-X, diagnostic, vérificateur), sans carte bancaire. Les offres payantes (Essential, Pro, Manager) sont une montée en gamme explicite que vous choisissez : jamais de prélèvement surprise." },
  { question: "Puis-je changer de plan à tout moment ?", answer: "Oui, vous montez ou descendez de plan quand vous voulez. Le changement prend effet immédiatement, avec un prorata automatique. Aucun engagement de durée." },
  { question: "L'IA fait-elle ma comptabilité toute seule ?", answer: "Non, et c'est un choix assumé. L'IA prépare le travail — lecture des factures, classement, relances — mais rien n'est validé ni comptabilisé sans vous. Vous gardez toujours le dernier mot, et vous exportez votre FEC pour votre expert-comptable en un clic." },
  { question: "Mes données sont-elles en sécurité ?", answer: "Vos documents comme l'intelligence artificielle qui les traite (Mistral, un modèle français) sont hébergés en France : aucun transfert vers l'étranger. OdocPilot est conforme au RGPD, aligné sur l'AI Act, et s'inscrit dans une démarche Numérique Responsable. Vous pouvez exporter vos données à tout moment." },
];

const trustBadges = [
  { icon: MapPin, label: "Données et IA en France" },
  { icon: CreditCard, label: "Sans carte bancaire" },
  { icon: RotateCcw, label: "Sans engagement" },
  { icon: Check, label: "Sans coût par utilisateur" },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className="font-semibold text-foreground">{value}</span>;
  return value ? <Check className="h-4 w-4 text-primary mx-auto" /> : <span className="text-muted-foreground/40">—</span>;
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Tarifs OdocPilot — un seul prix, tout compris | Palier gratuit, sans carte bancaire"
        description="Des tarifs simples et transparents, sans coût par utilisateur. Palier Conformité gratuit, puis Essential 49€, Pro 89€, Manager 149€. Préparez votre conformité facture électronique 2026/2027. Palier Conformité gratuit, sans carte bancaire. Données et IA en France."
        canonical="/pricing"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />

      {/* HERO */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 text-center">
        <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Tarifs clairs, par entreprise</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">Un seul prix. Tout compris.</h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground">
            Sans coût par utilisateur, sans option qui s'empile. Un abonnement clair qui prépare votre conformité à la facturation électronique 2026/2027 et laisse l'IA préparer votre administratif — vous gardez le dernier mot.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">Palier gratuit · Sans carte bancaire · Résiliable en 1 clic</p>
          <p className="mt-4 text-sm">
            <Link to="/diagnostic" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:gap-2 transition-all" data-umami-event="pricing-diagnostic">
              <Sparkles className="h-4 w-4" /> Pas sûr d'être concerné ? Vérifiez votre conformité en 3 min
            </Link>
          </p>
        </MotionDiv>

        {/* Toggle */}
        <div className="mt-9 flex items-center justify-center gap-3">
          <span className={`text-sm font-semibold ${!annual ? "text-foreground" : "text-muted-foreground"}`}>Mensuel</span>
          <button onClick={() => setAnnual(!annual)} aria-label="Basculer mensuel / annuel" className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${annual ? "bg-primary" : "bg-muted"}`}>
            <span className={`inline-block h-5 w-5 transform rounded-full bg-card shadow-sm transition-transform ${annual ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <span className={`text-sm font-semibold ${annual ? "text-foreground" : "text-muted-foreground"}`}>Annuel</span>
          {annual && <span className="ml-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">−20%</span>}
        </div>
      </section>

      {/* PLANS */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => {
            const isFree = plan.monthlyPrice === 0;
            const price = annual ? plan.annualPrice : plan.monthlyPrice;
            const isMail = plan.ctaLink.startsWith("mailto:");
            return (
              <MotionDiv key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.45 }}
                className={`relative flex flex-col rounded-2xl p-6 sm:p-7 bg-card ${plan.highlight ? "border-2 border-primary shadow-elevated ring-1 ring-primary/15 md:scale-[1.02]" : "border border-border shadow-card"}`}>
                {plan.badge && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${plan.highlight ? "bg-gradient-cta text-primary-foreground" : "bg-secondary text-foreground border border-border"}`}>{plan.badge}</span>
                )}
                <h3 className="text-lg sm:text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{plan.target}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  {isFree ? (
                    <span className="text-3xl font-extrabold text-foreground">Gratuit</span>
                  ) : (
                    <><span className="text-3xl font-extrabold text-foreground tabular-nums">{price}€</span><span className="text-muted-foreground text-sm">/mois</span></>
                  )}
                </div>
                {annual && !isFree && <p className="mt-1 text-xs text-muted-foreground tabular-nums">soit {plan.annualPrice * 12}€ /an</p>}
                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" /><span>{f}</span></li>
                  ))}
                </ul>
                <a href={plan.ctaLink} {...(!isMail ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="mt-7 block" data-umami-event="cta-essai-gratuit">
                  <Button className={`w-full ${plan.highlight ? "bg-gradient-cta text-primary-foreground font-bold" : ""}`} variant={plan.highlight ? "default" : "outline"} size="lg">{plan.cta}</Button>
                </a>
              </MotionDiv>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Plus de 50 personnes ou un groupe ?{" "}
          <a href="mailto:contact@odocpilot.com" className="font-semibold text-primary underline hover:no-underline">Parlons d'une offre sur mesure</a>.
        </p>
      </section>

      {/* ANCRAGE DOULEUR — coût de la non-conformité */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <MotionDiv initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border bg-secondary/60 p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <Receipt className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">La conformité coûte moins cher que l'amende</h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              La loi de finances 2026 prévoit <strong className="text-foreground tabular-nums">50 € par facture</strong> émise dans un format non conforme et <strong className="text-foreground tabular-nums">500 € par manquement</strong> à l'e-reporting (plafond 15 000 €/an). À partir de <strong className="text-foreground tabular-nums">49 €/mois</strong>, OdocPilot vous met en conformité <em>et</em> prépare votre administratif au quotidien.{" "}
              <a href="https://www.impots.gouv.fr/professionnel/facturation-electronique" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Source : impots.gouv.fr</a>.
            </p>
          </div>
        </MotionDiv>
      </section>

      {/* COMPARATIF */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-center">Ce qui est inclus, plan par plan</h2>
        <div className="mt-10 overflow-x-auto rounded-2xl border border-border shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/60">
                <th className="px-4 sm:px-6 py-4 text-left font-semibold text-foreground">Inclus</th>
                <th className="px-3 sm:px-4 py-4 text-center font-semibold text-foreground">Conformité</th>
                <th className="px-3 sm:px-4 py-4 text-center font-semibold text-foreground">Essential</th>
                <th className="px-3 sm:px-4 py-4 text-center font-semibold text-primary">Pro</th>
                <th className="px-3 sm:px-4 py-4 text-center font-semibold text-foreground">Manager</th>
              </tr>
            </thead>
            <tbody>
              {compare.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <td className="px-4 sm:px-6 py-3.5 font-medium text-foreground">{row.label}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-center"><Cell value={row.gratuit} /></td>
                  <td className="px-3 sm:px-4 py-3.5 text-center"><Cell value={row.essential} /></td>
                  <td className="px-3 sm:px-4 py-3.5 text-center"><Cell value={row.pro} /></td>
                  <td className="px-3 sm:px-4 py-3.5 text-center"><Cell value={row.manager} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Réassurance honnête */}
        <div className="mt-10 rounded-2xl bg-card border border-border p-6 sm:p-8 flex items-start gap-4 shadow-card">
          <CreditCard className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-foreground mb-1">Essayez sans risque, sans carte bancaire</h3>
            <p className="text-sm text-muted-foreground">Vous démarrez gratuitement avec le palier Conformité (0€) et les outils sans compte (générateur Factur-X, diagnostic, vérificateur), sans carte bancaire et sans engagement. Les offres payantes sont une montée en gamme explicite que vous choisissez : jamais de prélèvement surprise, et vous gardez l'accès à vos données.</p>
          </div>
        </div>
      </section>

      {/* COMPARATIFS (BOFU) */}
      <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-center">OdocPilot face aux autres</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">Des comparatifs honnêtes : qui fait quoi, et pour qui.</p>
        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          {[
            { to: "/comparatif/pennylane", label: "OdocPilot vs Pennylane" },
            { to: "/comparatif/qonto", label: "OdocPilot vs Qonto" },
            { to: "/comparatif/indy", label: "OdocPilot vs Indy" },
            { to: "/comparatif/sellsy", label: "OdocPilot vs Sellsy" },
            { to: "/comparatif/axonaut", label: "OdocPilot vs Axonaut" },
            { to: "/comparatif/abby", label: "OdocPilot vs Abby" },
          ].map((cmp) => (
            <Link key={cmp.to} to={cmp.to} className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:border-primary/40 hover:shadow-card-hover transition-all">
              <span>{cmp.label}</span>
              <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-center">Questions fréquentes</h2>
        <Accordion type="single" collapsible className="mt-10">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-foreground font-medium">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* TRUST */}
      <section className="w-full py-10 border-t border-border bg-secondary/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {trustBadges.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground font-medium"><Icon className="h-4 w-4 text-primary" /><span>{b.label}</span></div>
            );
          })}
        </div>
        <TrustCredentials className="mt-8 max-w-5xl mx-auto px-4" />
      </section>
    </div>
  );
}
