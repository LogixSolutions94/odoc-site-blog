import { Link } from "react-router-dom";
import { MotionDiv } from "@/components/MotionDiv";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Check,
  MapPin,
  CreditCard,
  ShieldCheck,
  FileText,
} from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;
const CONFORMITE = "/diagnostic";

const invoiceRows = [
  { l: "Fournisseur", v: "Menuiserie Laurent" },
  { l: "Montant HT", v: "1 820,00 €" },
  { l: "TVA (20 %)", v: "364,00 €" },
  { l: "Échéance", v: "30/06/2026" },
];

/**
 * Hero de la landing — direction « fintech éditorial + aurora vivante ».
 * Techniques de l'état de l'art (aurora Aceternity, border-beam Magic UI)
 * ré-implémentées avec NOS tokens (orange/pétrole) : adaptatif clair/sombre,
 * aucune couleur hardcodée, animations coupées si prefers-reduced-motion.
 */
export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* ───────── Décor de fond (aurora + texture) ───────── */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-1/3 right-[-10%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.28),transparent_60%)] blur-3xl animate-[aurora_22s_ease-in-out_infinite] motion-reduce:animate-none" />
        <div className="absolute top-1/4 left-[-12%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,hsl(var(--accent)/0.20),transparent_60%)] blur-3xl animate-[aurora_27s_ease-in-out_infinite_reverse] motion-reduce:animate-none" />
        <div className="absolute bottom-[-22%] left-1/3 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,hsl(var(--primary-glow)/0.18),transparent_60%)] blur-3xl animate-[aurora_31s_ease-in-out_infinite] motion-reduce:animate-none" />
        <div className="absolute inset-0 hero-grid" />
        <div className="absolute inset-0 hero-grain" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-20 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* ───────── Colonne texte ───────── */}
          <div className="text-center lg:text-left">
            <MotionDiv initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Conformité facturation électronique 2026 / 2027
              </span>
            </MotionDiv>

            <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.6 }}>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.05] tracking-tight text-foreground">
                La réforme de la facture électronique arrive.{" "}
                <span className="bg-gradient-cta bg-clip-text text-transparent">
                  OdocPilot la prépare pour vous, vous validez en un clic.
                </span>
              </h1>
            </MotionDiv>

            <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.6 }}>
              <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg leading-relaxed text-muted-foreground">
                À partir du 1ᵉʳ septembre 2026, recevoir ses factures au format électronique devient obligatoire. OdocPilot est le copilote des dirigeants de TPE, PME et indépendants qui gèrent leur administratif{" "}
                <strong className="text-foreground">sans expert-comptable au quotidien</strong> : une intelligence artificielle française qui lit, classe et prépare vos factures et vos relances — vous gardez la décision finale.
              </p>
            </MotionDiv>

            <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.5 }}>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a href={SIGNUP} data-umami-event="cta-essai-hero" className="w-full sm:w-auto">
                  <Button size="lg" className="group w-full sm:w-auto bg-gradient-cta px-7 py-6 text-base font-bold text-primary-foreground shadow-glow hover:opacity-95">
                    Démarrer l'essai 14 jours <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </a>
                <Link to={CONFORMITE} data-umami-event="cta-conformite-hero" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-7 py-6 text-base">
                    Vérifier ma conformité (3 min)
                  </Button>
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground lg:justify-start">
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> L'IA prépare, vous validez</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> Données et IA en France</span>
                <span className="inline-flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-primary" /> Essai 14 j sans carte bancaire</span>
              </div>
            </MotionDiv>
          </div>

          {/* ───────── Colonne produit (carte + border-beam) ───────── */}
          <MotionDiv
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="relative mx-auto w-full max-w-md"
          >
            {/* halo lumineux */}
            <div className="absolute -inset-5 -z-10 rounded-[2.2rem] bg-[radial-gradient(circle_at_50%_28%,hsl(var(--primary-glow)/0.22),transparent_70%)] blur-2xl" aria-hidden="true" />

            {/* enveloppe border-beam : faisceau conique tournant masqué au bord */}
            <div className="relative rounded-[1.6rem] bg-border p-[1.5px] shadow-elevated">
              <div className="absolute inset-0 overflow-hidden rounded-[1.6rem]" aria-hidden="true">
                <div className="absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,hsl(var(--primary))_40deg,hsl(var(--primary-glow))_75deg,transparent_120deg)] animate-[spin_7s_linear_infinite] motion-reduce:animate-none" />
              </div>

              {/* carte produit */}
              <div className="relative overflow-hidden rounded-[1.5rem] bg-card">
                <div className="flex items-center gap-1.5 border-b border-border px-4 h-10">
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="ml-3 text-[11px] text-muted-foreground">app.odocpilot.com — Factures reçues</span>
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Facture lue par l'IA · à valider</p>
                  <div className="mt-3 rounded-xl border border-border p-4">
                    {invoiceRows.map((r) => (
                      <div key={r.l} className="flex items-center justify-between border-b border-border/60 py-2 text-sm">
                        <span className="text-muted-foreground">{r.l}</span>
                        <span className="rounded bg-primary/10 px-1.5 font-semibold text-foreground tabular-nums">{r.v}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between py-2 text-sm">
                      <span className="text-muted-foreground">Compte proposé</span>
                      <span className="font-semibold text-foreground">606 — Achats</span>
                    </div>
                  </div>
                  <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> L'IA a préparé — rien n'est validé sans vous
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="rounded-lg bg-gradient-cta px-4 py-2 text-sm font-semibold text-primary-foreground">Valider</span>
                    <span className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground">Corriger</span>
                  </div>
                </div>
              </div>
            </div>

            {/* badges flottants (desktop) */}
            <div className="absolute -left-4 -bottom-4 hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-card animate-float motion-reduce:animate-none sm:flex">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Factur-X conforme</span>
            </div>
            <div className="absolute -right-3 -top-3 hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-card animate-[float_3s_ease-in-out_infinite_0.7s] motion-reduce:animate-none sm:flex">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Données en France</span>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
