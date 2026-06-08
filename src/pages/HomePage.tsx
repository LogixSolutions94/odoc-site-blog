import { useState } from "react";
import { Link } from "react-router-dom";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight,
  Check,
  HardHat,
  Store,
  Scale,
  Calculator,
  Mail,
  ReceiptText,
  FolderInput,
  MessageSquare,
  Clock,
  Banknote,
  BellRing,
  MapPin,
  ShieldCheck,
  FileCheck2,
  Quote,
} from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth`;

const icp = [
  { icon: HardHat, title: "Artisan & BTP", desc: "Devis de chantier, situations, relances d'impayés.", to: "/artisans" },
  { icon: Store, title: "Commerce & Services", desc: "Facturation, fichier clients, trésorerie au quotidien.", to: "/commerce" },
  { icon: Scale, title: "Professions libérales", desc: "Documents, rendez-vous, conformité, sérénité.", to: "/professions-liberales" },
  { icon: Calculator, title: "Cabinets comptables", desc: "Plusieurs clients, des données propres, moins de relances.", to: "/cabinets-comptables" },
];

const aiTasks = [
  { icon: Mail, title: "Il relance vos impayés, tout seul", desc: "Facture en retard ? La relance part au bon moment, au bon ton. Vous êtes payé plus vite — sans courir après personne." },
  { icon: ReceiptText, title: "Il prépare vos devis et factures", desc: "Dictez l'essentiel. Il rédige un document propre, prêt à envoyer et à signer en ligne. Le devis du dimanche soir, c'est fini." },
  { icon: FolderInput, title: "Il lit et classe vos documents", desc: "Photographiez une facture : montant, TVA, échéance — tout est saisi et rangé au bon endroit. Fini la saisie à la main." },
  { icon: MessageSquare, title: "Il répond à vos questions", desc: "« Qui me doit de l'argent ? » « Combien j'ai facturé ce mois-ci ? » Réponse immédiate, en français clair." },
];

const steps = [
  { n: "1", title: "Vous importez, il range", desc: "Photo ou glisser-déposer : vos documents sont lus, triés et saisis automatiquement. Vous ne recopiez plus une seule ligne." },
  { n: "2", title: "Vous facturez, il relance", desc: "Devis et factures en quelques secondes, prêts à signer. L'assistant relance vos clients à votre place, au bon moment." },
  { n: "3", title: "Vous pilotez, l'esprit clair", desc: "Vous voyez où va votre argent en temps réel. Plus de mauvaise surprise en fin de mois : vous décidez sereinement." },
];

const outcomes = [
  { icon: Clock, big: "−5 h", label: "d'administratif par semaine", sub: "Du temps rendu à votre métier" },
  { icon: Banknote, big: "2×", label: "plus vite payé", sub: "Devis signés & relances automatiques" },
  { icon: BellRing, big: "0", label: "impayé oublié", sub: "L'assistant n'oublie jamais une relance" },
];

const faqs = [
  { q: "Je suis nul en informatique.", a: "Si vous savez prendre une photo et envoyer un SMS, vous savez utiliser OdocPilot. Et au démarrage, un humain, en français, vous accompagne pas à pas." },
  { q: "Mes données sont-elles en sécurité ?", a: "Hébergées en France, chiffrées, jamais revendues. Vous gardez la main, et vous exportez tout quand vous voulez." },
  { q: "Et si je veux arrêter ?", a: "Sans engagement. Vous résiliez en un clic et repartez avec l'intégralité de vos données. Aucune mauvaise surprise." },
  { q: "Ça remplace mon expert-comptable ?", a: "Non — ça travaille avec lui. Vos données arrivent propres et à jour : votre comptable gagne du temps, et vous aussi." },
  { q: "Pourquoi vous, je ne vous connais pas ?", a: "Parce qu'on construit OdocPilot main dans la main avec des artisans et des TPE françaises. Vous rejoignez les premiers, et on vous écoute vraiment." },
];

const pricing = [
  { name: "Essential", price: "49€", note: "Pour l'indépendant qui veut tout centraliser." },
  { name: "Pro", price: "89€", note: "Pour les équipes — assistant IA complet.", highlight: true },
  { name: "Manager", price: "149€", note: "Multi-équipes & accompagnement dédié." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OdocPilot",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "OdocPilot réunit devis, factures, clients, documents, RH et projets dans un seul outil, avec un assistant IA qui gère l'administratif. Pour les TPE et PME françaises, hébergé en France.",
  offers: [
    { "@type": "Offer", name: "Solo", price: "49", priceCurrency: "EUR" },
    { "@type": "Offer", name: "Équipe", price: "89", priceCurrency: "EUR" },
  ],
};

export default function HomePage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim(), source: "landing" });
      if (error && error.code === "23505") {
        toast({ title: "✓ Vous êtes déjà inscrit !", description: "Cette adresse est déjà dans notre liste." });
      } else if (error) {
        throw error;
      } else {
        toast({ title: "✓ Merci ! Vous êtes inscrit.", description: "Vous recevrez nos prochaines actualités." });
      }
      setEmail("");
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue. Veuillez réessayer.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="OdocPilot — Devis, factures & gestion tout-en-un pour TPE/PME"
        description="Réunissez devis, factures, clients, RH et projets dans un seul outil, avec un assistant IA qui gère l'administratif. Hébergé en France. Essai gratuit 14 jours, sans carte bancaire."
        canonical="/"
        jsonLd={jsonLd}
      />

      {/* ───────── HERO ───────── */}
      <section className="w-full relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 -left-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5">
                <span className="animate-pulse">●</span> La facture électronique arrive en 2026 — prenez de l'avance
              </span>
            </MotionDiv>
            <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.6 }}>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.3rem] font-extrabold tracking-tight leading-[1.05] text-foreground">
                Toute la gestion de votre entreprise.{" "}
                <span className="bg-gradient-cta bg-clip-text text-transparent">Sans la paperasse.</span>
              </h1>
            </MotionDiv>
            <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.6 }}>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed">
                Devis, factures, clients, compta et documents — réunis dans un seul outil. Et un{" "}
                <strong className="text-foreground">assistant IA qui fait l'administratif à votre place</strong>, pendant que vous, vous faites votre métier.
              </p>
            </MotionDiv>
            <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.5 }}>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <a href={SIGNUP} target="_blank" rel="noopener noreferrer" data-umami-event="cta-essai-gratuit">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-cta text-primary-foreground font-bold px-7 py-6 text-base shadow-lg shadow-primary/20 hover:opacity-95">
                    Essayer gratuitement — sans carte bancaire <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <Link to="/fonctionnalites">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-7 py-6 text-base">
                    Découvrir en 2 minutes
                  </Button>
                </Link>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">14 jours gratuits · Sans engagement · Résiliable en 1 clic</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground">
                <span>🇫🇷 100% Français</span><span className="text-border">•</span>
                <span>🔒 Hébergé en France</span><span className="text-border">•</span>
                <span>🛡️ Conforme RGPD</span><span className="text-border">•</span>
                <span>🧾 Prêt pour la facture 2026</span>
              </div>
            </MotionDiv>
          </div>

          {/* Aperçu produit (mockup — remplacé par /images/hero-dashboard.webp quand fourni) */}
          <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <div className="rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 h-9 bg-muted/60 border-b border-border">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/40" />
                <span className="ml-3 text-[11px] text-muted-foreground">app.odocpilot.com</span>
              </div>
              <div className="p-4 grid grid-cols-3 gap-3">
                <div className="col-span-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Bonjour Camille 👋</p>
                    <p className="font-bold text-foreground">Votre activité aujourd'hui</p>
                  </div>
                  <span className="text-[11px] rounded-md bg-primary/10 text-primary font-semibold px-2 py-1">Assistant IA actif</span>
                </div>
                <div className="rounded-xl bg-muted/50 p-3"><p className="text-[11px] text-muted-foreground">À encaisser</p><p className="font-extrabold text-foreground text-lg">12 480 €</p></div>
                <div className="rounded-xl bg-muted/50 p-3"><p className="text-[11px] text-muted-foreground">Devis à signer</p><p className="font-extrabold text-foreground text-lg">5</p></div>
                <div className="rounded-xl bg-muted/50 p-3"><p className="text-[11px] text-muted-foreground">Relances envoyées</p><p className="font-extrabold text-primary text-lg">3 ✓</p></div>
                <div className="col-span-3 rounded-xl border border-border p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">FAC-041 · Dupont</span><span className="rounded bg-green-500/15 text-green-600 px-1.5 font-semibold">Payée</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">FAC-042 · Martin SARL</span><span className="rounded bg-amber-500/15 text-amber-600 px-1.5 font-semibold">Relancée</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">DEVIS-118 · Atelier B</span><span className="rounded bg-primary/15 text-primary px-1.5 font-semibold">À signer</span></div>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* ───────── BANDE CONFIANCE ───────── */}
      <section className="w-full border-y border-border bg-secondary/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground font-medium">
          <span className="text-foreground font-semibold">Vos données, votre entreprise, votre pays :</span>
          <span>🇫🇷 Hébergé en France (OVH)</span>
          <span>🛡️ Conforme RGPD</span>
          <span>🔒 Chiffré & sauvegardé</span>
          <span>🧾 Pensé pour la facture électronique 2026</span>
        </div>
      </section>

      {/* ───────── ROUTEUR ICP ───────── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <MotionDiv whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <p className="text-sm font-semibold text-primary">Un seul outil, votre métier</p>
          <h2 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Vous êtes… ?</h2>
          <p className="mt-2 text-muted-foreground">On vous montre OdocPilot avec les mots et les cas de votre activité.</p>
        </MotionDiv>
        <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {icp.map((c, i) => {
            const Icon = c.icon;
            return (
              <MotionDiv key={c.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.45 }}>
                <Link to={c.to} className="group block h-full rounded-2xl bg-card border border-border p-6 text-left hover:border-primary/40 hover:shadow-card-hover transition-all duration-300">
                  <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
                  <p className="mt-4 font-bold text-foreground">{c.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">Découvrir <ArrowRight className="h-4 w-4" /></span>
                </Link>
              </MotionDiv>
            );
          })}
        </div>
      </section>

      {/* ───────── PROBLÈME / EMPATHIE ───────── */}
      <section className="w-full bg-secondary/60 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <MotionDiv initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="text-primary font-semibold text-sm">On connaît votre quotidien</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold leading-tight text-foreground">
              Le devis du dimanche soir.<br />La facture qu'on oublie. Le client qui ne paie pas.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Vos papiers sont éparpillés entre le mail, le Drive, le camion et le classeur. Vous jonglez avec 5 outils qui ne se parlent pas. Et vous faites, seul, le travail de trois personnes : commercial, comptable, secrétaire.
            </p>
            <p className="mt-6 text-xl font-bold text-foreground">Ce n'est pas une fatalité. Il vous manquait juste le bon outil.</p>
          </MotionDiv>
        </div>
      </section>

      {/* ───────── COMMENT ÇA MARCHE ───────── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Simple comme bonjour.<br />Puissant comme une équipe.</h2>
          <p className="mt-4 text-muted-foreground">Trois gestes. Le reste, l'assistant s'en occupe.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <MotionDiv key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="rounded-2xl border border-border bg-card p-7 shadow-card">
              <div className="h-9 w-9 rounded-full bg-gradient-cta text-primary-foreground flex items-center justify-center font-bold">{s.n}</div>
              <h3 className="mt-4 font-bold text-lg text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </MotionDiv>
          ))}
        </div>
      </section>

      {/* ───────── L'IA POUR VOUS ───────── */}
      <section className="w-full bg-secondary/60 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">Votre assistant IA</p>
            <h2 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Il ne vous parle pas de technologie.<br />Il fait le travail à votre place.</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-5">
            {aiTasks.map((t, i) => {
              const Icon = t.icon;
              return (
                <MotionDiv key={t.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.45 }} className="rounded-2xl bg-card border border-border p-7 shadow-card">
                  <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
                  <h3 className="mt-3 font-bold text-lg text-foreground">{t.title}</h3>
                  <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">{t.desc}</p>
                </MotionDiv>
              );
            })}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">Derrière, de la technologie de pointe. Devant, une seule chose qui compte : vous gagnez du temps.</p>
        </div>
      </section>

      {/* ───────── TOUT-EN-UN ───────── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <MotionDiv initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Arrêtez de payer 5 logiciels<br />qui ne se parlent pas.</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Un outil pour les devis. Un autre pour la facture. Un CRM. Un Drive. Et des heures perdues à tout recopier de l'un à l'autre. OdocPilot remplace tout ça par <strong className="text-foreground">un seul endroit</strong> où vos données circulent enfin toutes seules — un seul abonnement, clair, sans coût par utilisateur.
          </p>
          <Link to="/pricing"><Button className="mt-6 bg-gradient-cta text-primary-foreground font-semibold">Voir le tarif tout compris <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </MotionDiv>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border p-6 bg-card">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Aujourd'hui</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>❌ Logiciel de devis</li><li>❌ Logiciel de facture</li><li>❌ CRM / fichier clients</li><li>❌ Drive + classeur</li><li>❌ Heures de ressaisie</li>
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-primary/40 bg-primary/5 p-6">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">Avec OdocPilot</p>
            <ul className="mt-3 space-y-2 text-sm text-foreground font-medium">
              <li className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />Tout au même endroit</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />Données reliées</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />Relances automatiques</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />1 abonnement clair</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />Zéro ressaisie</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ───────── RÉSULTATS ───────── */}
      <section className="w-full bg-secondary/60 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-3 gap-5">
            {outcomes.map((o, i) => {
              const Icon = o.icon;
              return (
                <MotionDiv key={o.label} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }} className="rounded-2xl bg-card border border-border p-7 text-center shadow-card">
                  <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 mb-2"><Icon className="h-5 w-5 text-primary" /></div>
                  <p className="text-4xl font-extrabold bg-gradient-cta bg-clip-text text-transparent">{o.big}</p>
                  <p className="mt-1 font-semibold text-foreground">{o.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{o.sub}</p>
                </MotionDiv>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">Objectifs constatés auprès de nos premiers utilisateurs — vos résultats dépendent de votre activité.</p>
        </div>
      </section>

      {/* ───────── SOUVERAINETÉ ───────── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-10 items-center">
        <MotionDiv initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Vos données restent en France.<br /><span className="bg-gradient-cta bg-clip-text text-transparent">Point.</span></h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">Pas de serveurs américains. Pas de revente de vos informations. Vos chiffres, vos clients, vos contrats : hébergés en France chez OVH, chiffrés, conformes RGPD. Ils n'appartiennent qu'à vous — et c'est non négociable.</p>
        </MotionDiv>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: MapPin, t: "Hébergé en France", s: "Infrastructure OVH" },
            { icon: ShieldCheck, t: "Conforme RGPD", s: "Jamais revendues" },
            { icon: ShieldCheck, t: "Chiffré & sauvegardé", s: "En sécurité, en continu" },
            { icon: FileCheck2, t: "Exportables", s: "Vous partez avec tout" },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.t} className="rounded-xl bg-card border border-border p-5 shadow-card">
                <Icon className="h-6 w-6 text-primary" />
                <p className="mt-2 font-semibold text-foreground text-sm">{b.t}</p>
                <p className="text-xs text-muted-foreground">{b.s}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────── FACTURE 2026 ───────── */}
      <section className="w-full bg-secondary/60 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5">🧾 Réforme 2026</span>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold leading-tight text-foreground">La facture électronique devient obligatoire.<br />Vous, vous serez déjà prêt.</h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">Dès 2026, toutes les entreprises devront recevoir leurs factures au format électronique. Pas de panique, pas de logiciel à changer en urgence : OdocPilot vous accompagne pas à pas vers la conformité. Vous restez en règle — sans paperasse, sans stress.</p>
          <Link to="/e-facture"><Button size="lg" className="mt-7 bg-gradient-cta text-primary-foreground font-semibold">Comprendre la réforme en 2 minutes <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </section>

      {/* ───────── PREUVE ───────── */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-sm font-semibold text-muted-foreground">Construit main dans la main avec des artisans et des TPE françaises</p>
        <MotionDiv initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-6 rounded-3xl border border-border bg-card p-9 max-w-2xl mx-auto shadow-card">
          <Quote className="h-7 w-7 text-primary/40 mx-auto" />
          <p className="mt-3 text-xl text-foreground leading-relaxed">« Avant, je faisais mes devis le dimanche soir. Maintenant, je les dicte entre deux chantiers et l'assistant s'occupe du reste. J'ai retrouvé mes week-ends. »</p>
          <div className="mt-5 flex items-center justify-center gap-3 text-sm">
            <span className="h-10 w-10 rounded-full bg-gradient-cta text-primary-foreground inline-flex items-center justify-center font-bold">K</span>
            <span className="text-muted-foreground"><strong className="text-foreground">Karim B.</strong> · Artisan plombier, Seine-et-Marne · bêta-testeur</span>
          </div>
        </MotionDiv>
        <p className="mt-4 text-sm text-muted-foreground">Vous n'achetez pas un logiciel de plus. Vous rejoignez les premiers — et on vous écoute.</p>
      </section>

      {/* ───────── TARIF TEASER ───────── */}
      <section className="w-full bg-secondary/60 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Un seul prix. Tout compris.</h2>
          <p className="mt-3 text-muted-foreground">Pas de supplément par utilisateur. Pas d'option qui s'empile. Un abonnement clair qui remplace votre logiciel de facture, votre CRM et des heures de saisie.</p>
          <div className="mt-10 grid sm:grid-cols-3 gap-5 text-left">
            {pricing.map((p) => (
              <div key={p.name} className={`relative rounded-2xl bg-card p-6 ${p.highlight ? "border-2 border-primary shadow-elevated ring-1 ring-primary/15" : "border border-border shadow-card"}`}>
                {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-cta text-primary-foreground text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">⭐ Le plus choisi</span>}
                <p className="text-sm font-semibold text-muted-foreground">{p.name}</p>
                <p className="mt-2 text-3xl font-extrabold text-foreground">{p.price}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.note}</p>
              </div>
            ))}
          </div>
          <Link to="/pricing"><Button variant="outline" size="lg" className="mt-10">Voir tous les détails <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </section>

      {/* ───────── OBJECTIONS ───────── */}
      <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold tracking-tight text-foreground text-center">Vos questions, nos réponses franches</h2>
        <div className="mt-10 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <p className="font-bold text-foreground">« {f.q} »</p>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── CTA FINAL + NEWSLETTER ───────── */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          Et si, ce soir,<br /><span className="bg-gradient-cta bg-clip-text text-transparent">la paperasse était déjà faite ?</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">Essayez OdocPilot gratuitement. En 2 minutes, sans carte bancaire. Vous verrez la différence dès la première facture.</p>
        <div className="mt-8 flex justify-center">
          <a href={SIGNUP} target="_blank" rel="noopener noreferrer" data-umami-event="cta-essai-gratuit">
            <Button size="lg" className="bg-gradient-cta text-primary-foreground text-base font-bold px-8 py-6 shadow-lg shadow-primary/20 hover:opacity-95">
              Essayer gratuitement <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">14 jours gratuits · Sans engagement · Données hébergées en France</p>

        <div className="mt-14 pt-10 border-t border-border">
          <p className="text-sm font-semibold text-foreground">Restez informé des nouveautés OdocPilot</p>
          <p className="text-xs text-muted-foreground mt-1">Conseils gestion, facture électronique, nouveautés — directement dans votre boîte mail.</p>
          <form onSubmit={handleNewsletter} className="mt-4 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <Input type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1" />
            <Button type="submit" disabled={loading} className="bg-gradient-cta text-primary-foreground">{loading ? "…" : "Je m'abonne"}</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
