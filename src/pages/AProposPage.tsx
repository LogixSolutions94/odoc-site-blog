import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { Target, ShieldCheck, Handshake, MapPin, Check, ArrowRight, Sparkles, MousePointerClick } from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;

const values = [
  { icon: Target, title: "Simplicité", description: "Un outil qu'un dirigeant non-technicien prend en main en quelques minutes. Pas un ERP à apprendre." },
  { icon: ShieldCheck, title: "Souveraineté", description: "Vos documents et l'intelligence artificielle qui les traite sont hébergés en France. Aucun transfert opaque vers l'étranger." },
  { icon: Handshake, title: "Honnêteté", description: "Nous disons précisément ce qui est actif et ce qui arrive. Ce qui n'est pas encore prêt est annoncé « bientôt », jamais survendu." },
];

const facts = [
  { icon: MapPin, label: "Données et IA hébergées en France" },
  { icon: ShieldCheck, label: "Conforme RGPD, aligné sur l'AI Act" },
  { icon: MousePointerClick, label: "L'IA prépare, vous validez" },
  { icon: Check, label: "Sans coût par utilisateur" },
];

export default function AProposPage() {
  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="À propos — OdocPilot | Le copilote IA des dirigeants de TPE"
        description="OdocPilot prépare la conformité à la facturation électronique 2026/2027 et l'administratif des dirigeants de TPE, PME et indépendants sans expert-comptable. L'IA prépare, vous validez. Données et IA hébergées en France."
        canonical="/a-propos"
      />

      {/* Hero */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-14 text-center">
        <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Qui sommes-nous</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            L'admin préparé pour vous. <span className="bg-gradient-cta bg-clip-text text-transparent">Vous gardez la main.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            OdocPilot est né d'un constat simple : un dirigeant de TPE qui gère lui-même son administratif passe ses soirées et ses week-ends sur la paperasse — et la réforme de la facturation électronique 2026/2027 ajoute une obligation de plus. Nous construisons l'outil qui prépare ce travail à sa place, sans jamais décider à sa place.
          </p>
        </MotionDiv>
      </section>

      {/* Mission */}
      <section className="w-full py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <MotionDiv initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Notre mission</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Rendre l'administratif invisible pour le dirigeant de TPE</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              La plupart des outils s'adressent aux cabinets comptables, aux banques ou aux indépendants pour leur déclaration. Presque personne ne parle au dirigeant qui fait lui-même son administratif au quotidien. C'est ce créneau qu'OdocPilot occupe : une intelligence artificielle française qui lit vos factures, classe vos documents et prépare vos relances — puis s'arrête. Rien n'est validé, envoyé ni comptabilisé sans vous.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Notre conviction : la rapidité d'un assistant ne doit jamais vous coûter le contrôle de ce qui engage votre entreprise. L'IA fait disparaître la corvée, pas votre décision.
            </p>
          </MotionDiv>
          <MotionDiv initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5 }}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><MapPin className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="font-bold text-foreground">Une équipe française, en transparence</p>
                  <p className="text-sm text-muted-foreground">Basée en Île-de-France · build-in-public</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                OdocPilot est construit par une petite équipe française qui partage son avancement ouvertement — sur le blog et la page roadmap. Nous travaillons main dans la main avec des dirigeants de TPE et des indépendants testeurs, et nous écoutons vraiment leurs retours.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {facts.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-xs text-foreground">
                      <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" /> {f.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Valeurs */}
      <section className="w-full py-20 bg-secondary/50 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Ce qui nous guide</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Nos valeurs</h2>
          </MotionDiv>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <MotionDiv key={v.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }}
                  className="rounded-2xl border border-border bg-card p-7 text-center shadow-card hover:shadow-card-hover transition-shadow">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10"><Icon className="h-7 w-7 text-primary" /></div>
                  <h3 className="text-xl font-bold text-foreground">{v.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="w-full py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotionDiv initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border bg-card p-10 sm:p-14 shadow-elevated">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Prêt à prendre de l'avance sur la réforme ?</h2>
            <p className="mt-4 text-lg text-muted-foreground">Vérifiez votre conformité en 3 minutes, gratuitement — ou commencez gratuitement sur vos propres documents.</p>
            <div className="mt-8 flex flex-col items-center sm:flex-row sm:justify-center gap-3">
              <Link to="/diagnostic" data-umami-event="apropos-diagnostic">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-cta text-primary-foreground font-bold px-8 py-6"><Sparkles className="mr-2 h-5 w-5" /> Vérifier ma conformité (3 min)</Button>
              </Link>
              <a href={SIGNUP} target="_blank" rel="noopener noreferrer" data-umami-event="apropos-essai">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6">Commencer gratuitement <ArrowRight className="ml-2 h-5 w-5" /></Button>
              </a>
            </div>
          </MotionDiv>
        </div>
      </section>
    </div>
  );
}
