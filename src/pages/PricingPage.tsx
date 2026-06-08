import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { Check, ShieldCheck } from "lucide-react";
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
    target: "Indépendant, solo, TPE",
    badge: null as string | null,
    highlight: false,
    features: [
      "Devis & factures illimités",
      "Relances d'impayés automatiques",
      "Saisie automatique des documents",
      "Suivi de trésorerie & export SEPA",
      "Fichier clients (CRM)",
      "Hébergé en France · conforme RGPD",
      "Support par email",
    ],
    cta: "Commencer l'essai gratuit",
    ctaLink: `${APP_URL}/auth`,
  },
  {
    name: "Pro",
    monthlyPrice: 89,
    annualPrice: 71,
    target: "Équipes 3 à 20 personnes",
    badge: "⭐ Le plus choisi",
    highlight: true,
    features: [
      "Tout Essential, pour toute l'équipe",
      "Assistant IA sur tous vos documents",
      "Automatisations (relances, rappels, workflows)",
      "Tableaux de bord avancés",
      "Module RH (congés, fiches)",
      "Projets & messagerie d'équipe",
      "Support prioritaire",
    ],
    cta: "Commencer l'essai gratuit",
    ctaLink: `${APP_URL}/auth`,
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
      "Portail fournisseur",
      "Connexions Google Drive / Dropbox",
      "Rapports dirigeant personnalisés",
      "Documents illimités",
      "Support dédié + accompagnement",
    ],
    cta: "Commencer l'essai gratuit",
    ctaLink: `${APP_URL}/auth`,
  },
  {
    name: "Entreprise",
    monthlyPrice: -1,
    annualPrice: -1,
    target: "+50 personnes, groupes",
    badge: "Sur mesure",
    highlight: false,
    features: [
      "Tout Manager",
      "Instance dédiée (sur étude)",
      "Connexion SSO (sur demande)",
      "Accompagnement & formation",
      "Stockage illimité",
      "Support 24h/24 7j/7",
    ],
    cta: "Nous contacter",
    ctaLink: "mailto:contact@odocpilot.com",
  },
];

const compare = [
  { label: "Devis & factures", essential: "Illimités", pro: "Illimités", manager: "Illimités", entreprise: "Illimités" },
  { label: "Utilisateurs", essential: "1", pro: "Jusqu'à 20", manager: "Illimités", entreprise: "Illimités" },
  { label: "Relances automatiques", essential: true, pro: true, manager: true, entreprise: true },
  { label: "Assistant IA", essential: false, pro: true, manager: true, entreprise: true },
  { label: "Automatisations", essential: false, pro: true, manager: true, entreprise: true },
  { label: "Module RH", essential: false, pro: true, manager: true, entreprise: true },
  { label: "Portail fournisseur", essential: false, pro: false, manager: true, entreprise: true },
  { label: "Connexion SSO", essential: false, pro: false, manager: false, entreprise: true },
];

const faqItems = [
  { question: "Y a-t-il un coût par utilisateur ?", answer: "Non. Le prix de votre plan est tout compris : vous ajoutez vos collaborateurs sans supplément caché. Vous savez exactement ce que vous payez." },
  { question: "Puis-je changer de plan à tout moment ?", answer: "Oui, vous montez ou descendez de plan quand vous voulez. Le changement prend effet immédiatement, avec un prorata automatique." },
  { question: "Y a-t-il une période d'essai ?", answer: "Oui : 14 jours gratuits sur tous les plans, sans carte bancaire. Vous testez en conditions réelles avant de décider." },
  { question: "Êtes-vous prêt pour la facture électronique 2026 ?", answer: "Oui. OdocPilot vous accompagne pas à pas vers la conformité à la réforme de la facturation électronique, pour que vous soyez en règle sans stress." },
  { question: "Mes données sont-elles en sécurité ?", answer: "Vos données sont hébergées en France (OVH), chiffrées et conformes au RGPD. Nous ne les revendons jamais, et vous pouvez les exporter à tout moment." },
  { question: "Que se passe-t-il si j'arrête ?", answer: "Aucun engagement : vous résiliez en un clic et repartez avec toutes vos données. Vous gardez un accès en lecture seule pendant 30 jours." },
];

const trustBadges = [
  { icon: "🔒", label: "Paiement sécurisé Stripe" },
  { icon: "🇫🇷", label: "Hébergé en France" },
  { icon: "↩️", label: "Satisfait ou remboursé 30 jours" },
  { icon: "📞", label: "Support réactif en français" },
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
        title="Tarifs OdocPilot — un seul prix, tout compris | Essai 14 jours gratuit"
        description="Des tarifs simples et transparents, sans coût par utilisateur. Essential 49€, Pro 89€, Manager 149€. Essai gratuit 14 jours sans carte bancaire. Hébergé en France."
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
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">Un seul prix. Tout compris.</h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground">
            Pas de coût par utilisateur. Pas d'option qui s'empile. Un abonnement clair qui remplace votre logiciel de facture, votre CRM et des heures de saisie.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">14 jours gratuits · Sans carte bancaire · Résiliable en 1 clic</p>
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
            const isCustom = plan.monthlyPrice === -1;
            const price = isCustom ? null : annual ? plan.annualPrice : plan.monthlyPrice;
            const isMail = plan.ctaLink.startsWith("mailto:");
            return (
              <MotionDiv key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.45 }}
                className={`relative flex flex-col rounded-2xl p-6 sm:p-7 bg-card ${plan.highlight ? "border-2 border-primary shadow-elevated ring-1 ring-primary/15 md:scale-[1.02]" : "border border-border shadow-card"}`}>
                {plan.highlight && plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-cta text-primary-foreground px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap">{plan.badge}</span>
                )}
                <h3 className="text-lg sm:text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{plan.target}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  {isCustom ? (
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">Sur mesure</span>
                  ) : (
                    <><span className="text-3xl font-extrabold text-foreground">{price}€</span><span className="text-muted-foreground text-sm">/mois</span></>
                  )}
                </div>
                {annual && !isCustom && <p className="mt-1 text-xs text-muted-foreground">soit {plan.annualPrice * 12}€ /an</p>}
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
      </section>

      {/* COMPARATIF */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-center">Ce qui est inclus, plan par plan</h2>
        <div className="mt-10 overflow-x-auto rounded-2xl border border-border shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/60">
                <th className="px-4 sm:px-6 py-4 text-left font-semibold text-foreground">Inclus</th>
                <th className="px-3 sm:px-4 py-4 text-center font-semibold text-foreground">Essential</th>
                <th className="px-3 sm:px-4 py-4 text-center font-semibold text-primary">Pro</th>
                <th className="px-3 sm:px-4 py-4 text-center font-semibold text-foreground">Manager</th>
                <th className="px-3 sm:px-4 py-4 text-center font-semibold text-foreground">Entreprise</th>
              </tr>
            </thead>
            <tbody>
              {compare.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <td className="px-4 sm:px-6 py-3.5 font-medium text-foreground">{row.label}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-center"><Cell value={row.essential} /></td>
                  <td className="px-3 sm:px-4 py-3.5 text-center"><Cell value={row.pro} /></td>
                  <td className="px-3 sm:px-4 py-3.5 text-center"><Cell value={row.manager} /></td>
                  <td className="px-3 sm:px-4 py-3.5 text-center"><Cell value={row.entreprise} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Garantie */}
        <div className="mt-10 rounded-2xl bg-card border border-border p-6 sm:p-8 flex items-start gap-4 shadow-card">
          <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-foreground mb-1">Satisfait ou remboursé 30 jours</h3>
            <p className="text-sm text-muted-foreground">Essayez OdocPilot sans risque. Si vous n'êtes pas convaincu dans les 30 jours, on vous rembourse intégralement. Sans question.</p>
          </div>
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
          {trustBadges.map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground font-medium"><span className="text-lg">{b.icon}</span><span>{b.label}</span></div>
          ))}
        </div>
      </section>
    </div>
  );
}
