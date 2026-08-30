import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { MotionDiv } from "@/components/MotionDiv";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Sparkles, MapPin, CreditCard, ShieldCheck, FileText,
  LayoutDashboard, FolderOpen, Bell, Search, CheckCircle2, FileOutput, Cpu,
} from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;
const CONFORMITE = "/diagnostic";

/* ───────── helpers ───────── */
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
  const n = Math.ceil((new Date(`${d}T00:00:00`).getTime() - Date.now()) / 86_400_000);
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
function CountUp({ value, reduced, decimals = 0, suffix = "" }: { value: number; reduced: boolean; decimals?: number; suffix?: string }) {
  const [n, setN] = useState(reduced ? value : 0);
  useEffect(() => {
    if (reduced) { setN(value); return; }
    // setInterval + Date.now : robuste même si l'onglet est en arrière-plan
    // (rAF y est gelé). Atteint toujours la valeur finale.
    const start = Date.now();
    const id = window.setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / 900);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p >= 1) clearInterval(id);
    }, 1000 / 30);
    return () => clearInterval(id);
  }, [value, reduced]);
  return <>{n.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}
function Magnetic({ children, reduced, strength = 12 }: { children: ReactNode; reduced: boolean; strength?: number }) {
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

const NAV = [
  { icon: LayoutDashboard, label: "Tableau de bord", active: true },
  { icon: FileText, label: "Factures" },
  { icon: FolderOpen, label: "Documents" },
  { icon: Bell, label: "Relances" },
  { icon: ShieldCheck, label: "Conformité" },
  { icon: Cpu, label: "Copilote IA" },
];
const ROWS = [
  { who: "Menuiserie Laurent", amt: "2 184,00 €", tag: "À valider", tone: "primary" as const, sel: true },
  { who: "EDF Pro", amt: "151,40 €", tag: "Validé", tone: "success" as const, sel: false },
  { who: "Orange Business", amt: "89,90 €", tag: "Validé", tone: "success" as const, sel: false },
  { who: "Castorama Pro", amt: "642,30 €", tag: "Lue par l'IA", tone: "muted" as const, sel: false },
];
const DETAIL = [
  { l: "Fournisseur", v: "Menuiserie Laurent" },
  { l: "Montant HT", v: "1 820,00 €" },
  { l: "TVA (20 %)", v: "364,00 €" },
  { l: "Échéance", v: "30/06/2026" },
  { l: "Compte proposé", v: "606 — Achats" },
];
const TRUST = [
  { icon: FileText, t: "Factur-X · EN 16931" },
  { icon: MapPin, t: "Hébergé en France" },
  { icon: Cpu, t: "IA Mistral" },
  { icon: ShieldCheck, t: "RGPD" },
  { icon: FileOutput, t: "Export FEC" },
];

function tagClass(tone: "primary" | "success" | "muted") {
  if (tone === "primary") return "bg-primary/10 text-primary";
  if (tone === "success") return "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))]";
  return "bg-muted text-muted-foreground";
}

/* ───────── Hero — produit en vedette (inspiration fintech US) ───────── */
export function HeroSectionUS() {
  const reduced = usePrefersReducedMotion();
  const days = useDaysUntil("2026-09-01");

  return (
    <section className="relative w-full overflow-hidden">
      {/* dégradé premium type « mesh » + grain, ancré en haut, fondu vers le bas */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 h-[44rem] w-[80rem] -translate-x-1/2 bg-[radial-gradient(60%_60%_at_50%_0%,hsl(var(--primary)/0.16),transparent_70%)] blur-2xl animate-[aurora_28s_ease-in-out_infinite] motion-reduce:animate-none" />
        <div className="absolute -top-28 right-[6%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,hsl(var(--accent)/0.14),transparent_65%)] blur-3xl animate-[aurora_34s_ease-in-out_infinite_reverse] motion-reduce:animate-none" />
        <div className="absolute inset-0 hero-grid" />
        <div className="absolute inset-0 hero-grain" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 text-center sm:px-6 lg:px-8 lg:pt-20">
        {/* eyebrow */}
        <MotionDiv initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold shadow-card">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-muted-foreground">Facturation électronique obligatoire — 2026 / 2027</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold tabular-nums text-primary">J-{days}</span>
          </span>
        </MotionDiv>

        {/* headline */}
        <MotionDiv initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.6 }}>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            La facture électronique arrive.{" "}
            <span className="bg-gradient-cta bg-clip-text text-transparent">L'IA la prépare, vous validez.</span>
          </h1>
        </MotionDiv>

        <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.6 }}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Réception obligatoire dès le 1ᵉʳ septembre 2026. OdocPilot lit, classe et prépare vos factures, vos relances et votre conformité Factur-X — vous gardez la décision finale. Le copilote des dirigeants de TPE, PME et indépendants <strong className="text-foreground">sans expert-comptable au quotidien</strong>.
          </p>
        </MotionDiv>

        {/* CTAs + réassurance (trust before value) */}
        <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.5 }}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic reduced={reduced}>
              <a href={SIGNUP} data-umami-event="cta-essai-hero">
                <Button size="lg" className="group relative overflow-hidden bg-gradient-cta px-7 py-6 text-base font-bold text-primary-foreground shadow-glow hover:opacity-95">
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,hsl(var(--primary-foreground)/0.4)_50%,transparent_75%)] bg-[length:220%_100%] animate-shimmer motion-reduce:hidden" />
                  <span className="relative inline-flex items-center">Démarrer l'essai 14 jours <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" /></span>
                </Button>
              </a>
            </Magnetic>
            <Link to={CONFORMITE} data-umami-event="cta-conformite-hero">
              <Button size="lg" variant="outline" className="px-7 py-6 text-base">
                <ShieldCheck className="mr-2 h-5 w-5 text-accent" /> Vérifier ma conformité (3 min)
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Essai 14 jours · <span className="font-medium text-foreground">sans carte bancaire</span> · données et IA en France
          </p>
        </MotionDiv>

        {/* ───── Visuel produit : fenêtre d'app OdocPilot ───── */}
        <MotionDiv
          initial={{ opacity: 0, y: 36, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative mx-auto mt-14 w-full max-w-5xl"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(50%_45%_at_50%_10%,hsl(var(--primary-glow)/0.20),transparent_75%)] blur-2xl" aria-hidden="true" />

          <div className="overflow-hidden rounded-2xl border border-border bg-card text-left shadow-elevated">
            {/* barre fenêtre */}
            <div className="flex h-10 items-center gap-1.5 border-b border-border bg-muted/40 px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
              <span className="mx-auto inline-flex items-center gap-1.5 rounded-md bg-background px-3 py-1 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-primary" /> app.odocpilot.com
              </span>
            </div>

            <div className="flex">
              {/* sidebar */}
              <aside className="hidden w-48 shrink-0 flex-col gap-1 border-r border-border bg-muted/20 p-3 md:flex">
                <div className="mb-2 flex items-center gap-2 px-2 py-1">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-cta text-[11px] font-black text-primary-foreground">O</span>
                  <span className="text-sm font-bold text-foreground">OdocPilot</span>
                </div>
                {NAV.map((n) => {
                  const Icon = n.icon;
                  return (
                    <span key={n.label} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium ${n.active ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                      <Icon className="h-4 w-4" /> {n.label}
                      {n.label === "Relances" && <span className="ml-auto rounded-full bg-primary/15 px-1.5 text-[10px] font-bold text-primary">3</span>}
                    </span>
                  );
                })}
              </aside>

              {/* main */}
              <div className="min-w-0 flex-1 p-4 sm:p-5">
                {/* header */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-foreground">Factures reçues</h3>
                    <p className="text-[11px] text-muted-foreground">L'IA a préparé — vous validez</p>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] text-muted-foreground"><Search className="h-3.5 w-3.5" /> Rechercher…</span>
                    <span className="rounded-lg bg-gradient-cta px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">+ Nouvelle</span>
                  </div>
                </div>

                {/* stats */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-background p-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 motion-reduce:hidden" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" /></span>
                      À valider
                    </div>
                    <p className="mt-1 text-2xl font-extrabold tabular-nums text-foreground"><CountUp value={12} reduced={reduced} /></p>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3">
                    <p className="text-[11px] text-muted-foreground">Lues ce mois</p>
                    <p className="mt-1 text-2xl font-extrabold tabular-nums text-foreground"><CountUp value={48} reduced={reduced} /></p>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3">
                    <p className="text-[11px] text-muted-foreground">Temps gagné</p>
                    <p className="mt-1 text-2xl font-extrabold tabular-nums text-primary">+<CountUp value={12} reduced={reduced} /> h</p>
                  </div>
                </div>

                {/* liste + détail */}
                <div className="mt-4 grid gap-3 lg:grid-cols-[1.25fr_1fr]">
                  {/* liste */}
                  <div className="hidden overflow-hidden rounded-xl border border-border lg:block">
                    {ROWS.map((r) => (
                      <div key={r.who} className={`flex items-center justify-between border-b border-border/60 px-3 py-2.5 text-sm last:border-0 ${r.sel ? "bg-primary/[0.06]" : ""}`}>
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-bold text-muted-foreground">{r.who.slice(0, 2).toUpperCase()}</span>
                          <span className="truncate font-medium text-foreground">{r.who}</span>
                        </div>
                        <div className="flex shrink-0 items-center gap-2.5">
                          <span className="tabular-nums text-foreground">{r.amt}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tagClass(r.tone)}`}>{r.tag}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* détail : facture lue par l'IA */}
                  <div className="rounded-xl border border-primary/30 bg-background p-3.5 shadow-card">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Facture lue par l'IA</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">À valider</span>
                    </div>
                    <div className="mt-2.5">
                      {DETAIL.map((d) => (
                        <div key={d.l} className="flex items-center justify-between border-b border-border/60 py-1.5 text-[13px] last:border-0">
                          <span className="text-muted-foreground">{d.l}</span>
                          <span className="rounded bg-primary/10 px-1.5 font-semibold tabular-nums text-foreground">{d.v}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                      <Sparkles className="h-3 w-3" /> Rien n'est validé sans vous
                    </p>
                    <div className="mt-2.5 flex gap-2">
                      <span className="relative inline-flex">
                        {!reduced && <span aria-hidden="true" className="absolute inset-0 rounded-lg bg-primary/40 animate-pulse-ring" />}
                        <span className="relative rounded-lg bg-gradient-cta px-3.5 py-1.5 text-[13px] font-semibold text-primary-foreground">Valider</span>
                      </span>
                      <span className="rounded-lg border border-border px-3.5 py-1.5 text-[13px] text-muted-foreground">Corriger</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* badges flottants */}
          <div className="absolute -left-3 top-1/3 hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-card animate-float motion-reduce:animate-none lg:flex">
            <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
            <span className="text-xs font-semibold text-foreground">Validé en 1 clic</span>
          </div>
          <div className="absolute -right-3 bottom-10 hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-card animate-[float_3s_ease-in-out_infinite_0.7s] motion-reduce:animate-none lg:flex">
            <FileOutput className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-foreground">FEC prêt</span>
          </div>
        </MotionDiv>

        {/* ───── bande crédibilité (compliance cloud, honnête) ───── */}
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="mt-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Conçu pour la conformité française</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {TRUST.map((b) => {
              const Icon = b.icon;
              return (
                <span key={b.t} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Icon className="h-4 w-4 text-primary" /> {b.t}
                </span>
              );
            })}
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}
