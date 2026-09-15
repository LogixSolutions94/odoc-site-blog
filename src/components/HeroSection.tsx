import { useEffect, useRef, useState, type ReactNode } from "react";
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
  CheckCircle2,
  Send,
  FileOutput,
} from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;
const CONFORMITE = "/diagnostic";

/* Champs de la facture « lue par l'IA » (montants → count-up). */
const FIELDS: { l: string; text?: string; amount?: number }[] = [
  { l: "Fournisseur", text: "Menuiserie Laurent" },
  { l: "Montant HT", amount: 1820 },
  { l: "TVA (20 %)", amount: 364 },
  { l: "Échéance", text: "30/06/2026" },
  { l: "Compte proposé", text: "606 — Achats" },
];

const ENTITIES = [
  "Factur-X", "e-reporting 2027", "EN 16931", "Export FEC",
  "IA Mistral — France", "RGPD", "PDF/A-3 · UBL · CII", "Plateforme agréée",
];

/* ───────── Hooks & helpers ───────── */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

function daysUntil(dateStr: string) {
  const t = new Date(`${dateStr}T00:00:00`).getTime();
  const d = Math.ceil((t - Date.now()) / 86_400_000);
  return d > 0 ? d : 0;
}
function useDaysUntil(dateStr: string) {
  const [days, setDays] = useState(() => daysUntil(dateStr));
  useEffect(() => {
    const id = window.setInterval(() => setDays(daysUntil(dateStr)), 60_000);
    return () => clearInterval(id);
  }, [dateStr]);
  return days;
}

/* Compteur animé (montants & stat). */
function CountUp({ value, active, reduced, decimals = 2, suffix = " €" }: {
  value: number; active: boolean; reduced: boolean; decimals?: number; suffix?: string;
}) {
  const [n, setN] = useState(reduced ? value : 0);
  useEffect(() => {
    if (reduced) { setN(value); return; }
    if (!active) { setN(0); return; }
    let raf = 0, t0 = 0;
    const dur = 650;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min(1, (ts - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setN(value * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value, reduced]);
  return <>{n.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}

/* Bouton magnétique (suit légèrement le curseur, desktop). */
function Magnetic({ children, reduced, strength = 14 }: { children: ReactNode; reduced: boolean; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  function move(e: React.MouseEvent) {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - (r.left + r.width / 2)) / r.width) * strength;
    const y = ((e.clientY - (r.top + r.height / 2)) / r.height) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }
  function leave() { if (ref.current) ref.current.style.transform = ""; }
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={leave} className="inline-block transition-transform duration-200 will-change-transform">
      {children}
    </div>
  );
}

/* ───────── Hero ───────── */

export function HeroSection() {
  const reduced = usePrefersReducedMotion();
  const days = useDaysUntil("2026-09-01");
  const sectionRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  const N = FIELDS.length;
  const [revealed, setRevealed] = useState(0);
  const [scanning, setScanning] = useState(true);
  const [validated, setValidated] = useState(false);
  const [relance, setRelance] = useState(false);
  const [fec, setFec] = useState(false);

  // Boucle « démo produit » : scan → remplissage champ par champ → valider → relance → FEC → reset.
  useEffect(() => {
    if (reduced) {
      setRevealed(N); setScanning(false); setValidated(true); setRelance(true); setFec(true);
      return;
    }
    let timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const cycle = () => {
      setRevealed(0); setScanning(true); setValidated(false); setRelance(false); setFec(false);
      at(500, () => setRevealed(1));
      at(1050, () => setRevealed(2));
      at(1600, () => setRevealed(3));
      at(2150, () => setRevealed(4));
      at(2700, () => setRevealed(5));
      at(2950, () => setScanning(false));
      at(3900, () => setValidated(true));
      at(4600, () => setRelance(true));
      at(5300, () => setFec(true));
      at(7800, () => { timers.forEach(clearTimeout); timers = []; cycle(); });
    };
    cycle();
    return () => timers.forEach(clearTimeout);
  }, [reduced, N]);

  function onSectionMove(e: React.MouseEvent) {
    if (reduced || !spotRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    spotRef.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    spotRef.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  const ready = revealed >= N;

  return (
    <section ref={sectionRef} onMouseMove={onSectionMove} className="relative w-full overflow-hidden">
      {/* ───────── Décor de fond ───────── */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-1/3 right-[-8%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,hsl(var(--primary-glow)/0.30),transparent_60%)] blur-3xl animate-[aurora_24s_ease-in-out_infinite] motion-reduce:animate-none" />
        <div className="absolute bottom-[-25%] left-[-10%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,hsl(var(--accent)/0.22),transparent_60%)] blur-3xl animate-[aurora_30s_ease-in-out_infinite_reverse] motion-reduce:animate-none" />
        <div className="absolute inset-0 hero-grid" />
        {/* faisceaux derrière la carte (moitié droite) */}
        <div className="absolute inset-y-0 right-0 hidden w-1/2 overflow-hidden md:block motion-reduce:hidden">
          <div className="absolute left-0 top-[26%] h-px w-full bg-gradient-to-r from-transparent via-primary/70 to-transparent animate-beam-x" />
          <div className="absolute left-0 top-[66%] h-px w-full bg-gradient-to-r from-transparent via-primary/45 to-transparent animate-beam-x [animation-delay:2.5s]" />
          <div className="absolute left-[58%] top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/55 to-transparent animate-beam-y" />
        </div>
        <div className="absolute inset-0 hero-grain" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-background" />
      </div>
      <div ref={spotRef} className="absolute inset-0 -z-10 hidden opacity-70 hero-spotlight md:block motion-reduce:hidden" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-14 lg:pt-20 lg:pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          {/* ───────── Colonne texte ───────── */}
          <div className="text-center lg:text-left">
            <MotionDiv initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-semibold tracking-wide text-foreground shadow-card backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-muted-foreground">Conformité e-facture 2026 / 2027</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold tabular-nums text-primary">J-{days}</span>
              </span>
            </MotionDiv>

            <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.6 }}>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
                La réforme de la facture électronique arrive.{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-cta bg-clip-text text-transparent">OdocPilot la prépare pour vous, vous validez en un clic.</span>
                  <span aria-hidden="true" className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-cta bg-[length:220%_100%] opacity-70 animate-shimmer motion-reduce:animate-none" />
                </span>
              </h1>
            </MotionDiv>

            <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.6 }}>
              <p className="mt-6 max-w-xl mx-auto text-lg leading-relaxed text-muted-foreground lg:mx-0">
                À partir du 1ᵉʳ septembre 2026, recevoir ses factures au format électronique devient obligatoire. OdocPilot est le copilote des dirigeants de TPE, PME et indépendants qui gèrent leur administratif{" "}
                <strong className="text-foreground">sans expert-comptable au quotidien</strong> : une IA française qui lit, classe et prépare vos factures et vos relances — vous gardez la décision finale.
              </p>
            </MotionDiv>

            <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.5 }}>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Magnetic reduced={reduced}>
                  <a href={SIGNUP} data-umami-event="cta-essai-hero">
                    <Button size="lg" className="group relative overflow-hidden bg-gradient-cta px-7 py-6 text-base font-bold text-primary-foreground shadow-glow hover:opacity-95">
                      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,hsl(var(--primary-foreground)/0.45)_50%,transparent_75%)] bg-[length:220%_100%] animate-shimmer motion-reduce:hidden" />
                      <span className="relative inline-flex items-center">Démarrer l'essai 14 jours <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" /></span>
                    </Button>
                  </a>
                </Magnetic>
                <Link to={CONFORMITE} data-umami-event="cta-conformite-hero" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full px-7 py-6 text-base sm:w-auto">
                    <ShieldCheck className="mr-2 h-5 w-5 text-accent" /> Vérifier ma conformité (3 min)
                  </Button>
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground lg:justify-start">
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> L'IA prépare, vous validez</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> Données et IA en France</span>
                <span className="inline-flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-primary" /> Essai 14 j sans carte bancaire</span>
              </div>

              <div className="mt-5 inline-flex items-center gap-2.5">
                <span className="text-2xl font-extrabold tabular-nums text-primary">
                  +<CountUp value={12} active reduced={reduced} decimals={0} suffix="" />
                </span>
                <span className="text-left text-xs leading-tight text-muted-foreground">heures d'administratif<br />gagnées par mois (estimé)</span>
              </div>
            </MotionDiv>
          </div>

          {/* ───────── Colonne produit : démo vivante ───────── */}
          <MotionDiv
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute -inset-5 -z-10 rounded-[2.2rem] bg-[radial-gradient(circle_at_50%_25%,hsl(var(--primary-glow)/0.22),transparent_70%)] blur-2xl" aria-hidden="true" />

            {/* enveloppe border-beam */}
            <div className="relative rounded-[1.6rem] bg-border p-[1.5px] shadow-elevated">
              <div className="absolute inset-0 overflow-hidden rounded-[1.6rem]" aria-hidden="true">
                <div className="absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,hsl(var(--primary))_45deg,hsl(var(--primary-glow))_80deg,transparent_120deg)] animate-[spin_7s_linear_infinite] motion-reduce:animate-none" />
              </div>

              <div className="relative overflow-hidden rounded-[1.5rem] bg-card">
                <div className="flex h-10 items-center gap-1.5 border-b border-border px-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="ml-3 text-[11px] text-muted-foreground">app.odocpilot.com — Factures reçues</span>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Facture lue par l'IA</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <span className={`h-1.5 w-1.5 rounded-full ${ready ? "bg-[hsl(var(--success))]" : "animate-pulse bg-primary"}`} />
                      {ready ? "Lecture terminée" : "Lecture en cours…"}
                    </span>
                  </div>

                  {/* facture + scan-line */}
                  <div className="relative mt-3 overflow-hidden rounded-xl border border-border p-4">
                    {scanning && !reduced && (
                      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 z-10 h-10 animate-scan-y bg-gradient-to-b from-transparent via-primary/20 to-transparent">
                        <div className="absolute inset-x-0 bottom-0 h-px bg-primary/80 shadow-[0_0_12px_2px_hsl(var(--primary)/0.55)]" />
                      </div>
                    )}
                    {FIELDS.map((f, i) => {
                      const shown = i < revealed;
                      return (
                        <div key={f.l} className="flex items-center justify-between border-b border-border/60 py-2 text-sm last:border-0">
                          <span className="text-muted-foreground">{f.l}</span>
                          <span className={`transition-all duration-300 ${shown ? "translate-x-0 opacity-100" : "translate-x-1 opacity-0"}`}>
                            <span className="rounded bg-primary/10 px-1.5 font-semibold tabular-nums text-foreground">
                              {f.amount != null ? <CountUp value={f.amount} active={shown} reduced={reduced} /> : f.text}
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* badge prêt */}
                  <div className="mt-3 min-h-[1.9rem]">
                    {ready && !validated && (
                      <MotionDiv initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <p className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary">
                          <Sparkles className="h-3.5 w-3.5" /> L'IA a préparé — rien n'est validé sans vous
                        </p>
                      </MotionDiv>
                    )}
                    {validated && (
                      <MotionDiv initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                        <p className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--success)/0.12)] px-2.5 py-1.5 text-xs font-semibold text-[hsl(var(--success))]">
                          <CheckCircle2 className="h-4 w-4" /> Facture validée par vous
                        </p>
                      </MotionDiv>
                    )}
                  </div>

                  {/* actions */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="relative inline-flex">
                      {ready && !validated && !reduced && (
                        <span aria-hidden="true" className="absolute inset-0 rounded-lg bg-primary/40 animate-pulse-ring" />
                      )}
                      <span className={`relative rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${validated ? "bg-muted text-muted-foreground" : "bg-gradient-cta text-primary-foreground"}`}>
                        {validated ? "Validé ✓" : "Valider"}
                      </span>
                    </div>
                    <span className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground">Corriger</span>
                  </div>

                  {/* enchaînement : relance + FEC */}
                  <div className="mt-3 flex min-h-[2rem] flex-wrap gap-2">
                    {relance && (
                      <MotionDiv initial={{ opacity: 0, scale: 0.9, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.35 }}>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-card">
                          <Send className="h-3.5 w-3.5 text-primary" /> Relance préparée
                        </span>
                      </MotionDiv>
                    )}
                    {fec && (
                      <MotionDiv initial={{ opacity: 0, scale: 0.9, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.35 }}>
                        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-card">
                          <FileOutput className="h-3.5 w-3.5 text-accent" /> Export FEC
                          <span className="relative h-1 w-10 overflow-hidden rounded-full bg-muted">
                            <span className={`absolute inset-y-0 left-0 rounded-full bg-accent ${reduced ? "w-full" : "animate-fill-bar"}`} />
                          </span>
                        </span>
                      </MotionDiv>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* badges flottants */}
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

      {/* ───────── Bandeau d'entités (marquee, preuve technique / AEO) ───────── */}
      <div className="relative overflow-hidden border-y border-border bg-secondary/40 py-3">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center gap-7 pr-7 text-xs font-medium text-muted-foreground" aria-hidden={k === 1}>
              {ENTITIES.map((e) => (
                <span key={e} className="inline-flex items-center gap-2 whitespace-nowrap">
                  <Sparkles className="h-3 w-3 text-primary/70" /> {e}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
