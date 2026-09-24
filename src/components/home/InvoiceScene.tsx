import { useEffect, useRef, useState } from "react";
import { Check, Pause, Play } from "lucide-react";
import { Stamp } from "./Stamp";
import { fr } from "@/lib/typo";

/**
 * Scène signature de l'accueil : une facture (fictive) passe le contrôle de
 * conformité. Le surligneur pose un trait sur chaque mention obligatoire, la
 * liste de contrôle se coche, puis c'est VOUS qui validez : le tampon tombe.
 *
 * Mouvement : transitions CSS (interruptibles, hors du fil principal) pilotées
 * par une petite machine à états. Pause au clic, hors écran et onglet caché.
 * prefers-reduced-motion : état final affiché d'emblée, sans boucle.
 *
 * Les SIREN inventés ci-dessous échouent volontairement à la clé de Luhn :
 * aucun ne peut désigner une entreprise réelle.
 */

type Line = { label: string; total: string };
type Invoice = {
  seller: string;
  trade: string;
  sellerSiren: string;
  number: string;
  issued: string;
  due: string;
  client: string;
  clientCity: string;
  clientSiren: string;
  nature: string;
  lines: Line[];
  /** Ligne de TVA : taux appliqué, ou mention d'exonération de l'auto-entrepreneur. */
  vatLabel: string;
  vat?: string;
  ht: string;
  ttc: string;
};

// Trois métiers, trois cas : un artisan auto-entrepreneur, un commerce, un indépendant.
const INVOICES: Invoice[] = [
  {
    seller: "Dumas Plomberie",
    trade: "Plomberie, chauffage · Créteil",
    sellerSiren: "901 234 568",
    number: "2026-041",
    issued: "24/09/2026",
    due: "24/10/2026",
    client: "Garnier Rénovation",
    clientCity: "94100 Saint-Maur-des-Fossés",
    clientSiren: "812 345 671",
    nature: "mixte (biens et services)",
    lines: [
      { label: "Chauffe-eau 200 L, fourni et posé", total: "1 180,00" },
      { label: "Main d'œuvre, 4 h × 55,00", total: "220,00" },
    ],
    vatLabel: "TVA non applicable, art. 293 B du CGI",
    ht: "1 400,00 €",
    ttc: "1 400,00 €",
  },
  {
    seller: "Maison Lila",
    trade: "Fleuriste · Vincennes",
    sellerSiren: "753 118 204",
    number: "F-0917",
    issued: "25/09/2026",
    due: "25/10/2026",
    client: "Hôtel du Parc",
    clientCity: "94300 Vincennes",
    clientSiren: "524 690 317",
    nature: "livraison de biens",
    lines: [
      { label: "Compositions du hall, 4 semaines", total: "340,00" },
      { label: "Livraisons, 4 × 12,00", total: "48,00" },
    ],
    vatLabel: "TVA 10 %",
    vat: "38,80 €",
    ht: "388,00 €",
    ttc: "426,80 €",
  },
  {
    seller: "Studio Nour",
    trade: "Graphiste indépendante · Lyon",
    sellerSiren: "834 572 915",
    number: "SN-2026-12",
    issued: "26/09/2026",
    due: "26/10/2026",
    client: "Agence Horizon",
    clientCity: "69002 Lyon",
    clientSiren: "442 815 097",
    nature: "prestation de services",
    lines: [
      { label: "Création d'identité visuelle", total: "1 800,00" },
      { label: "Déclinaisons : cartes, en-tête", total: "450,00" },
    ],
    vatLabel: "TVA non applicable, art. 293 B du CGI",
    ht: "2 250,00 €",
    ttc: "2 250,00 €",
  },
];

const CHECKS = [
  { id: "seller", label: "SIREN du vendeur" },
  { id: "client", label: "SIREN du client", isNew: true },
  { id: "nature", label: "Nature de l'opération", isNew: true },
  { id: "vat", label: "Mention de TVA" },
  { id: "terms", label: "Pénalités et indemnité de 40 €" },
  { id: "format", label: "Format électronique (Factur-X)" },
] as const;
type CheckId = (typeof CHECKS)[number]["id"];

// Étapes : 0 arrivée · 1-6 contrôles · 7 bilan · 8 prête · 9 pression · 10 tampon · 11 rangement
const S = { ENTER: 0, SUMMARY: 7, READY: 8, PRESS: 9, STAMP: 10, FILE: 11 } as const;
function duration(step: number): number {
  if (step === S.ENTER) return 900;
  if (step < S.SUMMARY) return 440;
  if (step === S.SUMMARY) return 600;
  if (step === S.READY) return 3000;
  if (step === S.PRESS) return 180;
  if (step === S.STAMP) return 2100;
  return 620;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function InvoiceScene() {
  const [reduce, setReduce] = useState(prefersReducedMotion);
  const [doc, setDoc] = useState(0);
  const [step, setStep] = useState<number>(() => (prefersReducedMotion() ? S.STAMP : S.ENTER));
  const [entering, setEntering] = useState(false);
  const [byVisitor, setByVisitor] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      setReduce(mq.matches);
      if (mq.matches) setStep(S.STAMP);
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Pause automatique hors écran et onglet caché.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let inView = true;
    const sync = () => setVisible(inView && !document.hidden);
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const running = !reduce && !paused && visible;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => {
      if (step >= S.FILE) {
        setDoc((d) => (d + 1) % INVOICES.length);
        setByVisitor(false);
        setEntering(true);
        setStep(S.ENTER);
      } else {
        setStep(step + 1);
      }
    }, duration(step));
    return () => window.clearTimeout(t);
  }, [running, step]);

  // Nouvelle feuille : un rendu décalé sans transition, puis glissement vers sa place.
  useEffect(() => {
    if (!entering) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEntering(false));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [entering]);

  const inv = INVOICES[doc];
  const checked = (id: CheckId) => step >= 1 + CHECKS.findIndex((c) => c.id === id);
  const count = Math.max(0, Math.min(CHECKS.length, step - 0));
  const ready = step === S.READY;
  const stamped = step >= S.STAMP;

  function validate() {
    if (step < S.READY || stamped) return;
    setByVisitor(true);
    setStep(S.STAMP);
  }

  const mark = (id: CheckId, text: string) => (
    <span className="marker" data-on={checked(id)}>
      {fr(text)}
    </span>
  );

  return (
    <div ref={rootRef}>
      <figure
        aria-label="Exemple animé : les mentions obligatoires d'une facture fictive sont vérifiées une à une, puis la facture est validée."
        className="relative mx-auto grid max-w-[40rem] sm:grid-cols-[minmax(0,1fr)_15.5rem] sm:items-start"
      >
        {/* La facture, posée sur une pile */}
        <div className="relative">
          <div aria-hidden="true" className="absolute inset-0 translate-x-2 translate-y-3 rotate-[2.4deg] rounded-[3px] bg-sheet shadow-sheet" />
          <div
            className="sheet-file relative rounded-[3px] bg-sheet px-5 pb-5 pt-5 text-sheet-ink shadow-lift sm:px-6 sm:pb-6 sm:pt-6"
            data-filed={step === S.FILE}
            data-entering={entering}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-[1.05rem] font-bold leading-tight">{inv.seller}</p>
                <p className="mt-0.5 text-[0.625rem] leading-snug text-sheet-soft">{inv.trade}</p>
                <p className="mt-1 font-data text-[0.5625rem] leading-snug">{mark("seller", `SIREN ${inv.sellerSiren}`)}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-[0.75rem] font-bold tracking-[0.2em] text-sheet-soft">FACTURE</p>
                <p className="mt-1 font-data text-[0.6875rem]">N° {inv.number}</p>
                <p className="mt-1.5 text-[0.5625rem] font-bold">{mark("format", "Factur-X · EN 16931")}</p>
              </div>
            </div>

            <div className="mt-3.5 grid grid-cols-[1.25fr_1fr] gap-3 border-y border-sheet-rule py-2.5 text-[0.625rem] leading-relaxed">
              <div className="min-w-0">
                <p className="text-sheet-soft">Facturé à</p>
                <p className="font-bold">{inv.client}</p>
                <p className="text-sheet-soft">{inv.clientCity}</p>
                <p className="font-data">{mark("client", `SIREN ${inv.clientSiren}`)}</p>
              </div>
              <div className="font-data">
                <p><span className="font-body text-sheet-soft">Émise le </span>{inv.issued}</p>
                <p><span className="font-body text-sheet-soft">Échéance </span>{inv.due}</p>
              </div>
            </div>
            <p className="mt-2 text-[0.625rem]">
              <span className="text-sheet-soft">{fr("Nature de l'opération : ")}</span>
              {mark("nature", inv.nature)}
            </p>

            <table className="mt-2.5 w-full text-[0.625rem]">
              <thead>
                <tr className="text-left text-sheet-soft">
                  <th className="pb-1 font-normal">Désignation</th>
                  <th className="pb-1 text-right font-normal">Montant HT</th>
                </tr>
              </thead>
              <tbody>
                {inv.lines.map((l) => (
                  <tr key={l.label} className="border-t border-sheet-rule">
                    <td className="py-1.5 pr-2">{fr(l.label)}</td>
                    <td className="py-1.5 text-right font-data">{fr(l.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <dl className="ml-auto mt-2.5 w-full max-w-[14rem] text-[0.6875rem]">
              <div className="flex justify-between py-0.5"><dt className="text-sheet-soft">Total HT</dt><dd className="font-data">{fr(inv.ht)}</dd></div>
              {inv.vat ? (
                <div className="flex justify-between py-0.5"><dt className="text-sheet-soft">{mark("vat", inv.vatLabel)}</dt><dd className="font-data">{fr(inv.vat)}</dd></div>
              ) : (
                <div className="py-0.5 text-right text-[0.5625rem]">{mark("vat", inv.vatLabel)}</div>
              )}
              <div className="mt-1 flex justify-between border-t border-sheet-ink/70 pt-1.5 text-[0.75rem] font-bold"><dt>Net à payer</dt><dd className="font-data">{fr(inv.ttc)}</dd></div>
            </dl>

            <p className="mt-3.5 text-[0.5rem] leading-snug text-sheet-soft">
              {fr("Paiement à 30 jours. Pénalités de retard : trois fois le taux d'intérêt légal, ")}
              {mark("terms", "indemnité forfaitaire de 40 €")}
              {fr(" pour frais de recouvrement.")}
            </p>

            <Stamp
              on={stamped}
              word="CONFORME"
              subline={byVisitor ? "VALIDÉE PAR VOUS" : "FACTUR-X · EN 16931"}
              className="absolute left-[12%] top-[43%] w-[10.5rem] sm:left-[16%] sm:w-[12rem]"
            />
          </div>
        </div>

        {/* Le contrôle OdocPilot */}
        <div className="relative z-10 -mt-10 ml-auto w-[88%] rounded-lg border border-sheet-rule bg-sheet text-sheet-ink shadow-lift sm:-ml-5 sm:mt-24 sm:w-auto">
          <div className="flex items-center justify-between gap-3 border-b border-sheet-rule px-3.5 py-2.5">
            <p className="text-[0.8125rem] font-bold">Contrôle avant envoi</p>
            <p className="font-data text-[0.6875rem] text-sheet-soft">{Math.min(count, CHECKS.length)}/6</p>
          </div>
          <ul className="px-3.5 py-2 text-[0.71875rem]">
            {CHECKS.map((c) => (
              <li key={c.id} className="flex items-center gap-2 py-[0.3rem]">
                <span
                  className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-[3px] border transition-colors duration-200 ${
                    checked(c.id) ? "border-[#0E5870] bg-[#0E5870] text-white" : "border-sheet-rule text-transparent"
                  }`}
                >
                  <Check size={10} strokeWidth={3.5} aria-hidden="true" />
                </span>
                <span className={checked(c.id) ? "" : "text-sheet-soft"}>{fr(c.label)}</span>
                {"isNew" in c && c.isNew && (
                  <span className="ml-auto rounded-sm bg-[hsl(29_100%_63%/0.3)] px-1.5 text-[0.5625rem] font-bold uppercase tracking-wide text-[#7A3A06]">
                    2026
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="border-t border-sheet-rule px-3.5 py-3">
            <button
              type="button"
              onClick={validate}
              aria-disabled={!ready}
              data-ready={ready}
              data-pressed={step === S.PRESS}
              className={`demo-validate flex min-h-10 w-full items-center justify-center gap-2 rounded-md px-3 text-[0.8125rem] font-bold text-white transition-[transform,opacity,background-color] duration-150 active:scale-[0.97] aria-disabled:cursor-default ${
                stamped ? "bg-[#0E5870]" : "bg-[#0F2229] aria-disabled:opacity-40"
              }`}
            >
              {stamped ? (
                <>
                  <Check size={15} strokeWidth={2.5} aria-hidden="true" /> Facture validée
                </>
              ) : (
                "Valider la facture"
              )}
            </button>
            <p className="mt-2 text-center text-[0.6875rem] leading-snug text-sheet-soft">
              {fr(ready ? "Tout est en règle. À vous de valider." : "Une mention manque ? Vous le savez avant d'envoyer.")}
            </p>
          </div>
        </div>
      </figure>

      <div className="mx-auto mt-6 flex max-w-[40rem] items-center justify-between gap-4 text-[0.8125rem] text-muted-foreground">
        <p>Exemple animé : trois métiers, entreprises et montants fictifs.</p>
        {!reduce && (
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-2.5 text-foreground transition-colors duration-200 hover:bg-muted"
          >
            {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
            {paused ? "Reprendre" : "Pause"}
          </button>
        )}
      </div>
    </div>
  );
}
