import { useState } from "react";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { BackButton } from "@/components/BackButton";
import { TrustCredentials } from "@/components/TrustCredentials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight, ArrowLeft, CheckCircle, Calendar, FileText, ScanLine,
  Send, ShieldCheck, MapPin, CreditCard, RotateCcw, Sparkles,
} from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;

type Answers = { statut?: string; secteur?: string; comptable?: string };

const QUESTIONS = [
  {
    key: "statut" as const,
    label: "Vous êtes…",
    help: "Pour situer votre obligation dans le calendrier.",
    options: ["Micro-entreprise", "TPE / PME", "Profession libérale", "Autre / je ne sais pas"],
  },
  {
    key: "secteur" as const,
    label: "Votre activité principale ?",
    help: "Pour adapter votre feuille de route.",
    options: ["Artisanat & BTP", "Commerce & services", "Profession libérale", "Autre"],
  },
  {
    key: "comptable" as const,
    label: "Travaillez-vous avec un expert-comptable au quotidien ?",
    help: "Cela change la façon dont OdocPilot vous aide.",
    options: ["Oui, un cabinet me suit", "Non, je gère seul"],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Diagnostic conformité facturation électronique — OdocPilot",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "fr-FR",
  description:
    "En 3 questions, vérifiez votre situation face à l'obligation de facturation électronique 2026/2027 et obtenez votre feuille de route datée.",
};

export default function DiagnosticPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(0); // 0..2 questions, 3 = résultat
  const [answers, setAnswers] = useState<Answers>({});
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const progress = Math.round((Math.min(step, 3) / 3) * 100);

  function choose(key: keyof Answers, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  }

  async function captureEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim(), source: "diagnostic" });
      if (error && error.code !== "23505") throw error;
      setSent(true);
      toast({ title: "✓ C'est noté !", description: "Votre feuille de route et la checklist arrivent par email." });
    } catch {
      toast({ title: "Erreur", description: "Réessayez dans un instant.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  const soloMode = answers.comptable === "Non, je gère seul";

  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Diagnostic conformité e-facture 2026 en 3 minutes | OdocPilot"
        description="Êtes-vous prêt pour la facturation électronique obligatoire 2026/2027 ? Répondez à 3 questions et obtenez votre feuille de route datée, gratuitement. Données et IA en France."
        canonical="/diagnostic"
        jsonLd={jsonLd}
      />
      <BackButton to="/e-facture" label="← La réforme e-facture" />

      <section className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        {/* En-tête */}
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            Diagnostic conformité · 3 minutes · gratuit
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Êtes-vous prêt pour la facture électronique&nbsp;?
          </h1>
          <p className="mt-3 text-muted-foreground">
            Trois questions, et vous repartez avec votre feuille de route datée. Sans jargon, sans inscription.
          </p>
        </div>

        {/* Barre de progression */}
        <div className="mt-8 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-gradient-cta transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Questions */}
        {step < 3 && (
          <MotionDiv key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
              <p className="text-xs font-medium text-muted-foreground">Question {step + 1} / 3</p>
              <h2 className="mt-1 text-xl font-bold text-foreground">{QUESTIONS[step].label}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{QUESTIONS[step].help}</p>
              <div className="mt-5 grid gap-3">
                {QUESTIONS[step].options.map((opt) => {
                  const active = answers[QUESTIONS[step].key] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => choose(QUESTIONS[step].key, opt)}
                      data-umami-event={`diagnostic-q${step + 1}`}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all ${
                        active
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary/50"
                      }`}
                    >
                      {opt}
                      <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  );
                })}
              </div>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Question précédente
                </button>
              )}
            </div>
          </MotionDiv>
        )}

        {/* Résultat */}
        {step >= 3 && (
          <MotionDiv initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Votre feuille de route
              </div>
              <h2 className="mt-3 text-2xl font-bold text-foreground">
                Vous êtes concerné par la réforme — et c'est gérable.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Comme toute entreprise assujettie à la TVA{answers.secteur ? ` (${answers.secteur.toLowerCase()})` : ""}, vous devez vous préparer.
                {soloMode
                  ? " Vous gérez votre administratif vous-même : OdocPilot le prépare à votre place, vous gardez le dernier mot."
                  : " Votre cabinet reste dans la boucle : OdocPilot prépare des données propres et exporte votre FEC en un clic."}
              </p>

              {/* Échéances */}
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {[
                  { d: "01/09/2026", t: "Réception obligatoire", s: "Recevoir vos factures fournisseurs au format électronique via une plateforme agréée." },
                  { d: "01/09/2027", t: "Émission + e-reporting", s: "Émettre vos factures au format électronique et transmettre votre e-reporting." },
                ].map((x) => (
                  <div key={x.d} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Calendar className="h-4 w-4" />
                      <span className="text-lg font-extrabold tracking-tight tabular-nums text-foreground">{x.d}</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground">{x.t}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{x.s}</p>
                  </div>
                ))}
              </div>

              {/* Plan 3 étapes */}
              <div className="mt-6 space-y-3">
                {[
                  { icon: FileText, t: "Générez vos factures au format Factur-X", s: "Disponible aujourd'hui dans OdocPilot, sans paramétrage.", soon: false },
                  { icon: ScanLine, t: "Centralisez vos factures reçues", s: "L'IA les lit, extrait montant/TVA/échéance et les classe. Vous validez.", soon: false },
                  { icon: Send, t: "Transmettez via plateforme agréée", s: "Raccordement en cours — vous serez prêt le jour J.", soon: true },
                ].map((x, i) => {
                  const Icon = x.icon;
                  return (
                    <div key={x.t} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" /> {x.t}
                          {x.soon && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">bientôt</span>}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{x.s}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Capture email */}
              {!sent ? (
                <form onSubmit={captureEmail} className="mt-7 rounded-xl border border-border bg-card p-5">
                  <p className="text-sm font-semibold text-foreground">Recevez votre feuille de route + la checklist conformité</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Un email clair, daté, sans spam. Vous pouvez vous désinscrire à tout moment.</p>
                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <Input type="email" required placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1" />
                    <Button type="submit" disabled={loading} className="bg-gradient-cta text-primary-foreground font-semibold" data-umami-event="diagnostic-email">
                      {loading ? "…" : "Recevoir ma feuille de route"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="mt-7 rounded-xl border border-primary/30 bg-card p-5 flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="h-5 w-5 text-primary" /> C'est envoyé — vérifiez votre boîte mail.
                </div>
              )}

              {/* CTA essai */}
              <div className="mt-7 text-center">
                <p className="text-sm text-muted-foreground">Envie de voir l'IA préparer votre administratif sur vos propres documents&nbsp;?</p>
                <a href={SIGNUP} data-umami-event="diagnostic-cta-essai">
                  <Button size="lg" className="mt-3 bg-gradient-cta text-primary-foreground font-bold px-8">
                    Démarrer l'essai 14 jours <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><CreditCard className="h-3.5 w-3.5 text-primary" /> Sans carte bancaire</span>
                  <span className="inline-flex items-center gap-1"><RotateCcw className="h-3.5 w-3.5 text-primary" /> Sans engagement</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> Données en France</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setStep(0); setAnswers({}); setSent(false); }}
                className="mt-6 mx-auto block text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                ↺ Recommencer le diagnostic
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              <ShieldCheck className="inline h-3.5 w-3.5 mr-1 text-primary" />
              Diagnostic basé sur les textes officiels (réforme de la facturation électronique).
            </p>
            <TrustCredentials className="mt-6" />
          </MotionDiv>
        )}
      </section>
    </div>
  );
}
