import { useState, useRef, useCallback } from "react";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { BackButton } from "@/components/BackButton";
import { TrustCredentials } from "@/components/TrustCredentials";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Upload, CheckCircle, AlertTriangle, XCircle, FileX2, ArrowRight,
  ShieldCheck, FileCheck2, MapPin, CreditCard,
} from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;

type Check = { label: string; ok: boolean; required: boolean; detail?: string };
type Result =
  | { kind: "ok"; checks: Check[]; passed: number; total: number; allRequired: boolean }
  | { kind: "no-xml" }
  | { kind: "parse-error" }
  | { kind: "read-error" };

/* ── Helpers XML (CII, sans dépendance namespace) ────────────────────────── */
function childByLocal(el: Element | null, ln: string): Element | null {
  if (!el) return null;
  for (const c of Array.from(el.children)) if (c.localName === ln) return c;
  return null;
}
function path(root: Element | null, ...names: string[]): Element | null {
  let el = root;
  for (const n of names) { el = childByLocal(el, n); if (!el) return null; }
  return el;
}
function text(el: Element | null): string {
  return el ? (el.textContent || "").trim() : "";
}
function num(s: string): number {
  const v = parseFloat((s || "").replace(",", "."));
  return Number.isFinite(v) ? v : NaN;
}

/* ── Extraction du volet Factur-X (XML) d'un PDF, en JS pur ───────────────── */
function findCII(s: string): string | null {
  const m = s.match(/<\?xml[\s\S]*?CrossIndustryInvoice[\s\S]*?<\/(?:[\w]+:)?CrossIndustryInvoice>/);
  if (m) return m[0];
  const m2 = s.match(/<(?:[\w]+:)?CrossIndustryInvoice[\s\S]*?<\/(?:[\w]+:)?CrossIndustryInvoice>/);
  return m2 ? m2[0] : null;
}
async function inflate(bytes: Uint8Array): Promise<Uint8Array | null> {
  for (const fmt of ["deflate", "deflate-raw"] as const) {
    try {
      const ds = new DecompressionStream(fmt);
      const ab = await new Response(new Blob([bytes]).stream().pipeThrough(ds)).arrayBuffer();
      return new Uint8Array(ab);
    } catch { /* essai suivant */ }
  }
  return null;
}
async function extractXmlFromPdf(buf: ArrayBuffer): Promise<string | null> {
  const bytes = new Uint8Array(buf);
  const latin1 = new TextDecoder("latin1").decode(bytes);
  const direct = findCII(latin1);
  if (direct) return direct;
  let idx = 0;
  for (let guard = 0; guard < 5000; guard++) {
    const s = latin1.indexOf("stream", idx);
    if (s === -1) break;
    let start = s + 6;
    if (latin1[start] === "\r") start++;
    if (latin1[start] === "\n") start++;
    const e = latin1.indexOf("endstream", start);
    if (e === -1) break;
    const inflated = await inflate(bytes.subarray(start, e));
    if (inflated) {
      const found = findCII(new TextDecoder("latin1").decode(inflated));
      if (found) return found;
    }
    idx = e + 9;
  }
  return null;
}

/* ── Contrôle des mentions obligatoires EN 16931 ──────────────────────────── */
function validate(xml: string): Result {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.getElementsByTagName("parsererror").length > 0) return { kind: "parse-error" };
  const root = doc.documentElement;
  if (!root || root.localName !== "CrossIndustryInvoice") return { kind: "parse-error" };

  const doc_ = path(root, "ExchangedDocument");
  const tx = path(root, "SupplyChainTradeTransaction");
  const agr = path(tx, "ApplicableHeaderTradeAgreement");
  const seller = path(agr, "SellerTradeParty");
  const buyer = path(agr, "BuyerTradeParty");
  const settle = path(tx, "ApplicableHeaderTradeSettlement");
  const sum = path(settle, "SpecifiedTradeSettlementHeaderMonetarySummation");

  const guideline = text(path(root, "ExchangedDocumentContext", "GuidelineSpecifiedDocumentContextParameter", "ID"));
  const invId = text(path(doc_, "ID"));
  const typeCode = text(path(doc_, "TypeCode"));
  const issueDate = text(path(doc_, "IssueDateTime", "DateTimeString"));
  const sellerName = text(path(seller, "Name"));
  const sellerLegalId = text(path(seller, "SpecifiedLegalOrganization", "ID"));
  const sellerVat = text(path(seller, "SpecifiedTaxRegistration", "ID"));
  const sellerCountry = text(path(seller, "PostalTradeAddress", "CountryID"));
  const buyerName = text(path(buyer, "Name"));
  const buyerCountry = text(path(buyer, "PostalTradeAddress", "CountryID"));
  const currency = text(path(settle, "InvoiceCurrencyCode"));

  const taxes = settle ? Array.from(settle.children).filter((c) => c.localName === "ApplicableTradeTax") : [];
  const taxOk = taxes.some((t) =>
    text(childByLocal(t, "CategoryCode")) !== "" &&
    text(childByLocal(t, "RateApplicablePercent")) !== "" &&
    text(childByLocal(t, "BasisAmount")) !== "" &&
    text(childByLocal(t, "CalculatedAmount")) !== ""
  );

  const lineTotal = num(text(path(sum, "LineTotalAmount")));
  const taxBasis = num(text(path(sum, "TaxBasisTotalAmount")));
  const taxTotal = num(text(path(sum, "TaxTotalAmount")));
  const grand = num(text(path(sum, "GrandTotalAmount")));
  const due = num(text(path(sum, "DuePayableAmount")));
  const lines = tx ? Array.from(tx.children).filter((c) => c.localName === "IncludedSupplyChainTradeLineItem") : [];

  const coherent =
    Number.isFinite(grand) && Number.isFinite(taxBasis) && Number.isFinite(taxTotal) &&
    Math.abs(grand - (taxBasis + taxTotal)) <= 0.02;

  const checks: Check[] = [
    { label: "Volet structuré Factur-X (CII) lisible", ok: true, required: true },
    { label: "Profil EN 16931 déclaré", ok: /en16931/i.test(guideline), required: false, detail: guideline || "guideline absente" },
    { label: "Numéro de facture", ok: invId !== "", required: true, detail: invId },
    { label: "Date d'émission (AAAAMMJJ)", ok: /^\d{8}$/.test(issueDate), required: true, detail: issueDate },
    { label: "Type de document (380 = facture)", ok: ["380", "381", "384", "389"].includes(typeCode), required: true, detail: typeCode },
    { label: "Identité de l'émetteur", ok: sellerName !== "", required: true, detail: sellerName },
    { label: "Identifiant émetteur (SIRET ou TVA)", ok: sellerLegalId !== "" || sellerVat !== "", required: true, detail: [sellerLegalId && `SIRET ${sellerLegalId}`, sellerVat && `TVA ${sellerVat}`].filter(Boolean).join(" · ") },
    { label: "Pays de l'émetteur", ok: sellerCountry !== "", required: true, detail: sellerCountry },
    { label: "Identité du client", ok: buyerName !== "", required: true, detail: buyerName },
    { label: "Pays du client", ok: buyerCountry !== "", required: true, detail: buyerCountry },
    { label: "Devise de la facture", ok: currency !== "", required: true, detail: currency },
    { label: "Ventilation de TVA (taux, base, montant)", ok: taxOk, required: true },
    { label: "Total HT, total TVA, total TTC, net à payer", ok: [lineTotal, taxBasis, taxTotal, grand, due].every(Number.isFinite), required: true, detail: Number.isFinite(grand) ? `TTC ${grand.toFixed(2)} ${currency}` : "" },
    { label: "Cohérence des totaux (TTC = HT + TVA)", ok: coherent, required: true, detail: Number.isFinite(grand) ? `${taxBasis.toFixed(2)} + ${taxTotal.toFixed(2)} = ${grand.toFixed(2)}` : "" },
    { label: "Au moins une ligne de facture", ok: lines.length > 0, required: true, detail: `${lines.length} ligne(s)` },
  ];

  const passed = checks.filter((c) => c.ok).length;
  const allRequired = checks.filter((c) => c.required).every((c) => c.ok);
  return { kind: "ok", checks, passed, total: checks.length, allRequired };
}

export default function VerificateurPage() {
  const [result, setResult] = useState<Result | null>(null);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setBusy(true);
    setResult(null);
    try {
      const isXml = /\.xml$/i.test(file.name) || file.type.includes("xml");
      if (isXml) {
        setResult(validate(await file.text()));
      } else {
        const xml = await extractXmlFromPdf(await file.arrayBuffer());
        setResult(xml ? validate(xml) : { kind: "no-xml" });
      }
    } catch {
      setResult({ kind: "read-error" });
    } finally {
      setBusy(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Vérificateur de facture électronique (Factur-X / EN 16931) gratuit | OdocPilot"
        description="Déposez une facture (PDF Factur-X ou XML) : on vérifie gratuitement le volet structuré, les mentions obligatoires et la cohérence des totaux selon la norme EN 16931. Sans inscription. Données traitées dans votre navigateur."
        canonical="/verificateur"
      />
      <BackButton to="/e-facture" label="← La réforme e-facture" />

      <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Outil gratuit · sans inscription</span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Votre facture est-elle vraiment conforme&nbsp;?</h1>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            Déposez une facture (<strong className="text-foreground">PDF Factur-X</strong> ou fichier <strong className="text-foreground">XML</strong>) : on contrôle le <strong className="text-foreground">volet structuré</strong> et les <strong className="text-foreground">mentions obligatoires</strong> selon la norme <strong className="text-foreground">EN 16931</strong>. Le fichier est analysé <strong className="text-foreground">dans votre navigateur</strong> — rien n'est envoyé.
          </p>
        </div>

        {/* Dropzone */}
        <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mt-10">
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${drag ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><Upload className="h-6 w-6 text-primary" /></div>
            <p className="mt-4 font-semibold text-foreground">{busy ? "Analyse en cours…" : "Glissez votre facture ici, ou cliquez pour choisir"}</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF Factur-X ou XML · max ~10 Mo · traité localement</p>
            <input ref={inputRef} type="file" accept=".pdf,.xml,application/pdf,application/xml,text/xml" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} data-umami-event="verificateur-upload" />
          </div>
          {fileName && <p className="mt-3 text-center text-xs text-muted-foreground">Fichier : {fileName}</p>}
        </MotionDiv>

        {/* Résultat */}
        {result && result.kind === "ok" && (
          <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mt-8">
            <div className={`rounded-2xl border p-5 ${result.allRequired ? "border-green-600/40 bg-green-600/5" : "border-amber-500/40 bg-amber-500/5"}`}>
              <p className="flex items-center gap-2 font-bold text-foreground">
                {result.allRequired ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}
                {result.allRequired
                  ? "Mentions obligatoires EN 16931 : conformes"
                  : "Des mentions obligatoires manquent ou sont à corriger"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{result.passed}/{result.total} contrôles passés. Vérification du volet structuré (mentions + cohérence), hors validation Schematron officielle.</p>
            </div>
            <ul className="mt-4 space-y-1.5 rounded-2xl border border-border bg-card p-5 shadow-card">
              {result.checks.map((c) => (
                <li key={c.label} className="flex items-start gap-2.5 text-sm">
                  {c.ok
                    ? <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    : c.required ? <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />}
                  <span className="flex-1">
                    <span className={c.ok ? "text-foreground" : c.required ? "text-red-600 font-medium" : "text-amber-600"}>{c.label}</span>
                    {c.detail && <span className="text-muted-foreground"> — {c.detail}</span>}
                    {!c.required && <span className="ml-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">recommandé</span>}
                  </span>
                </li>
              ))}
            </ul>
          </MotionDiv>
        )}

        {result && result.kind === "no-xml" && (
          <div className="mt-8 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5">
            <p className="flex items-center gap-2 font-bold text-foreground"><FileX2 className="h-5 w-5 text-amber-500" /> Ce PDF n'est pas une facture électronique conforme</p>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Aucun <strong className="text-foreground">volet structuré (XML)</strong> n'a été trouvé dans ce PDF. C'est la confusion n°1 : à partir de 2026, un simple PDF (même envoyé par email) <strong className="text-foreground">ne suffit plus</strong> — la loi impose un format structuré (Factur-X, UBL ou CII). Générez une facture conforme gratuitement ci-dessous.
            </p>
          </div>
        )}
        {result && (result.kind === "parse-error" || result.kind === "read-error") && (
          <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/5 p-5">
            <p className="flex items-center gap-2 font-bold text-foreground"><XCircle className="h-5 w-5 text-red-500" /> Fichier illisible</p>
            <p className="mt-1.5 text-sm text-muted-foreground">Le fichier n'a pas pu être analysé comme un Factur-X. Déposez le volet XML (CII) ou un PDF Factur-X valide.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-border bg-secondary/40 p-6 text-center">
          <p className="flex items-center justify-center gap-2 font-bold text-foreground"><FileCheck2 className="h-5 w-5 text-primary" /> Besoin de factures conformes&nbsp;?</p>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-xl mx-auto">Générez gratuitement une facture au format Factur-X, ou laissez l'IA d'OdocPilot préparer toutes vos factures — vous validez en un clic.</p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/generateur-factur-x" data-umami-event="verificateur-cta-generateur">
              <Button className="bg-gradient-cta text-primary-foreground font-bold px-6">Générer une Factur-X gratuite</Button>
            </Link>
            <a href={SIGNUP} data-umami-event="verificateur-cta-essai">
              <Button variant="outline" className="px-6">Démarrer l'essai 14 jours <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </a>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Analyse locale, rien n'est envoyé</span>
            <span className="inline-flex items-center gap-1"><CreditCard className="h-3.5 w-3.5 text-primary" /> Sans carte bancaire</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> Données en France</span>
          </div>
          <TrustCredentials className="mt-8" />
        </div>
      </section>
    </div>
  );
}
