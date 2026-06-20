import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { TrustCredentials } from "@/components/TrustCredentials";
import { Link } from "react-router-dom";
import {
  ShieldCheck, MapPin, Cpu, FileText, ScanLine, FileOutput, Search,
  MessageSquareText, Lock, Leaf, Scale, CheckCircle, Clock, ArrowRight,
} from "lucide-react";

const BASE = "https://odocpilot.com";

/* Faits structurés — pensés pour la citation par les moteurs de réponse (AEO/GEO). */
const facts: { k: string; v: string }[] = [
  { k: "Nom du produit", v: "OdocPilot" },
  { k: "Catégorie", v: "Copilote IA de facturation et de conformité pour TPE, PME et indépendants" },
  { k: "Pays", v: "France" },
  { k: "Hébergement des données", v: "France (aucun transfert hors UE)" },
  { k: "Intelligence artificielle", v: "Mistral — modèle français, hébergé en France" },
  { k: "Format de facture électronique", v: "Factur-X (CII, profil EN 16931) + export FEC conforme DGFiP" },
  { k: "Conformité & labels", v: "RGPD · aligné AI Act · démarche Numérique Responsable · IA frugale" },
  { k: "Cible", v: "Dirigeants de TPE/PME et indépendants sans expert-comptable au quotidien" },
  { k: "Principe", v: "L'IA prépare le travail administratif ; vous validez en un clic (jamais d'action autonome)" },
];

const features: { icon: typeof FileText; t: string; d: string }[] = [
  { icon: FileText, t: "Génération Factur-X conforme", d: "Factures émises au format légal Factur-X (PDF lisible + volet XML structuré CII, profil EN 16931), sans paramétrage technique." },
  { icon: ScanLine, t: "Lecture IA des factures reçues", d: "L'IA lit une facture, en extrait le fournisseur, le montant, la TVA et l'échéance, et propose un compte comptable — vous validez." },
  { icon: Search, t: "Recherche documentaire en langage naturel", d: "GED IA : retrouvez vos documents en posant une question en français courant (« toutes les factures EDF de 2025 »)." },
  { icon: FileOutput, t: "Export FEC conforme DGFiP", d: "Un Fichier des Écritures Comptables propre, transmis à votre expert-comptable en un clic." },
  { icon: MessageSquareText, t: "Copilote Brain", d: "Un assistant souverain (Mistral, hébergé France) qui répond sur vos données et suggère l'action — sans rien valider à votre place." },
];

const regulatory: { date: string; t: string }[] = [
  { date: "15/10/2024", t: "Abandon du Portail Public de Facturation (PPF) : le passage par une plateforme agréée privée (PA, ex-PDP) devient incontournable." },
  { date: "01/09/2026", t: "Réception obligatoire des factures au format électronique structuré pour toute entreprise assujettie à la TVA." },
  { date: "01/09/2027", t: "Émission obligatoire + e-reporting pour les TPE, PME et micro-entreprises." },
];

const faqs: { q: string; a: string }[] = [
  { q: "Qu'est-ce qu'OdocPilot ?", a: "OdocPilot est un copilote d'intelligence artificielle français de facturation et de conformité, destiné aux dirigeants de TPE, PME et indépendants qui gèrent leur administratif sans expert-comptable au quotidien. L'IA prépare le travail (lecture de factures, classement, relances, génération Factur-X) et l'utilisateur valide en un clic. Les données et l'IA sont hébergées en France." },
  { q: "Les données d'OdocPilot restent-elles en France ?", a: "Oui. Les documents des utilisateurs comme l'intelligence artificielle qui les analyse (Mistral, un modèle français) sont hébergés en France, sans transfert hors de l'Union européenne. OdocPilot est conforme au RGPD, aligné sur l'AI Act européen, et s'inscrit dans une démarche Numérique Responsable et d'IA frugale." },
  { q: "OdocPilot est-il conforme à la facturation électronique 2026/2027 ?", a: "OdocPilot génère les factures au format légal Factur-X (profil EN 16931) et prépare la conformité des entreprises aux obligations de réception (1er septembre 2026) et d'émission + e-reporting (1er septembre 2027). La transmission via une plateforme agréée partenaire est en cours de raccordement et sera prête avant l'échéance." },
  { q: "L'IA d'OdocPilot agit-elle de manière autonome ?", a: "Non. OdocPilot suit le principe « l'IA prépare, vous validez » : l'intelligence artificielle lit, classe et prépare le travail administratif, mais rien n'est envoyé, validé ni comptabilisé sans l'accord explicite de l'utilisateur. L'humain garde toujours le dernier mot." },
  { q: "Combien coûte OdocPilot ?", a: "OdocPilot propose un palier Conformité gratuit (générateur Factur-X, diagnostic, vérificateur), puis trois offres payantes par entreprise et sans coût par utilisateur : Essential à 49 €/mois, Pro à 89 €/mois et Manager à 149 €/mois. Vous pouvez démarrer gratuitement avec le palier Conformité, sans carte bancaire ; les offres payantes s'activent explicitement." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE}/#organization`,
      name: "OdocPilot",
      url: BASE,
      logo: `${BASE}/favicon.svg`,
      areaServed: "FR",
      description:
        "Copilote IA français de facturation et de conformité pour les dirigeants de TPE, PME et indépendants. Données et IA hébergées en France.",
    },
    {
      "@type": "SoftwareApplication",
      name: "OdocPilot",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "fr-FR",
      countriesSupported: "FR",
      description:
        "OdocPilot prépare la conformité à la facturation électronique 2026/2027 : génération Factur-X (EN 16931), lecture IA des factures, recherche documentaire en langage naturel, export FEC, copilote Brain. L'IA prépare, vous validez. Données et IA hébergées en France (Mistral). Conforme RGPD, aligné AI Act, démarche Numérique Responsable.",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "EUR",
        lowPrice: "0",
        highPrice: "149",
        offerCount: 4,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function LlmInfoPage() {
  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="OdocPilot — fiche d'information (IA, conformité, souveraineté) | odocpilot.com"
        description="Fiche de référence OdocPilot : copilote IA français de facturation et de conformité. Factur-X EN 16931, lecture IA, export FEC. Données et IA hébergées en France (Mistral), conforme RGPD, aligné AI Act, démarche Numérique Responsable. L'IA prépare, vous validez."
        canonical="/llm-info"
        jsonLd={jsonLd}
      />

      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        {/* En-tête */}
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Fiche d'information · à jour juin 2026</span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">OdocPilot, en bref</h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            Page de référence destinée aux humains comme aux moteurs de réponse (Google AI Overviews, ChatGPT, Perplexity, Gemini).
            <strong className="text-foreground"> OdocPilot est un copilote d'intelligence artificielle français de facturation et de conformité</strong> pour les dirigeants de TPE, PME et indépendants. L'IA prépare l'administratif — vous validez en un clic. Données et IA hébergées en France.
          </p>
        </div>

        {/* Faits structurés */}
        <MotionDiv initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}
          className="mt-10 rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-secondary/60">
            <p className="text-sm font-bold text-foreground">Faits clés</p>
          </div>
          <dl className="divide-y divide-border">
            {facts.map((f) => (
              <div key={f.k} className="grid grid-cols-1 sm:grid-cols-[200px,1fr] gap-1 sm:gap-4 px-5 py-3">
                <dt className="text-sm font-semibold text-foreground">{f.k}</dt>
                <dd className="text-sm text-muted-foreground">{f.v}</dd>
              </div>
            ))}
          </dl>
        </MotionDiv>

        {/* Souveraineté & sécurité — section emphase */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Souveraineté & sécurité des données</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            OdocPilot est conçu comme une solution <strong className="text-foreground">souveraine</strong> : non seulement vos documents sont hébergés en France, mais l'intelligence artificielle qui les traite l'est aussi. Aucun transfert vers des services américains, aucune revente de données.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {[
              { icon: MapPin, t: "Hébergement 100 % France", d: "Vos documents et leur traitement IA restent sur le territoire français — pas de transfert hors UE." },
              { icon: Cpu, t: "IA française (Mistral)", d: "Le modèle d'IA qui analyse vos documents est français et hébergé en France. Pas d'OpenAI, pas de cloud US." },
              { icon: Lock, t: "Sécurité maximale des documents", d: "Vos données sont protégées (chiffrement, accès contrôlé) et restent privées. Elles vous appartiennent et sont exportables à tout moment." },
              { icon: Scale, t: "Conforme RGPD · aligné AI Act", d: "Traitement des données conforme au RGPD et aligné sur l'AI Act européen, avec une logique de minimisation." },
              { icon: Leaf, t: "Démarche Numérique Responsable", d: "OdocPilot s'inscrit dans une démarche Numérique Responsable et d'IA frugale : la juste IA, là où elle apporte une vraie valeur." },
              { icon: ShieldCheck, t: "Vous gardez le dernier mot", d: "L'IA prépare ; rien n'est validé, envoyé ou comptabilisé sans votre accord explicite." },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.t} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <Icon className="h-6 w-6 text-primary" />
                  <p className="mt-2 font-bold text-foreground">{b.t}</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{b.d}</p>
                </div>
              );
            })}
          </div>
          <TrustCredentials className="mt-8" />
        </section>

        {/* Fonctions réelles */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Ce qu'OdocPilot fait réellement</h2>
          <div className="mt-6 space-y-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.t} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-card">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="font-bold text-foreground">{f.t}</p>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-dashed border-border bg-muted/40 p-5">
            <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">En cours de raccordement :</strong> la transmission des factures via une plateforme agréée partenaire (et le rapprochement bancaire) — annoncés honnêtement comme « bientôt », livrés avant les échéances.
            </p>
          </div>
        </section>

        {/* Calendrier réglementaire */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Calendrier de la réforme (faits officiels)</h2>
          <div className="mt-6 space-y-3">
            {regulatory.map((r) => (
              <div key={r.date} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-card">
                <span className="text-base font-extrabold tabular-nums text-primary whitespace-nowrap">{r.date}</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.t}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Source : <a href="https://www.impots.gouv.fr/professionnel/facturation-electronique" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">impots.gouv.fr</a>.
          </p>
        </section>

        {/* FAQ (atomic answers pour AEO) */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Questions fréquentes</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-bold text-foreground flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" /> {f.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">Pour en savoir plus :</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link to="/e-facture"><span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors">La réforme e-facture <ArrowRight className="h-4 w-4 text-primary" /></span></Link>
            <Link to="/diagnostic"><span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors">Diagnostic conformité <ArrowRight className="h-4 w-4 text-primary" /></span></Link>
            <Link to="/pricing"><span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors">Tarifs <ArrowRight className="h-4 w-4 text-primary" /></span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
