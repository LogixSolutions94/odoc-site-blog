import { Link } from "react-router-dom";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, HardHat, FileSignature, BellRing, Wallet, Quote } from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;

const pains = [
  "Le devis tapé le dimanche soir, après le chantier",
  "Les situations de travaux qu'on oublie de facturer",
  "Le client qui ne paie pas, et qu'on n'ose pas relancer",
  "Les bons et factures qui traînent dans le camion",
];

const wins = [
  { icon: FileSignature, title: "Vos devis de chantier, signés plus vite", desc: "Dictez l'essentiel, l'assistant rédige un devis propre et chiffré. Le client le signe en ligne — vous démarrez le chantier sans attendre." },
  { icon: BellRing, title: "Vos impayés relancés tout seuls", desc: "L'assistant relance vos clients au bon moment, au bon ton. Vous êtes payé plus vite, sans la gêne de réclamer." },
  { icon: Wallet, title: "Votre trésorerie, claire en un regard", desc: "Ce qui reste à encaisser, ce qui est payé, ce qui arrive : vous savez où vous en êtes, sans tableur ni comptable." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OdocPilot — pour les artisans du bâtiment",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "OdocPilot pour les artisans du BTP : devis de chantier et factures au format Factur-X conforme, relances préparées automatiquement, lecture IA des factures. L'IA prépare, vous validez. Conformité facture électronique 2026/2027. Données et IA hébergées en France.",
  offers: [{ "@type": "Offer", price: "49.99", priceCurrency: "EUR" }],
};

export default function ArtisansPage() {
  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Logiciel de gestion pour artisans & BTP — devis, factures, relances | OdocPilot"
        description="OdocPilot gère vos devis de chantier, vos factures, vos relances d'impayés et la facture électronique 2026 — pendant que vous êtes sur le terrain. Hébergé en France, essai gratuit 14 jours."
        canonical="/artisans"
        jsonLd={jsonLd}
      />

      {/* HERO */}
      <section className="w-full relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 -left-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5">
                <HardHat className="h-3.5 w-3.5" /> Pensé pour les artisans du bâtiment
              </span>
            </MotionDiv>
            <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.6 }}>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.3rem] font-extrabold tracking-tight leading-[1.05] text-foreground">
                Votre métier, c'est le chantier.{" "}
                <span className="bg-gradient-cta bg-clip-text text-transparent">Pas la paperasse.</span>
              </h1>
            </MotionDiv>
            <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.6 }}>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed">
                OdocPilot prépare vos <strong className="text-foreground">devis, factures et relances</strong>, et une{" "}
                <strong className="text-foreground">IA</strong> prépare votre administratif pendant que vous êtes sur le terrain — vous validez d'un clic.
              </p>
            </MotionDiv>
            <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.5 }}>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <a href={SIGNUP} target="_blank" rel="noopener noreferrer" data-umami-event="cta-essai-gratuit">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-cta text-primary-foreground font-bold px-7 py-6 text-base shadow-lg shadow-primary/20 hover:opacity-95">
                    Je teste gratuitement <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <Link to="/pricing"><Button size="lg" variant="outline" className="w-full sm:w-auto px-7 py-6 text-base">Voir le tarif</Button></Link>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">14 jours gratuits · Sans carte bancaire · Hébergé en France</p>
            </MotionDiv>
          </div>

          <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <div className="rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 h-9 bg-muted/60 border-b border-border">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" /><span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" /><span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="ml-3 text-[11px] text-muted-foreground">app.odocpilot.com</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between"><p className="font-bold text-foreground">Bonjour Karim</p><span className="text-[11px] rounded-md bg-primary/10 text-primary font-semibold px-2 py-1">Copilote IA</span></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted/50 p-3"><p className="text-[11px] text-muted-foreground">À encaisser</p><p className="font-extrabold text-foreground text-lg tabular-nums">12 480 €</p></div>
                  <div className="rounded-xl bg-muted/50 p-3"><p className="text-[11px] text-muted-foreground">Relances préparées</p><p className="font-extrabold text-primary text-lg">3</p></div>
                </div>
                <div className="rounded-xl border border-border p-3 text-sm text-muted-foreground flex items-start gap-2"><FileSignature className="h-4 w-4 text-primary shrink-0 mt-0.5" /> « Le devis du chantier Bât. C est prêt — à valider et envoyer. »</div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* PROBLÈME */}
      <section className="w-full bg-secondary/60 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">On connaît la chanson.</h2>
          <ul className="mt-8 grid sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto">
            {pains.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-xl bg-card border border-border p-4 text-sm text-foreground"><span className="text-primary">✗</span>{p}</li>
            ))}
          </ul>
          <p className="mt-8 text-xl font-bold text-foreground">Vous n'avez pas monté votre boîte pour faire de la paperasse.</p>
        </div>
      </section>

      {/* CE QU'ODOC FAIT */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Ce qu'OdocPilot fait pendant que vous travaillez</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {wins.map((w, i) => {
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

      {/* FACTURE 2026 ARTISAN */}
      <section className="w-full bg-secondary/60 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5"><FileSignature className="h-3.5 w-3.5" /> Réforme 2026</span>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold leading-tight text-foreground">La facture électronique, sans prise de tête</h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">Dès le 1ᵉʳ septembre 2026, vous devrez recevoir vos factures au format électronique ; l'émission suivra en 2027. OdocPilot génère vos factures au format légal Factur-X et vous accompagne pas à pas — pas de logiciel à changer en catastrophe.</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            {["Factur-X conforme", "Accompagnement en français", "Pensé pour les artisans"].map((t) => (
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
          <p className="mt-3 text-xl text-foreground leading-relaxed">« Avant, je faisais mes devis le dimanche soir. Maintenant, je les dicte entre deux chantiers et l'assistant s'occupe du reste. J'ai retrouvé mes week-ends. »</p>
          <div className="mt-5 flex items-center justify-center gap-3 text-sm">
            <span className="h-10 w-10 rounded-full bg-gradient-cta text-primary-foreground inline-flex items-center justify-center font-bold">K</span>
            <span className="text-muted-foreground"><strong className="text-foreground">Karim B.</strong> · Artisan plombier, Seine-et-Marne · bêta-testeur</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">Et si, ce soir,<br /><span className="bg-gradient-cta bg-clip-text text-transparent">le devis était déjà parti ?</span></h2>
        <p className="mt-5 text-lg text-muted-foreground">Testez OdocPilot gratuitement. 2 minutes, sans carte bancaire.</p>
        <div className="mt-8 flex justify-center">
          <a href={SIGNUP} target="_blank" rel="noopener noreferrer" data-umami-event="cta-essai-gratuit">
            <Button size="lg" className="bg-gradient-cta text-primary-foreground text-base font-bold px-8 py-6 shadow-lg shadow-primary/20 hover:opacity-95">Je teste gratuitement <ArrowRight className="ml-2 h-5 w-5" /></Button>
          </a>
        </div>
      </section>
    </div>
  );
}
