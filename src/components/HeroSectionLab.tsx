import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { MotionDiv } from "@/components/MotionDiv";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Sparkles, Check, MapPin, CreditCard, ShieldCheck,
  CheckCircle2, Send, FileOutput,
} from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;
const CONFORMITE = "/diagnostic";

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

/* ───────── helpers (autonomes pour cette variante de test) ───────── */
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
function daysUntil(d: string) {
  const t = new Date(`${d}T00:00:00`).getTime();
  const n = Math.ceil((t - Date.now()) / 86_400_000);
  return n > 0 ? n : 0;
}
function useDaysUntil(d: string) {
  const [v, setV] = useState(() => daysUntil(d));
  useEffect(() => {
    const id = window.setInterval(() => setV(daysUntil(d)), 60_000);
    return () => clearInterval(id);
  }, [d]);
  return v;
}
function CountUp({ value, active, reduced }: { value: number; active: boolean; reduced: boolean }) {
  const [n, setN] = useState(reduced ? value : 0);
  useEffect(() => {
    if (reduced) { setN(value); return; }
    if (!active) { setN(0); return; }
    let raf = 0, t0 = 0;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min(1, (ts - t0) / 650);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value, reduced]);
  return <>{n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</>;
}
function Magnetic({ children, reduced, strength = 16 }: { children: ReactNode; reduced: boolean; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  function move(e: React.MouseEvent) {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${((e.clientX - (r.left + r.width / 2)) / r.width) * strength}px, ${((e.clientY - (r.top + r.height / 2)) / r.height) * strength}px)`;
  }
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={() => { if (ref.current) ref.current.style.transform = ""; }} className="inline-block transition-transform duration-200 will-change-transform">
      {children}
    </div>
  );
}
/* Effet "decrypt" sur la phrase accent (résolution rapide ~0.6s). */
function useDecrypt(text: string, reduced: boolean) {
  const [out, setOut] = useState(reduced ? text : text);
  useEffect(() => {
    if (reduced) { setOut(text); return; }
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%/€·";
    let raf = 0, t0 = 0;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min(1, (ts - t0) / 620);
      const reveal = Math.floor(p * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) s += i < reveal || text[i] === " " ? text[i] : glyphs[Math.floor(Math.random() * glyphs.length)];
      setOut(s);
      if (p < 1) raf = requestAnimationFrame(tick); else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, reduced]);
  return out;
}

const ACCENT = "vous validez en un clic.";

/* ───────── Hero — variante « AI Compliance Lab » (sombre) ───────── */
export function HeroSectionLab() {
  const reduced = usePrefersReducedMotion();
  const days = useDaysUntil("2026-09-01");
  const spotRef = useRef<HTMLDivElement>(null);
  const accent = useDecrypt(ACCENT, reduced);

  const N = FIELDS.length;
  const [revealed, setRevealed] = useState(0);
  const [scanning, setScanning] = useState(true);
  const [validated, setValidated] = useState(false);
  const [relance, setRelance] = useState(false);
  const [fec, setFec] = useState(false);

  useEffect(() => {
    if (reduced) { setRevealed(N); setScanning(false); setValidated(true); setRelance(true); setFec(true); return; }
    let timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const cycle = () => {
      setRevealed(0); setScanning(true); setValidated(false); setRelance(false); setFec(false);
      at(500, () => setRevealed(1)); at(1050, () => setRevealed(2)); at(1600, () => setRevealed(3));
      at(2150, () => setRevealed(4)); at(2700, () => setRevealed(5)); at(2950, () => setScanning(false));
      at(3900, () => setValidated(true)); at(4600, () => setRelance(true)); at(5300, () => setFec(true));
      at(7800, () => { timers.forEach(clearTimeout); timers = []; cycle(); });
    };
    cycle();
    return () => timers.forEach(clearTimeout);
  }, [reduced, N]);

  function onMove(e: React.MouseEvent) {
    if (reduced || !spotRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    spotRef.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    spotRef.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  const ready = revealed >= N;
  const muted = "text-brand-panel-foreground/65";
  const line = "border-brand-panel-foreground/10";

  return (
    <section onMouseMove={onMove} className="relative w-full overflow-hidden bg-brand-panel text-brand-panel-foreground">
      {/* ───────── Décor labo ───────── */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 lab-grid animate-grid-pan motion-reduce:animate-none" />
        <div className="absolute -top-1/4 left-1/4 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,hsl(var(--primary-glow)/0.40),transparent_60%)] blur-3xl animate-[aurora_24s_ease-in-out_infinite] motion-reduce:animate-none" />
        <div className="absolute bottom-[-22%] right-[8%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,hsl(var(--accent)/0.38),transparent_60%)] blur-3xl animate-[aurora_29s_ease-in-out_infinite_reverse] motion-reduce:animate-none" />
        {/* beams néon */}
        <div className="absolute inset-0 overflow-hidden motion-reduce:hidden">
          <div className="absolute left-0 top-[22%] h-px w-full bg-gradient-to-r from-transparent via-primary/70 to-transparent animate-beam-x" />
          <div className="absolute left-0 top-[54%] h-px w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent animate-beam-x [animation-delay:1.8s]" />
          <div className="absolute left-0 top-[80%] h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-beam-x [animation-delay:3.4s]" />
          <div className="absolute left-[28%] top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/45 to-transparent animate-beam-y" />
          <div className="absolute left-[72%] top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/55 to-transparent animate-beam-y [animation-delay:2.2s]" />
        </div>
        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,hsl(var(--brand-panel)/0.85)_100%)]" />
      </div>
      <div ref={spotRef} className="absolute inset-0 hidden lab-spotlight md:block motion-reduce:hidden" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        {/* eyebrow */}
        <MotionDiv initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-panel-foreground/15 bg-brand-panel-foreground/5 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className={muted}>Conformité e-facture 2026 / 2027</span>
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold tabular-nums text-primary-foreground">J-{days}</span>
          </span>
        </MotionDiv>

        {/* titre cinétique */}
        <MotionDiv initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.6 }}>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.6rem]">
            La réforme de la facture électronique arrive.{" "}
            <span className="bg-gradient-cta bg-clip-text text-transparent">OdocPilot la prépare pour vous,{" "}
              <span className="whitespace-nowrap tabular-nums">{accent}</span>
            </span>
          </h1>
        </MotionDiv>

        <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.6 }}>
          <p className={`mx-auto mt-6 max-w-2xl text-lg leading-relaxed ${muted}`}>
            Réception obligatoire dès le 1ᵉʳ septembre 2026. OdocPilot est le copilote des dirigeants de TPE, PME et indépendants{" "}
            <strong className="text-brand-panel-foreground">sans expert-comptable au quotidien</strong> : une IA française qui lit, classe et prépare vos factures et relances — vous gardez la décision finale.
          </p>
        </MotionDiv>

        {/* CTAs */}
        <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.5 }}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic reduced={reduced}>
              <a href={SIGNUP} data-umami-event="cta-essai-hero">
                <Button size="lg" className="group relative overflow-hidden bg-gradient-cta px-7 py-6 text-base font-bold text-primary-foreground shadow-glow hover:opacity-95">
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,hsl(var(--primary-foreground)/0.45)_50%,transparent_75%)] bg-[length:220%_100%] animate-shimmer motion-reduce:hidden" />
                  <span className="relative inline-flex items-center">Démarrer l'essai 14 jours <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" /></span>
                </Button>
              </a>
            </Magnetic>
            <Link to={CONFORMITE} data-umami-event="cta-conformite-hero">
              <Button size="lg" variant="outline" className="border-brand-panel-foreground/25 bg-transparent px-7 py-6 text-base text-brand-panel-foreground hover:bg-brand-panel-foreground/10">
                <ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Vérifier ma conformité (3 min)
              </Button>
            </Link>
          </div>
          <div className={`mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium ${muted}`}>
            <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> L'IA prépare, vous validez</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> Données et IA en France</span>
            <span className="inline-flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-primary" /> Essai 14 j sans carte bancaire</span>
          </div>
        </MotionDiv>

        {/* carte démo (verre sombre) */}
        <MotionDiv initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3, duration: 0.7 }} className="relative mx-auto mt-12 w-full max-w-xl text-left">
          <div className="absolute -inset-5 -z-10 rounded-[2.2rem] bg-[radial-gradient(circle_at_50%_20%,hsl(var(--primary-glow)/0.25),transparent_70%)] blur-2xl" aria-hidden="true" />
          <div className="relative rounded-[1.6rem] border border-brand-panel-foreground/10 bg-brand-panel-foreground/[0.06] p-[1px] shadow-elevated backdrop-blur-md">
            <div className="absolute inset-0 overflow-hidden rounded-[1.6rem]" aria-hidden="true">
              <div className="absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,hsl(var(--primary))_45deg,hsl(var(--primary-glow))_85deg,transparent_120deg)] animate-[spin_7s_linear_infinite] motion-reduce:animate-none" />
            </div>
            <div className="relative rounded-[1.55rem] bg-[hsl(var(--brand-panel)/0.85)] backdrop-blur-md">
              <div className={`flex h-10 items-center gap-1.5 border-b ${line} px-4`}>
                <span className="h-2.5 w-2.5 rounded-full bg-brand-panel-foreground/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-brand-panel-foreground/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-brand-panel-foreground/20" />
                <span className={`ml-3 text-[11px] ${muted}`}>app.odocpilot.com — Factures reçues</span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className={`text-[11px] font-semibold uppercase tracking-wide ${muted}`}>Facture lue par l'IA</p>
                  <span className={`inline-flex items-center gap-1 text-[11px] ${muted}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${ready ? "bg-[hsl(var(--success))]" : "animate-pulse bg-primary"}`} />
                    {ready ? "Lecture terminée" : "Lecture en cours…"}
                  </span>
                </div>
                <div className={`relative mt-3 overflow-hidden rounded-xl border ${line} p-4`}>
                  {scanning && !reduced && (
                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 z-10 h-10 animate-scan-y bg-gradient-to-b from-transparent via-primary/25 to-transparent">
                      <div className="absolute inset-x-0 bottom-0 h-px bg-primary shadow-[0_0_14px_3px_hsl(var(--primary)/0.7)]" />
                    </div>
                  )}
                  {FIELDS.map((f, i) => {
                    const shown = i < revealed;
                    return (
                      <div key={f.l} className={`flex items-center justify-between border-b ${line} py-2 text-sm last:border-0`}>
                        <span className={muted}>{f.l}</span>
                        <span className={`transition-all duration-300 ${shown ? "translate-x-0 opacity-100" : "translate-x-1 opacity-0"}`}>
                          <span className="rounded bg-primary/15 px-1.5 font-semibold tabular-nums text-brand-panel-foreground">
                            {f.amount != null ? <CountUp value={f.amount} active={shown} reduced={reduced} /> : f.text}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 min-h-[1.9rem]">
                  {ready && !validated && (
                    <p className="inline-flex items-center gap-2 rounded-lg bg-primary/15 px-2.5 py-1.5 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5" /> L'IA a préparé — rien n'est validé sans vous</p>
                  )}
                  {validated && (
                    <p className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--success)/0.16)] px-2.5 py-1.5 text-xs font-semibold text-[hsl(var(--success))]"><CheckCircle2 className="h-4 w-4" /> Facture validée par vous</p>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="relative inline-flex">
                    {ready && !validated && !reduced && <span aria-hidden="true" className="absolute inset-0 rounded-lg bg-primary/40 animate-pulse-ring" />}
                    <span className={`relative rounded-lg px-4 py-2 text-sm font-semibold ${validated ? "bg-brand-panel-foreground/15 text-brand-panel-foreground/70" : "bg-gradient-cta text-primary-foreground"}`}>{validated ? "Validé ✓" : "Valider"}</span>
                  </div>
                  <span className={`rounded-lg border ${line} px-4 py-2 text-sm ${muted}`}>Corriger</span>
                </div>
                <div className="mt-3 flex min-h-[2rem] flex-wrap gap-2">
                  {relance && (
                    <MotionDiv initial={{ opacity: 0, scale: 0.9, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.35 }}>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border ${line} bg-brand-panel-foreground/5 px-2.5 py-1 text-xs font-medium`}><Send className="h-3.5 w-3.5 text-primary" /> Relance préparée</span>
                    </MotionDiv>
                  )}
                  {fec && (
                    <MotionDiv initial={{ opacity: 0, scale: 0.9, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.35 }}>
                      <span className={`inline-flex items-center gap-2 rounded-full border ${line} bg-brand-panel-foreground/5 px-2.5 py-1 text-xs font-medium`}>
                        <FileOutput className="h-3.5 w-3.5 text-accent" /> Export FEC
                        <span className="relative h-1 w-10 overflow-hidden rounded-full bg-brand-panel-foreground/15">
                          <span className={`absolute inset-y-0 left-0 rounded-full bg-accent ${reduced ? "w-full" : "animate-fill-bar"}`} />
                        </span>
                      </span>
                    </MotionDiv>
                  )}
                </div>
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>

      {/* marquee */}
      <div className="relative z-10 overflow-hidden border-y border-brand-panel-foreground/10 bg-brand-panel-foreground/[0.04] py-3">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {[0, 1].map((k) => (
            <div key={k} className={`flex shrink-0 items-center gap-7 pr-7 text-xs font-medium ${muted}`} aria-hidden={k === 1}>
              {ENTITIES.map((e) => (
                <span key={e} className="inline-flex items-center gap-2 whitespace-nowrap"><Sparkles className="h-3 w-3 text-primary/80" /> {e}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
