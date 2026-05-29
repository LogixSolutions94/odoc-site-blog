import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { Check, Lock, BadgeCheck, Shield, Zap } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";

const plans = [
  {
    name: "Essential",
    monthlyPrice: 49,
    annualPrice: 39,
    target: "TPE, solo, indépendants",
    badge: null,
    highlight: false,
    features: [
      "👤 1 compte",
      "GED — 200 documents",
      "Facturation IA",
      "Trésorerie & SEPA Export",
      "CRM basique",
      "10 GB stockage",
      "Support email",
    ],
    cta: "Commencer l'essai gratuit",
    ctaLink: `${APP_URL}/auth`,
  },
  {
    name: "Pro",
    monthlyPrice: 89,
    annualPrice: 71,
    target: "PME, équipes 5-20 pers.",
    badge: "⭐ Plus populaire",
    highlight: true,
    features: [
      "👥 3 comptes",
      "Tout Essential",
      "Brain Copilot RAG (IA doc)",
      "N8N Webhooks & automations",
      "Analytics avancés",
      "Module RH complet",
      "Projets Kanban",
      "Messagerie interne",
      "2000 documents",
      "50 GB stockage",
      "Support prioritaire",
    ],
    cta: "Commencer l'essai gratuit",
    ctaLink: `${APP_URL}/auth`,
  },
  {
    name: "Manager",
    monthlyPrice: 149,
    annualPrice: 119,
    target: "Multi-équipes, managers",
    badge: null,
    highlight: false,
    features: [
      "👥 5 comptes et plus",
      "Tout Pro",
      "Multi-équipes & délégation",
      "Portail Fournisseur",
      "Smart Connectors",
      "Rapports dirigeant perso.",
      "Documents illimités",
      "200 GB stockage",
      "Support dédié + onboarding",
    ],
    cta: "Commencer l'essai gratuit",
    ctaLink: `${APP_URL}/auth`,
  },
  {
    name: "Entreprise",
    monthlyPrice: -1,
    annualPrice: -1,
    target: "+50 salariés, groupes",
    badge: "Sur mesure",
    highlight: false,
    features: [
      "👥 Sur mesure",
      "Tout Manager",
      "SSO SAML/OpenID — sur demande, roadmap",
      "Instance dédiée — sur étude (cahier des charges)",
      "SLA — sur étude contractuelle",
      "API privée",
      "Formation & accompagnement",
      "Stockage illimité",
      "Support 24h/24 7j/7",
    ],
    cta: "Nous contacter",
    ctaLink: "mailto:contact@odocpilot.com",
  },
];

const faqItems = [
  {
    question: "Puis-je changer de plan à tout moment ?",
    answer: "Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les changements prennent effet immédiatement avec un prorata automatique.",
  },
  {
    question: "Y a-t-il une période d'essai ?",
    answer: "Les plans Essential, Pro et Manager incluent un essai gratuit de 14 jours sans carte bancaire.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument. Vos données transitent en TLS 1.3, sont hébergées sur l'infrastructure chiffrée d'OVH en France et conformes au RGPD. Nous ne revendons jamais vos données.",
  },
  {
    question: "Que se passe-t-il à la fin d'un abonnement ?",
    answer: "Vous conservez un accès en lecture seule à vos données pendant 30 jours. L'export de vos données reste disponible à tout moment.",
  },
  {
    question: "Proposez-vous des tarifs pour associations/écoles ?",
    answer: "Oui, contactez-nous à contact@odocpilot.com pour discuter de tarifs adaptés aux associations, écoles et structures éducatives.",
  },
];

const trustBadges = [
  { icon: "🔒", label: "Paiement sécurisé Stripe" },
  { icon: "🇫🇷", label: "Hébergé en France" },
  { icon: "↩️", label: "Remboursement 30 jours" },
  { icon: "📞", label: "Support réactif en français" },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Tarifs Odoc — Essential, Pro, Manager | Essai 14 jours gratuit"
        description="Comparez les plans Odoc : Essential 49€, Pro 89€, Manager 149€. Essai gratuit 14 jours sans carte bancaire. Annulation à tout moment."
        canonical="/pricing"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />

      {/* ═══════════════════════════════════════════
          1 · HERO
      ═══════════════════════════════════════════ */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-14 text-center">
        <MotionDiv>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Des tarifs simples, sans surprise
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground">
            Essai gratuit 14 jours · Sans carte bancaire · Résiliation en 1 clic
          </p>
        </MotionDiv>

        {/* Toggle Mensuel/Annuel */}
        <MotionDiv className="mt-10 flex items-center justify-center gap-3">
          <span
            className={`text-sm font-semibold ${
              !annual ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Mensuel
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              annual ? "bg-primary" : "bg-muted"
            }`}
            aria-label="Basculer entre mensuel et annuel"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-card shadow-sm transition-transform ${
                annual ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-semibold ${
              annual ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Annuel
          </span>
          {annual && (
            <span className="ml-1 rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-bold text-green-600">
              Économisez 20%
            </span>
          )}
        </MotionDiv>
      </section>

      {/* ═══════════════════════════════════════════
          2 · PRICING CARDS (4 plans)
      ═══════════════════════════════════════════ */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => {
            const isCustom = plan.monthlyPrice === -1;
            const price = isCustom
              ? null
              : annual
              ? plan.annualPrice
              : plan.monthlyPrice;

            return (
              <MotionDiv
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`relative flex flex-col rounded-xl p-6 sm:p-7 transition-all duration-300 ${
                  plan.highlight
                    ? "border-2 border-primary bg-card shadow-elevated ring-1 ring-primary/15 md:scale-[1.02]"
                    : "border border-border bg-card shadow-card hover:shadow-card-hover"
                }`}
              >
                {/* Badge "Plus populaire" */}
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}

                {/* Nom du plan */}
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {plan.name}
                </h3>

                {/* Cible */}
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  {plan.target}
                </p>

                {/* Prix */}
                <div className="mt-5 flex items-baseline gap-1">
                  {isCustom ? (
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">
                      {plan.badge}
                    </span>
                  ) : (
                    <>
                      <span className="text-2xl sm:text-3xl font-bold text-foreground">
                        {price}€
                      </span>
                      <span className="text-muted-foreground text-sm">/mois</span>
                    </>
                  )}
                </div>
                {annual && !isCustom && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {plan.annualPrice * 12}€ /an
                  </p>
                )}

                {/* Features */}
                <ul className="mt-6 sm:mt-7 flex-1 space-y-2 sm:space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                    >
                      <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {plan.ctaLink.startsWith("mailto:") ? (
                  <a href={plan.ctaLink} className="mt-6 sm:mt-7 block">
                    <Button
                      className="w-full"
                      variant={plan.highlight ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </a>
                ) : (
                  <a
                    href={plan.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 sm:mt-7 block"
                  >
                    <Button
                      className={`w-full ${
                        plan.highlight ? "bg-accent hover:bg-accent/90" : ""
                      }`}
                      variant={plan.highlight ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </a>
                )}
              </MotionDiv>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3 · TABLEAU COMPARATIF
      ═══════════════════════════════════════════ */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <MotionDiv className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Comparatif complet
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Tous les détails des features par plan.
          </p>
        </MotionDiv>

        <div className="overflow-x-auto rounded-xl border border-border shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-primary/5">
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold text-foreground">
                  Fonctionnalité
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-center font-semibold text-foreground">
                  Essential
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-center font-semibold text-foreground">
                  Pro
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-center font-semibold text-foreground">
                  Manager
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-center font-semibold text-foreground">
                  Entreprise
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-foreground">
                  Documents max
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  200
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  2000
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  ∞
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  ∞
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-foreground">
                  Utilisateurs
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  1
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  3
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  ∞
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  ∞
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-foreground">
                  Stockage
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  10 GB
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  50 GB
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  200 GB
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  ∞
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-foreground">
                  Brain Copilot RAG
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-red-500 font-bold">
                  ✗
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  ✅
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  ✅
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  ✅
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-foreground">
                  N8N Webhooks
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-red-500 font-bold">
                  ✗
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  ✅
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  ✅
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  ✅
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-foreground">
                  Module RH
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-red-500 font-bold">
                  ✗
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  ✅
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  ✅
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  ✅
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-foreground">
                  SSO SAML/OpenID
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-red-500 font-bold">
                  ✗
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-red-500 font-bold">
                  ✗
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-red-500 font-bold">
                  ✗
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-green-600 font-bold">
                  ✅
                </td>
              </tr>
              <tr className="border-b border-border bg-secondary/50">
                <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-foreground">
                  Support
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-sm font-semibold">
                  Email
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-sm font-semibold">
                  Prioritaire
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-sm font-semibold">
                  Dédié
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-sm font-semibold">
                  24/7
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Garantie 30 jours */}
        <div className="mt-12 rounded-xl bg-card border border-border p-6 sm:p-8 flex items-start gap-4 shadow-card">
          <Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-foreground mb-2">
              Satisfait ou remboursé 30 jours
            </h3>
            <p className="text-sm text-muted-foreground">
              Essayez Odoc sans risque. Si vous n'êtes pas satisfait dans les 30 jours, on vous rembourse intégralement. Sans question.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4 · FAQ
      ═══════════════════════════════════════════ */}
      <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <MotionDiv className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Questions fréquentes
          </h2>
        </MotionDiv>
        <Accordion type="single" collapsible className="mt-10">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-foreground font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ═══════════════════════════════════════════
          5 · TRUST BADGES
      ═══════════════════════════════════════════ */}
      <section className="w-full py-10 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {trustBadges.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <span className="text-lg">{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
