import { useState } from "react";
import { Link } from "react-router-dom";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { subscribeNewsletter } from "@/lib/newsletter";
import { TrustCredentials } from "@/components/TrustCredentials";
import {
  ArrowRight,
  ChevronRight,
  Check,
  Clock,
  CalendarClock,
  PlugZap,
  Search,
  FileText,
  ScanLine,
  FileOutput,
  FileCheck2,
  ClipboardCheck,
  MessageSquareText,
  Sparkles,
  HardHat,
  Store,
  Scale,
  Calculator,
  MapPin,
  ShieldCheck,
  MousePointerClick,
  FileX2,
  CreditCard,
  RotateCcw,
} from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;
// CTA conformité : pointe vers le diagnostic interactif (lead magnet n°1).
const CONFORMITE = "/diagnostic";

/* ───────── Données ───────── */

const timeline = [
  { date: "15/10/2024", title: "Fin du portail public gratuit", desc: "L'État abandonne le Portail Public de Facturation : passer par une plateforme agréée privée devient incontournable.", icon: PlugZap, tone: "muted" as const },
  { date: "01/09/2026", title: "Réception obligatoire — toutes entreprises", desc: "Toute entreprise assujettie à la TVA doit pouvoir recevoir ses factures au format électronique structuré.", icon: CalendarClock, tone: "primary" as const },
  { date: "01/09/2027", title: "Émission + e-reporting — TPE / PME", desc: "Les TPE, PME et micro-entreprises doivent à leur tour émettre leurs factures et transmettre leur e-reporting.", icon: CalendarClock, tone: "muted" as const },
];

const flow = [
  { title: "Votre entreprise", desc: "Émet et reçoit au format Factur-X", soon: false },
  { title: "Plateforme agréée (PA)", desc: "Achemine la facture et l'e-reporting", soon: true },
  { title: "Destinataire & administration", desc: "Reçoit la facture ; l'État reçoit les données", soon: false },
];

const positioning = [
  { name: "Pennylane", role: "pour le cabinet comptable" },
  { name: "Qonto", role: "pour la banque" },
  { name: "Indy", role: "pour la déclaration du TNS" },
  { name: "OdocPilot", role: "pour le dirigeant qui prépare son administratif", highlight: true },
];

const features = [
  { icon: FileText, title: "Factures au format Factur-X", desc: "Vos factures sortent au format conforme à la réforme, sans aucun paramétrage technique." },
  { icon: ScanLine, title: "Lecture intelligente des factures", desc: "Photographiez ou déposez une facture : montant, TVA et échéance sont extraits, prêts à valider." },
  { icon: FileOutput, title: "Export FEC en un clic", desc: "Un Fichier des Écritures Comptables propre, transmis à votre expert-comptable sans manipulation." },
  { icon: MessageSquareText, title: "Copilote qui répond et suggère", desc: "« Qui me doit de l'argent ce mois-ci ? » : réponse claire et action suggérée." },
];

const icp = [
  { icon: HardHat, title: "Artisan & BTP", desc: "Vos factures de matériaux sont lues à mesure et classées par chantier. Vous validez depuis le téléphone.", to: "/artisans" },
  { icon: Store, title: "Commerce & Services", desc: "Factures conformes préparées, justificatifs classés, trésorerie résumée en une phrase.", to: "/commerce" },
  { icon: Scale, title: "Professions libérales", desc: "Honoraires, justificatifs et écritures tenus prêts pour votre expert-comptable.", to: "/professions-liberales" },
  { icon: Calculator, title: "Cabinets comptables", desc: "Proposez à vos petits clients un outil qui prépare des données propres. Devenez partenaire.", to: "/cabinets-comptables" },
];

const sovereignty = [
  { icon: MapPin, t: "Hébergement en France", s: "Documents et traitement IA sur le territoire" },
  { icon: ShieldCheck, t: "Conforme RGPD", s: "Pas de transfert opaque, jamais revendues" },
  { icon: MousePointerClick, t: "Vous gardez le dernier mot", s: "Rien n'est validé sans votre accord" },
  { icon: FileOutput, t: "Vos données sont à vous", s: "Exportables à tout moment (FEC inclus)" },
];

const pricing = [
  { name: "Essential", price: "49€", annual: "39€/mois en annuel", note: "Pour l'indépendant qui centralise documents, factures et conformité." },
  { name: "Pro", price: "89€", annual: "71€/mois en annuel", note: "Le copilote IA complet : lecture, classement, relances, factures conformes.", highlight: true },
  { name: "Manager", price: "149€", annual: "119€/mois en annuel", note: "Pour les structures multi-équipes, avec un accompagnement dédié." },
];

const faqs = [
  {
    q: "Suis-je concerné par la facturation électronique en 2026, même sans expert-comptable ?",
    a: "Oui. Toute entreprise assujettie à la TVA en France devra recevoir ses factures fournisseurs au format électronique structuré dès le 1ᵉʳ septembre 2026, puis émettre les siennes et déclarer son e-reporting au 1ᵉʳ septembre 2027 pour les TPE, PME et micro-entreprises. L'obligation s'applique que vous travailliez ou non avec un cabinet — OdocPilot est justement conçu pour les dirigeants qui pilotent leur administratif eux-mêmes.",
  },
  {
    q: "Une facture électronique, c'est juste un PDF envoyé par e-mail ?",
    a: "Non, et c'est la confusion la plus répandue. La loi impose un format structuré, lisible automatiquement par les logiciels et l'administration : Factur-X (un PDF lisible doublé de données structurées intégrées), UBL ou CII. OdocPilot génère vos factures directement au format Factur-X conforme, sans le moindre paramétrage technique de votre part.",
  },
  {
    q: "OdocPilot transmet-il déjà mes factures à l'administration ?",
    a: "Soyons transparents : la transmission via une plateforme agréée (PA) est en cours de mise en place et arrivera avant l'échéance. Aujourd'hui, OdocPilot génère vos factures au format Factur-X conforme et vous prépare à l'obligation. Nous préférons vous dire précisément ce qui est actif plutôt que de promettre une transmission qui n'est pas encore branchée.",
  },
  {
    q: "L'IA fait-elle ma comptabilité à ma place, toute seule ?",
    a: "Non, et c'est un choix assumé. L'IA prépare le travail : elle lit vos factures, en extrait le fournisseur, le montant, la TVA et l'échéance, classe vos documents et prépare vos relances. Mais rien n'est engagé sans vous. Vous validez d'un clic, ou vous corrigez. Vous gardez toujours le dernier mot sur ce qui touche à votre comptabilité et à votre argent.",
  },
  {
    q: "Est-ce compatible avec mon expert-comptable ?",
    a: "Oui, totalement. OdocPilot ne remplace pas votre expert-comptable : il prépare des données propres et structurées qui lui facilitent le travail. Vous exportez votre FEC en un clic pour le lui transmettre, et vos documents sont déjà classés. L'outil s'intègre à votre organisation au lieu de la bousculer.",
  },
  {
    q: "Dois-je payer pour commencer à utiliser OdocPilot ?",
    a: "Non, et aucune mauvaise surprise. Vous démarrez gratuitement avec le palier Conformité (0€) et les outils sans compte (générateur Factur-X, diagnostic, vérificateur), sans carte bancaire. Les offres payantes sont une montée en gamme explicite que vous choisissez : jamais de prélèvement surprise. Nos tarifs sont par entreprise, sans coût par utilisateur.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://odocpilot.com/#organization",
      name: "OdocPilot",
      url: "https://odocpilot.com",
      logo: "https://odocpilot.com/favicon.svg",
      areaServed: "FR",
      description: "Copilote IA français de facturation et de conformité pour les dirigeants de TPE, PME et indépendants.",
    },
    {
      "@type": "SoftwareApplication",
      name: "OdocPilot",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "fr-FR",
      description:
        "OdocPilot prépare votre conformité à la facturation électronique 2026/2027 : génération Factur-X, lecture IA des factures, recherche de documents en langage naturel, export FEC. L'IA prépare, vous validez. Données et IA hébergées en France.",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "EUR",
        lowPrice: "0",
        highPrice: "149",
        offerCount: 4,
        offers: [
          { "@type": "Offer", name: "Conformité", price: "0", priceCurrency: "EUR" },
          { "@type": "Offer", name: "Essential", price: "49", priceCurrency: "EUR" },
          { "@type": "Offer", name: "Pro", price: "89", priceCurrency: "EUR" },
          { "@type": "Offer", name: "Manager", price: "149", priceCurrency: "EUR" },
        ],
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

export default function HomePage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await subscribeNewsletter(email, "landing", website);
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Erreur", description: result.error, variant: "destructive" });
      return;
    }
    toast({ title: "✓ Merci ! Vous êtes inscrit.", description: "Vous recevrez nos prochaines actualités." });
    setEmail("");
  }

  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Facturation électronique 2026/2027 : préparez votre conformité avec OdocPilot"
        description="Réception obligatoire au 1er septembre 2026, émission en 2027 : OdocPilot prépare votre conformité e-facture. Factur-X, lecture IA des factures, recherche en langage naturel, export FEC. L'IA prépare, vous validez. Données et IA hébergées en France. Palier Conformité gratuit, sans carte bancaire."
        canonical="/"
        jsonLd={jsonLd}
      />

      {/* ───────── HERO ───────── */}
      <section className="w-full relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                Conformité facturation électronique 2026 / 2027
              </span>
            </MotionDiv>
            <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.6 }}>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[3.1rem] font-extrabold tracking-tight leading-[1.08] text-foreground">
                La réforme de la facture électronique arrive.{" "}
                <span className="bg-gradient-cta bg-clip-text text-transparent">OdocPilot la prépare pour vous, vous validez en un clic.</span>
              </h1>
            </MotionDiv>
            <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.6 }}>
              <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
                À partir du 1ᵉʳ septembre 2026, recevoir une facture au format électronique structuré devient obligatoire pour toutes les entreprises ; l'émission suivra en 2027. OdocPilot est le copilote des dirigeants de TPE, PME et indépendants qui gèrent leur administratif{" "}
                <strong className="text-foreground">sans expert-comptable au quotidien</strong> : une intelligence artificielle française qui lit, classe et prépare vos factures et vos relances — pendant que vous gardez la décision finale.
              </p>
            </MotionDiv>
            <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.5 }}>
              <div className="mt-7 flex flex-col items-center sm:flex-row sm:justify-center flex-wrap gap-3">
                <a href={SIGNUP} data-umami-event="cta-essai-hero">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-cta text-primary-foreground font-bold px-7 py-6 text-base shadow-lg shadow-primary/20 hover:opacity-95">
                    Commencer gratuitement <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <Link to={CONFORMITE} data-umami-event="cta-conformite-hero">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-7 py-6 text-base">
                    Vérifier ma conformité (3 min)
                  </Button>
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> L'IA prépare, vous validez</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> Données et IA en France</span>
                <span className="inline-flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-primary" /> Sans carte bancaire</span>
              </div>
            </MotionDiv>
          </div>

          {/* Aperçu produit honnête : facture lue par l'IA, à valider */}
          <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="mt-12 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-border bg-card shadow-elevated overflow-hidden text-left">
              <div className="flex items-center gap-1.5 px-4 h-9 bg-muted/60 border-b border-border">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="ml-3 text-[11px] text-muted-foreground">app.odocpilot.com — Factures reçues</span>
              </div>
              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Facture lue par l'IA · à valider</p>
                <div className="mt-3 rounded-xl border border-border p-4 space-y-0">
                  {[
                    { l: "Fournisseur", v: "Menuiserie Laurent" },
                    { l: "Montant HT", v: "1 820,00 €" },
                    { l: "TVA (20 %)", v: "364,00 €" },
                    { l: "Échéance", v: "30/06/2026" },
                  ].map((r) => (
                    <div key={r.l} className="flex items-center justify-between py-2 border-b border-border/60 text-sm">
                      <span className="text-muted-foreground">{r.l}</span>
                      <span className="font-semibold text-foreground rounded bg-primary/10 px-1.5">{r.v}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-2 text-sm">
                    <span className="text-muted-foreground">Compte proposé</span>
                    <span className="font-semibold text-foreground">606 — Achats</span>
                  </div>
                </div>
                <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> L'IA a préparé — rien n'est validé sans vous
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-lg bg-gradient-cta text-primary-foreground text-sm font-semibold px-4 py-2">Valider</span>
                  <span className="rounded-lg border border-border text-muted-foreground text-sm px-4 py-2">Corriger</span>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* ───────── BANDE CONFIANCE ───────── */}
      <section className="w-full border-y border-border bg-secondary/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground font-medium">
          <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Factur-X conforme</span>
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Données et IA en France</span>
          <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Sans coût par utilisateur</span>
          <span className="inline-flex items-center gap-2"><RotateCcw className="h-4 w-4 text-primary" /> Sans engagement</span>
        </div>
      </section>

      {/* ───────── OUTILS GRATUITS (sans compte) ───────── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Gratuit, sans inscription</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Essayez tout de suite, sans créer de compte</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Pas besoin de vous inscrire pour démarrer : générez une vraie facture au format légal, vérifiez qu'une facture est conforme, ou faites le point sur vos obligations. Trois outils 100 % gratuits, directement dans votre navigateur.
          </p>
        </div>
        <div className="mt-9 grid sm:grid-cols-3 gap-4">
          <MotionDiv initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <Link to="/generateur-factur-x" className="group block h-full rounded-2xl bg-card border border-border p-6 hover:border-primary/40 hover:shadow-card-hover transition-all duration-300" data-umami-event="home-outil-generateur">
              <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10"><FileOutput className="h-5 w-5 text-primary" /></div>
              <p className="mt-4 font-bold text-foreground">Générer une facture Factur-X</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Créez une facture au format légal Factur-X (norme EN 16931) et téléchargez-la. Gratuit, sans compte.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">Créer ma facture <ArrowRight className="h-4 w-4" /></span>
            </Link>
          </MotionDiv>
          <MotionDiv initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.06, duration: 0.45 }}>
            <Link to="/verificateur" className="group block h-full rounded-2xl bg-card border border-border p-6 hover:border-primary/40 hover:shadow-card-hover transition-all duration-300" data-umami-event="home-outil-verificateur">
              <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10"><FileCheck2 className="h-5 w-5 text-primary" /></div>
              <p className="mt-4 font-bold text-foreground">Vérifier une facture</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Déposez une facture (PDF ou XML) : on contrôle ses mentions obligatoires et sa conformité à la réforme. Gratuit, sans compte.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">Vérifier une facture <ArrowRight className="h-4 w-4" /></span>
            </Link>
          </MotionDiv>
          <MotionDiv initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12, duration: 0.45 }}>
            <Link to="/diagnostic" className="group block h-full rounded-2xl bg-card border border-border p-6 hover:border-primary/40 hover:shadow-card-hover transition-all duration-300" data-umami-event="home-outil-diagnostic">
              <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10"><ClipboardCheck className="h-5 w-5 text-primary" /></div>
              <p className="mt-4 font-bold text-foreground">Diagnostic de conformité</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">En 3 minutes : votre date butoir et un plan d'action daté, adapté à votre activité. Gratuit, sans compte.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">Faire le diagnostic <ArrowRight className="h-4 w-4" /></span>
            </Link>
          </MotionDiv>
        </div>
      </section>

      {/* ───────── URGENCE / CALENDRIER ───────── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Le calendrier officiel</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Êtes-vous prêt pour le 1ᵉʳ septembre 2026 ?</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            La réception de factures électroniques devient obligatoire pour toutes les entreprises assujetties à la TVA au 1ᵉʳ septembre 2026 ; l'émission et l'e-reporting suivent en 2027. Un détail change tout : le Portail Public de Facturation gratuit de l'État a été abandonné le 15 octobre 2024 — le passage par une plateforme agréée privée devient le chemin obligatoire.
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {timeline.map((t, i) => {
            const Icon = t.icon;
            const isPrimary = t.tone === "primary";
            return (
              <MotionDiv key={t.date} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.45 }}
                className={`rounded-2xl border p-6 ${isPrimary ? "border-primary/40 bg-primary/5 shadow-card-hover" : "border-border bg-card shadow-card"}`}>
                <div className={`flex items-center justify-center h-10 w-10 rounded-xl ${isPrimary ? "bg-gradient-cta text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className={`mt-4 text-2xl font-extrabold tracking-tight tabular-nums ${isPrimary ? "text-primary" : "text-foreground"}`}>{t.date}</p>
                <p className="mt-1 font-semibold text-foreground">{t.title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </MotionDiv>
            );
          })}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Source :{" "}
          <a href="https://www.impots.gouv.fr/professionnel/facturation-electronique" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">impots.gouv.fr</a>{" "}· calendrier mis à jour en juin 2026.
        </p>
      </section>

      {/* ───────── PÉDAGOGIE — FLUX ───────── */}
      <section className="w-full bg-secondary/60 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Comprendre la réforme</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Comment circulera une facture électronique</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Une facture électronique n'est pas un PDF envoyé par e-mail : c'est un fichier au format structuré, lisible par les logiciels et l'administration. À partir de 2026, elle ne voyagera plus de boîte mail à boîte mail, mais transitera par une plateforme agréée qui l'achemine et transmet les données fiscales. Le format compte autant que le canal — et c'est là qu'OdocPilot vous met en avance.
            </p>
          </div>

          <div className="mt-10 flex flex-col md:flex-row md:items-stretch gap-3">
            {flow.map((n, i) => (
              <div key={n.title} className="contents">
                <div className={`relative flex-1 rounded-2xl border p-5 bg-card ${n.soon ? "border-primary/40" : "border-border"}`}>
                  {n.soon && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary/15 text-primary text-[10px] font-bold px-2.5 py-0.5 whitespace-nowrap">
                      transmission bientôt
                    </span>
                  )}
                  <p className="font-semibold text-foreground text-center">{n.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground text-center leading-relaxed">{n.desc}</p>
                </div>
                {i < flow.length - 1 && (
                  <div className="flex items-center justify-center text-muted-foreground/50">
                    <ChevronRight className="h-5 w-5 rotate-90 md:rotate-0" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-semibold text-foreground flex items-center gap-2"><FileX2 className="h-4 w-4 text-primary" /> Ce n'est pas un simple PDF</p>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Le format légal (Factur-X) est un PDF lisible doublé de données structurées intégrées, traitable sans ressaisie. Les formats UBL et CII suivent le même principe.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-semibold text-foreground flex items-center gap-2"><PlugZap className="h-4 w-4 text-primary" /> Le portail gratuit a disparu</p>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Depuis l'abandon du Portail Public (15/10/2024), il n'existe plus de canal public gratuit : passer par une plateforme agréée privée est devenu incontournable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── PARTI PRIS — L'IA PRÉPARE, VOUS VALIDEZ ───────── */}
      <section className="w-full bg-brand-panel text-brand-panel-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-panel-foreground/70">Notre parti pris</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">L'IA prépare, vous validez :<br />la place laissée vide par les autres.</h2>
            <p className="mt-4 text-brand-panel-foreground/80 leading-relaxed">
              La plupart des outils s'adressent aux cabinets comptables, aux banques ou aux indépendants pour leur déclaration. Peu parlent au dirigeant qui fait lui-même son administratif et n'a ni le temps ni l'envie de tout ressaisir. Notre IA prépare le travail — puis s'arrête. Rien n'est envoyé, validé ou comptabilisé sans votre accord. Cette retenue n'est pas une limite : c'est l'engagement de vous laisser la main sur ce qui engage votre entreprise.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {["L'IA lit", "classe", "prépare les relances"].map((step) => (
              <div key={step} className="contents">
                <span className="rounded-xl bg-brand-panel-foreground/10 border border-brand-panel-foreground/15 px-4 py-2.5 text-sm font-semibold">{step}</span>
                <ChevronRight className="h-5 w-5 text-brand-panel-foreground/40" />
              </div>
            ))}
            <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-cta text-primary-foreground px-4 py-2.5 text-sm font-semibold">
              <MousePointerClick className="h-4 w-4" /> Vous validez en 1 clic
            </span>
          </div>

          <div className="mt-10 max-w-xl mx-auto rounded-2xl border border-brand-panel-foreground/15 overflow-hidden">
            {positioning.map((p) => (
              <div key={p.name} className={`grid grid-cols-[1fr,1.4fr] text-sm ${p.highlight ? "bg-brand-panel-foreground/10" : ""}`}>
                <div className="px-4 py-3 border-b border-brand-panel-foreground/10 font-semibold">
                  <span className={p.highlight ? "inline-flex items-center gap-2" : ""}>{p.highlight && <Sparkles className="h-3.5 w-3.5 text-primary" />}{p.name}</span>
                </div>
                <div className={`px-4 py-3 border-b border-l border-brand-panel-foreground/10 ${p.highlight ? "text-brand-panel-foreground font-medium" : "text-brand-panel-foreground/75"}`}>{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FONCTIONNALITÉS — BENTO ───────── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Ce qu'OdocPilot fait concrètement</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Des fonctions réelles, montrées plutôt que promises</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Nous distinguons toujours ce qui est actif de ce qui arrive. Voici ce que l'outil fait réellement aujourd'hui — la transmission via plateforme agréée et le rapprochement bancaire sont annoncés honnêtement comme « bientôt ».
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 md:auto-rows-fr gap-4">
          {/* Grande cellule : recherche en langage naturel */}
          <MotionDiv initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}
            className="md:col-span-2 md:row-span-2 rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition-shadow flex flex-col">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10"><Search className="h-5 w-5 text-primary" /></div>
            <h3 className="mt-4 text-lg font-bold text-foreground">Retrouvez tout en langage naturel</h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Demandez « toutes les factures EDF de 2025 » en français courant : la GED IA les retrouve instantanément, sans dossier à créer à la main.</p>
            <div className="mt-5 flex-1 rounded-xl border border-border bg-muted/40 p-4 flex flex-col justify-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-2 text-sm text-foreground">
                <Search className="h-4 w-4 text-muted-foreground" /> factures EDF 2025
              </div>
              <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">3 résultats</span> — EDF · 01/2025 · 142,80 € · EDF · 04/2025 · 138,10 € · EDF · 09/2025 · 151,40 €</p>
            </div>
          </MotionDiv>

          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <MotionDiv key={f.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
                <h3 className="mt-3 font-bold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </MotionDiv>
            );
          })}

          <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-5">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-muted"><Clock className="h-5 w-5 text-muted-foreground" /></div>
            <h3 className="mt-3 font-bold text-foreground">Bientôt</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">Transmission via plateforme agréée, rapprochement bancaire et archivage probant — en préparation, livrés avant les échéances.</p>
          </div>
        </div>
      </section>

      {/* ───────── MÉTIERS (routeur ICP) ───────── */}
      <section className="w-full bg-secondary/60 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Votre métier, votre quotidien</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">L'administratif préparé, selon votre activité</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">La corvée est la même partout : des documents qui s'accumulent et qu'il faut traiter le soir ou le week-end. OdocPilot s'adapte au vocabulaire de chaque métier pour rendre la valeur immédiatement reconnaissable.</p>
          </div>
          <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {icp.map((c, i) => {
              const Icon = c.icon;
              return (
                <MotionDiv key={c.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.45 }}>
                  <Link to={c.to} className="group block h-full rounded-2xl bg-card border border-border p-6 hover:border-primary/40 hover:shadow-card-hover transition-all duration-300">
                    <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
                    <p className="mt-4 font-bold text-foreground">{c.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{c.desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">Découvrir <ArrowRight className="h-4 w-4" /></span>
                  </Link>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── SOUVERAINETÉ / PREUVE ───────── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Confiance et souveraineté</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Vos données et l'IA qui les traite restent en France.</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Confier ses documents comptables et clients pose une question légitime : où vont mes données, et qui peut les lire ? Vos documents sont hébergés en France, et l'intelligence artificielle qui les analyse — <strong className="text-foreground">Mistral, un modèle français</strong> — l'est également : aucun transfert vers des services américains. OdocPilot s'inscrit dans une démarche <strong className="text-foreground">Numérique Responsable</strong> et d'<strong className="text-foreground">IA frugale</strong>, conforme au RGPD et alignée sur l'AI Act européen, avec un niveau de sécurité maximal sur vos données. Cette transparence est, pour nous, la meilleure preuve de fiabilité.
          </p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {sovereignty.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.t} className="rounded-xl bg-card border border-border p-5 shadow-card">
                <Icon className="h-6 w-6 text-primary" />
                <p className="mt-2 font-semibold text-foreground text-sm">{b.t}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{b.s}</p>
              </div>
            );
          })}
        </div>
        <TrustCredentials className="mt-8" />
      </section>

      {/* ───────── TARIF TEASER (49 / 89 / 149) ───────── */}
      <section className="w-full bg-secondary/60 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Tarifs clairs, par entreprise</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Un abonnement par entreprise, sans coût par utilisateur</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Commencez gratuitement avec le palier <strong className="text-foreground">Conformité</strong> (0€), puis passez à l'offre adaptée — sans carte bancaire, et quand votre équipe s'agrandit, votre facture ne suit pas.</p>
          <div className="mt-10 grid sm:grid-cols-3 gap-5 text-left">
            {pricing.map((p) => (
              <div key={p.name} className={`relative rounded-2xl bg-card p-6 ${p.highlight ? "border-2 border-primary shadow-elevated ring-1 ring-primary/15" : "border border-border shadow-card"}`}>
                {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-cta text-primary-foreground text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">Le plus choisi</span>}
                <p className="text-sm font-semibold text-primary">{p.name}</p>
                <p className="mt-2 text-3xl font-extrabold text-foreground tabular-nums">{p.price}<span className="text-sm font-medium text-muted-foreground">/mois</span></p>
                <p className="text-xs text-muted-foreground tabular-nums">{p.annual}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Sans coût par utilisateur</span>
            <span className="inline-flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-primary" /> Sans carte bancaire</span>
            <span className="inline-flex items-center gap-1.5"><RotateCcw className="h-3.5 w-3.5 text-primary" /> Sans engagement</span>
          </div>
          <Link to="/pricing"><Button variant="outline" size="lg" className="mt-8">Voir tous les détails <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Vos questions, nos réponses franches</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">La réforme et OdocPilot, sans zone d'ombre</h2>
        </div>
        <div className="mt-10 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-bold text-foreground">{f.q}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── CTA FINAL + NEWSLETTER ───────── */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Prenez de l'avance, sans engagement</p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          La facturation électronique devient obligatoire.<br />
          <span className="bg-gradient-cta bg-clip-text text-transparent">Avec OdocPilot, vous serez déjà prêt.</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
          Préparez votre conformité face aux échéances 2026 et 2027, ou commencez directement gratuitement, sans carte bancaire, pour voir l'IA préparer votre administratif sur vos propres documents.
        </p>
        <div className="mt-8 flex flex-col items-center sm:flex-row sm:justify-center gap-3">
          <a href={SIGNUP} data-umami-event="cta-essai-final">
            <Button size="lg" className="w-full sm:w-auto bg-gradient-cta text-primary-foreground text-base font-bold px-8 py-6 shadow-lg shadow-primary/20 hover:opacity-95">
              Commencer gratuitement <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
          <Link to={CONFORMITE} data-umami-event="cta-conformite-final">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-base">Vérifier ma conformité (3 min)</Button>
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Sans engagement · Sans carte bancaire · Données en France</p>

        <div className="mt-14 pt-10 border-t border-border">
          <p className="text-sm font-semibold text-foreground">Restez informé sur la réforme et OdocPilot</p>
          <p className="text-xs text-muted-foreground mt-1">Conformité e-facture, nouveautés produit, conseils gestion — directement dans votre boîte mail.</p>
          <form onSubmit={handleNewsletter} className="mt-4 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
              <label htmlFor="hp-website">Website</label>
              <input type="text" id="hp-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <Input type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1" />
            <Button type="submit" disabled={loading} className="bg-gradient-cta text-primary-foreground">{loading ? "…" : "Je m'abonne"}</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
