import { Search, Sparkles, Check, FileText, MessageSquareText } from "lucide-react";

/**
 * Aperçus produit designés (honnêtes, fidèles aux vraies fonctions, adaptatifs clair/sombre).
 * À remplacer par de vraies captures .webp quand elles seront disponibles.
 * On ne montre QUE des fonctions réelles : génération Factur-X, lecture IA, GED, copilote Brain.
 */

function Frame({ tab, children }: { tab: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 h-9 bg-muted/60 border-b border-border">
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="ml-3 text-[11px] text-muted-foreground">{tab}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Facturation() {
  return (
    <Frame tab="app.odocpilot.com — Facture">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Facture FAC-2026-041</p>
        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary text-[11px] font-semibold px-2 py-0.5"><FileText className="h-3 w-3" /> Factur-X</span>
      </div>
      <div className="mt-3 rounded-xl border border-border p-4 space-y-0">
        {[
          { l: "Client", v: "Dupont & Fils" },
          { l: "Montant HT", v: "2 400,00 €" },
          { l: "TVA (20 %)", v: "480,00 €" },
          { l: "Total TTC", v: "2 880,00 €" },
        ].map((r, idx) => (
          <div key={r.l} className={`flex items-center justify-between py-2 text-sm ${idx < 3 ? "border-b border-border/60" : ""}`}>
            <span className="text-muted-foreground">{r.l}</span>
            <span className="font-semibold text-foreground tabular-nums">{r.v}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Format légal (PDF lisible + données structurées) — prête à envoyer.</p>
      <div className="mt-3 flex gap-2">
        <span className="rounded-lg bg-gradient-cta text-primary-foreground text-sm font-semibold px-4 py-2">Envoyer</span>
        <span className="rounded-lg border border-border text-muted-foreground text-sm px-4 py-2">Télécharger</span>
      </div>
    </Frame>
  );
}

function Pilotage() {
  return (
    <Frame tab="app.odocpilot.com — Copilote">
      <div className="space-y-3">
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-primary/10 text-foreground text-sm px-3.5 py-2">
          Qui me doit de l'argent ce mois-ci ?
        </div>
        <div className="flex items-start gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-cta shrink-0"><Sparkles className="h-3.5 w-3.5 text-primary-foreground" /></div>
          <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-secondary/60 text-sm px-3.5 py-2.5 text-foreground">
            <p><strong className="text-foreground">3 clients</strong> vous doivent <strong className="text-foreground tabular-nums">4 820 €</strong> ce mois-ci :</p>
            <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
              <li>• Martin SARL — 2 880 € — échéance dépassée</li>
              <li>• Atelier B — 1 140 € — échue dans 3 j</li>
              <li>• Sophie L. — 800 € — échue dans 9 j</li>
            </ul>
            <p className="mt-2 text-xs text-primary font-medium">Préparer les relances ?</p>
          </div>
        </div>
      </div>
      <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground"><MessageSquareText className="h-3.5 w-3.5 text-primary" /> Réponse sourcée sur vos documents — vous validez l'action.</p>
    </Frame>
  );
}

function Documents() {
  return (
    <Frame tab="app.odocpilot.com — Documents">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground">
        <Search className="h-4 w-4 text-muted-foreground" /> factures EDF 2025
      </div>
      <p className="mt-3 text-xs text-muted-foreground"><span className="font-semibold text-foreground">3 résultats</span> en langage naturel</p>
      <div className="mt-2 space-y-2">
        {[
          { d: "EDF · janvier 2025", v: "142,80 €" },
          { d: "EDF · avril 2025", v: "138,10 €" },
          { d: "EDF · septembre 2025", v: "151,40 €" },
        ].map((r) => (
          <div key={r.d} className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <span className="inline-flex items-center gap-2 text-foreground"><FileText className="h-4 w-4 text-primary" /> {r.d}</span>
            <span className="text-muted-foreground tabular-nums">{r.v}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Equipe() {
  const cols = [
    { t: "À faire", items: ["Relancer Martin SARL", "Valider 2 factures"] },
    { t: "En cours", items: ["Devis chantier Bât. C"] },
    { t: "Fait", items: ["Export FEC mai"] },
  ];
  return (
    <Frame tab="app.odocpilot.com — Équipe">
      <div className="flex items-center gap-2">
        {["AL", "CM", "KB"].map((n, i) => (
          <span key={n} className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-primary-foreground ${i === 0 ? "bg-gradient-cta" : "bg-primary/70"}`}>{n}</span>
        ))}
        <span className="text-xs text-muted-foreground">3 membres · rôles & accès</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {cols.map((c) => (
          <div key={c.t} className="rounded-lg bg-secondary/50 border border-border p-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{c.t}</p>
            <div className="mt-1.5 space-y-1.5">
              {c.items.map((it) => (
                <div key={it} className="rounded-md bg-card border border-border px-2 py-1.5 text-[11px] text-foreground leading-snug flex items-start gap-1">
                  {c.t === "Fait" && <Check className="h-3 w-3 text-primary shrink-0 mt-0.5" />}{it}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

const VARIANTS: Record<string, () => JSX.Element> = {
  facturation: Facturation,
  pilotage: Pilotage,
  documents: Documents,
  equipe: Equipe,
};

export function FeaturePreview({ kind }: { kind: string }) {
  const Variant = VARIANTS[kind] ?? Documents;
  return <Variant />;
}
