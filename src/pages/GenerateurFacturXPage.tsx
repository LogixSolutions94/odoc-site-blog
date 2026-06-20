import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { BackButton } from "@/components/BackButton";
import { TrustCredentials } from "@/components/TrustCredentials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { subscribeNewsletter } from "@/lib/newsletter";
import {
  ArrowRight, Plus, Trash2, FileCode2, Printer, CheckCircle, AlertTriangle,
  MapPin, CreditCard, ShieldCheck,
} from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;

type Line = { designation: string; qte: number; puHt: number; tva: number };

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmt = (n: number) => (Math.round(n * 100) / 100).toFixed(2);
const ymd = (iso: string) => (iso ? iso.replaceAll("-", "") : "");
const todayIso = () => new Date().toISOString().slice(0, 10);

export default function GenerateurFacturXPage() {
  const { toast } = useToast();

  const [emetteur, setEmetteur] = useState({ nom: "", siret: "", adresse: "", tva: "" });
  const [client, setClient] = useState({ nom: "", siret: "", adresse: "" });
  const [meta, setMeta] = useState({ numero: "", date: todayIso(), echeance: "" });
  const [lines, setLines] = useState<Line[]>([{ designation: "", qte: 1, puHt: 0, tva: 20 }]);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const totals = useMemo(() => {
    let ht = 0;
    const byRate: Record<string, { base: number; tva: number }> = {};
    for (const l of lines) {
      const lineHt = (Number(l.qte) || 0) * (Number(l.puHt) || 0);
      ht += lineHt;
      const k = String(l.tva || 0);
      byRate[k] = byRate[k] || { base: 0, tva: 0 };
      byRate[k].base += lineHt;
      byRate[k].tva += lineHt * (Number(l.tva) || 0) / 100;
    }
    const tva = Object.values(byRate).reduce((s, r) => s + r.tva, 0);
    return { ht, tva, ttc: ht + tva, byRate };
  }, [lines]);

  const checks = [
    { label: "Identité de l'émetteur (nom)", ok: !!emetteur.nom.trim() },
    { label: "SIRET de l'émetteur", ok: /^\d{14}$/.test(emetteur.siret.replace(/\s/g, "")) },
    { label: "N° de TVA intracommunautaire", ok: !!emetteur.tva.trim() },
    { label: "Identité du client", ok: !!client.nom.trim() },
    { label: "Numéro de facture", ok: !!meta.numero.trim() },
    { label: "Date d'émission", ok: !!meta.date },
    { label: "Au moins une ligne valide", ok: lines.some((l) => l.designation.trim() && Number(l.puHt) > 0) },
    { label: "Taux et montant de TVA renseignés", ok: lines.every((l) => Number(l.tva) >= 0) && totals.ht > 0 },
  ];
  const allOk = checks.every((c) => c.ok);

  function setLine(i: number, patch: Partial<Line>) {
    setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  function buildCII(): string {
    const lineXml = lines
      .map(
        (l, i) => `    <ram:IncludedSupplyChainTradeLineItem>
      <ram:AssociatedDocumentLineDocument><ram:LineID>${i + 1}</ram:LineID></ram:AssociatedDocumentLineDocument>
      <ram:SpecifiedTradeProduct><ram:Name>${esc(l.designation)}</ram:Name></ram:SpecifiedTradeProduct>
      <ram:SpecifiedLineTradeAgreement><ram:NetPriceProductTradePrice><ram:ChargeAmount>${fmt(Number(l.puHt) || 0)}</ram:ChargeAmount></ram:NetPriceProductTradePrice></ram:SpecifiedLineTradeAgreement>
      <ram:SpecifiedLineTradeDelivery><ram:BilledQuantity unitCode="C62">${fmt(Number(l.qte) || 0)}</ram:BilledQuantity></ram:SpecifiedLineTradeDelivery>
      <ram:SpecifiedLineTradeSettlement>
        <ram:ApplicableTradeTax><ram:TypeCode>VAT</ram:TypeCode><ram:CategoryCode>S</ram:CategoryCode><ram:RateApplicablePercent>${fmt(Number(l.tva) || 0)}</ram:RateApplicablePercent></ram:ApplicableTradeTax>
        <ram:SpecifiedTradeSettlementLineMonetarySummation><ram:LineTotalAmount>${fmt((Number(l.qte) || 0) * (Number(l.puHt) || 0))}</ram:LineTotalAmount></ram:SpecifiedTradeSettlementLineMonetarySummation>
      </ram:SpecifiedLineTradeSettlement>
    </ram:IncludedSupplyChainTradeLineItem>`
      )
      .join("\n");

    const taxXml = Object.entries(totals.byRate)
      .map(
        ([rate, r]) => `      <ram:ApplicableTradeTax>
        <ram:CalculatedAmount>${fmt(r.tva)}</ram:CalculatedAmount>
        <ram:TypeCode>VAT</ram:TypeCode>
        <ram:BasisAmount>${fmt(r.base)}</ram:BasisAmount>
        <ram:CategoryCode>S</ram:CategoryCode>
        <ram:RateApplicablePercent>${fmt(Number(rate))}</ram:RateApplicablePercent>
      </ram:ApplicableTradeTax>`
      )
      .join("\n");

    const due = ymd(meta.echeance)
      ? `\n      <ram:SpecifiedTradePaymentTerms><ram:DueDateDateTime><udt:DateTimeString format="102">${ymd(meta.echeance)}</udt:DateTimeString></ram:DueDateDateTime></ram:SpecifiedTradePaymentTerms>`
      : "";

    return `<?xml version="1.0" encoding="UTF-8"?>
<rsm:CrossIndustryInvoice xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100" xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100" xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100">
  <rsm:ExchangedDocumentContext>
    <ram:GuidelineSpecifiedDocumentContextParameter><ram:ID>urn:cen.eu:en16931:2017</ram:ID></ram:GuidelineSpecifiedDocumentContextParameter>
  </rsm:ExchangedDocumentContext>
  <rsm:ExchangedDocument>
    <ram:ID>${esc(meta.numero)}</ram:ID>
    <ram:TypeCode>380</ram:TypeCode>
    <ram:IssueDateTime><udt:DateTimeString format="102">${ymd(meta.date)}</udt:DateTimeString></ram:IssueDateTime>
  </rsm:ExchangedDocument>
  <rsm:SupplyChainTradeTransaction>
${lineXml}
    <ram:ApplicableHeaderTradeAgreement>
      <ram:SellerTradeParty>
        <ram:Name>${esc(emetteur.nom)}</ram:Name>
        <ram:SpecifiedLegalOrganization><ram:ID schemeID="0009">${esc(emetteur.siret.replace(/\s/g, ""))}</ram:ID></ram:SpecifiedLegalOrganization>
        <ram:PostalTradeAddress><ram:CountryID>FR</ram:CountryID></ram:PostalTradeAddress>
        <ram:SpecifiedTaxRegistration><ram:ID schemeID="VA">${esc(emetteur.tva)}</ram:ID></ram:SpecifiedTaxRegistration>
      </ram:SellerTradeParty>
      <ram:BuyerTradeParty>
        <ram:Name>${esc(client.nom)}</ram:Name>
        <ram:PostalTradeAddress><ram:CountryID>FR</ram:CountryID></ram:PostalTradeAddress>
      </ram:BuyerTradeParty>
    </ram:ApplicableHeaderTradeAgreement>
    <ram:ApplicableHeaderTradeDelivery/>
    <ram:ApplicableHeaderTradeSettlement>
      <ram:InvoiceCurrencyCode>EUR</ram:InvoiceCurrencyCode>
${taxXml}${due}
      <ram:SpecifiedTradeSettlementHeaderMonetarySummation>
        <ram:LineTotalAmount>${fmt(totals.ht)}</ram:LineTotalAmount>
        <ram:TaxBasisTotalAmount>${fmt(totals.ht)}</ram:TaxBasisTotalAmount>
        <ram:TaxTotalAmount currencyID="EUR">${fmt(totals.tva)}</ram:TaxTotalAmount>
        <ram:GrandTotalAmount>${fmt(totals.ttc)}</ram:GrandTotalAmount>
        <ram:DuePayableAmount>${fmt(totals.ttc)}</ram:DuePayableAmount>
      </ram:SpecifiedTradeSettlementHeaderMonetarySummation>
    </ram:ApplicableHeaderTradeSettlement>
  </rsm:SupplyChainTradeTransaction>
</rsm:CrossIndustryInvoice>`;
  }

  function download(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadXml() {
    if (!allOk) {
      toast({ title: "Champs manquants", description: "Complétez les mentions obligatoires (en rouge) avant de générer.", variant: "destructive" });
      return;
    }
    download(`facture-${meta.numero || "facturx"}.xml`, buildCII(), "application/xml");
    toast({ title: "✓ XML Factur-X généré", description: "Le volet structuré (CII, profil EN 16931) est téléchargé." });
  }

  function printPdf() {
    const rows = lines
      .map(
        (l) => `<tr><td>${esc(l.designation)}</td><td style="text-align:right">${fmt(Number(l.qte) || 0)}</td><td style="text-align:right">${fmt(Number(l.puHt) || 0)} €</td><td style="text-align:right">${fmt(Number(l.tva) || 0)} %</td><td style="text-align:right">${fmt((Number(l.qte) || 0) * (Number(l.puHt) || 0))} €</td></tr>`
      )
      .join("");
    const w = window.open("", "_blank", "noopener,noreferrer,width=800,height=900");
    if (!w) { toast({ title: "Pop-up bloquée", description: "Autorisez les pop-ups pour générer le PDF.", variant: "destructive" }); return; }
    w.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Facture ${esc(meta.numero)}</title>
<style>body{font-family:'Plus Jakarta Sans',Arial,sans-serif;color:#1a1d2e;padding:40px;max-width:720px;margin:auto}
h1{font-size:22px;margin:0 0 4px}table{width:100%;border-collapse:collapse;margin-top:24px;font-size:13px}
th,td{padding:8px;border-bottom:1px solid #e5e7eb;text-align:left}th{background:#f3f4f6}
.grid{display:flex;justify-content:space-between;gap:24px;margin-top:24px;font-size:13px}
.tot{margin-top:16px;margin-left:auto;width:240px;font-size:13px}.tot div{display:flex;justify-content:space-between;padding:4px 0}
.ttc{font-weight:700;border-top:2px solid #1a1d2e;margin-top:4px;padding-top:8px}.muted{color:#6b7280}</style></head>
<body><h1>Facture ${esc(meta.numero)}</h1><p class="muted">Émise le ${esc(meta.date)}${meta.echeance ? " · échéance " + esc(meta.echeance) : ""}</p>
<div class="grid"><div><strong>Émetteur</strong><br>${esc(emetteur.nom)}<br>${esc(emetteur.adresse)}<br>SIRET ${esc(emetteur.siret)}<br>TVA ${esc(emetteur.tva)}</div>
<div><strong>Client</strong><br>${esc(client.nom)}<br>${esc(client.adresse)}${client.siret ? "<br>SIRET " + esc(client.siret) : ""}</div></div>
<table><thead><tr><th>Désignation</th><th>Qté</th><th>PU HT</th><th>TVA</th><th>Total HT</th></tr></thead><tbody>${rows}</tbody></table>
<div class="tot"><div><span class="muted">Total HT</span><span>${fmt(totals.ht)} €</span></div>
<div><span class="muted">TVA</span><span>${fmt(totals.tva)} €</span></div>
<div class="ttc"><span>Total TTC</span><span>${fmt(totals.ttc)} €</span></div></div>
<p class="muted" style="margin-top:32px;font-size:11px">Document généré avec le générateur gratuit OdocPilot — odocpilot.com</p>
<script>window.onload=function(){window.print()}</script></body></html>`);
    w.document.close();
  }

  const [website, setWebsite] = useState(""); // honeypot

  async function captureEmail(e: React.FormEvent) {
    e.preventDefault();
    const result = await subscribeNewsletter(email, "generateur", website);
    if (!result.ok) {
      toast({ title: "Erreur", description: result.error, variant: "destructive" });
      return;
    }
    setSent(true);
    toast({ title: "✓ Merci !", description: "Vous recevrez la checklist conformité + nos modèles." });
  }

  const field = "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm";

  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Générateur Factur-X gratuit (XML EN 16931) — sans inscription | OdocPilot"
        description="Créez gratuitement le volet XML structuré (Factur-X CII, profil EN 16931) de votre facture + un PDF, et vérifiez vos mentions obligatoires. Sans inscription. Données et IA en France."
        canonical="/generateur-factur-x"
      />
      <BackButton to="/e-facture" label="← La réforme e-facture" />

      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Outil gratuit · sans inscription</span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Générateur de facture au format Factur-X
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
            Remplissez votre facture : vous obtenez le <strong className="text-foreground">volet XML structuré</strong> (Factur-X CII, profil EN 16931)
            et un PDF, et nous vérifions vos <strong className="text-foreground">mentions obligatoires</strong>. Aucun compte requis.
          </p>
        </div>

        <div className="mt-10 grid lg:grid-cols-[1.3fr,1fr] gap-6 items-start">
          {/* Formulaire */}
          <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card space-y-5">
            <div>
              <p className="text-sm font-bold text-foreground mb-2">Émetteur (vous)</p>
              <div className="grid sm:grid-cols-2 gap-2">
                <input className={field} placeholder="Raison sociale" value={emetteur.nom} onChange={(e) => setEmetteur({ ...emetteur, nom: e.target.value })} />
                <input className={field} placeholder="SIRET (14 chiffres)" value={emetteur.siret} onChange={(e) => setEmetteur({ ...emetteur, siret: e.target.value })} />
                <input className={field} placeholder="Adresse" value={emetteur.adresse} onChange={(e) => setEmetteur({ ...emetteur, adresse: e.target.value })} />
                <input className={field} placeholder="N° TVA intracom. (FR…)" value={emetteur.tva} onChange={(e) => setEmetteur({ ...emetteur, tva: e.target.value })} />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground mb-2">Client</p>
              <div className="grid sm:grid-cols-2 gap-2">
                <input className={field} placeholder="Nom du client" value={client.nom} onChange={(e) => setClient({ ...client, nom: e.target.value })} />
                <input className={field} placeholder="SIRET client (optionnel)" value={client.siret} onChange={(e) => setClient({ ...client, siret: e.target.value })} />
                <input className={`${field} sm:col-span-2`} placeholder="Adresse client" value={client.adresse} onChange={(e) => setClient({ ...client, adresse: e.target.value })} />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground mb-2">Facture</p>
              <div className="grid sm:grid-cols-3 gap-2">
                <input className={field} placeholder="N° facture" value={meta.numero} onChange={(e) => setMeta({ ...meta, numero: e.target.value })} />
                <input className={field} type="date" value={meta.date} onChange={(e) => setMeta({ ...meta, date: e.target.value })} />
                <input className={field} type="date" value={meta.echeance} onChange={(e) => setMeta({ ...meta, echeance: e.target.value })} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-foreground">Lignes</p>
                <button type="button" onClick={() => setLines([...lines, { designation: "", qte: 1, puHt: 0, tva: 20 }])} className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  <Plus className="h-3.5 w-3.5" /> Ajouter une ligne
                </button>
              </div>
              <div className="space-y-2">
                {lines.map((l, i) => (
                  <div key={i} className="grid grid-cols-[1fr,56px,72px,56px,28px] gap-1.5 items-center">
                    <input className={field} placeholder="Désignation" value={l.designation} onChange={(e) => setLine(i, { designation: e.target.value })} />
                    <input className={`${field} px-2 text-right`} type="number" min={0} value={l.qte} onChange={(e) => setLine(i, { qte: Number(e.target.value) })} title="Quantité" />
                    <input className={`${field} px-2 text-right`} type="number" min={0} step="0.01" value={l.puHt} onChange={(e) => setLine(i, { puHt: Number(e.target.value) })} title="PU HT" />
                    <input className={`${field} px-2 text-right`} type="number" min={0} value={l.tva} onChange={(e) => setLine(i, { tva: Number(e.target.value) })} title="TVA %" />
                    <button type="button" onClick={() => setLines(lines.filter((_, idx) => idx !== i))} disabled={lines.length === 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30" title="Supprimer">
                      <Trash2 className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 ml-auto w-full sm:w-56 text-sm">
                <div className="flex justify-between py-0.5"><span className="text-muted-foreground">Total HT</span><span className="tabular-nums">{fmt(totals.ht)} €</span></div>
                <div className="flex justify-between py-0.5"><span className="text-muted-foreground">TVA</span><span className="tabular-nums">{fmt(totals.tva)} €</span></div>
                <div className="flex justify-between py-1 mt-1 border-t border-border font-bold"><span>Total TTC</span><span className="tabular-nums">{fmt(totals.ttc)} €</span></div>
              </div>
            </div>
          </MotionDiv>

          {/* Colonne droite : mentions + actions */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <p className="text-sm font-bold text-foreground flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Mentions obligatoires</p>
              <ul className="mt-3 space-y-1.5">
                {checks.map((c) => (
                  <li key={c.label} className="flex items-center gap-2 text-xs">
                    {c.ok ? <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" /> : <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                    <span className={c.ok ? "text-muted-foreground" : "text-red-600 font-medium"}>{c.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-2.5">
              <Button onClick={downloadXml} className="w-full bg-gradient-cta text-primary-foreground font-bold" data-umami-event="generateur-xml">
                <FileCode2 className="mr-2 h-4 w-4" /> Télécharger le XML Factur-X
              </Button>
              <Button onClick={printPdf} variant="outline" className="w-full" data-umami-event="generateur-pdf">
                <Printer className="mr-2 h-4 w-4" /> Aperçu / PDF imprimable
              </Button>
              <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                Vous obtenez le <strong className="text-foreground">volet XML structuré</strong> (CII, profil EN 16931) + un PDF.
                La fusion XML + PDF/A-3 et la <strong className="text-foreground">transmission via plateforme agréée</strong> se font dans OdocPilot.
              </p>
              <Link to="/verificateur" className="block text-center text-xs font-semibold text-primary hover:underline" data-umami-event="generateur-to-verificateur">
                Déjà une facture ? Vérifiez sa conformité →
              </Link>
            </div>

            {/* Capture email après valeur */}
            {!sent ? (
              <form onSubmit={captureEmail} className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
                <p className="text-sm font-semibold text-foreground">Recevez la checklist conformité + nos modèles de factures</p>
                <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
                  <label htmlFor="gen-website">Website</label>
                  <input type="text" id="gen-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  <Input type="email" required placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Button type="submit" className="bg-gradient-cta text-primary-foreground font-semibold" data-umami-event="generateur-email">Recevoir</Button>
                </div>
              </form>
            ) : (
              <div className="rounded-2xl border border-primary/30 bg-card p-5 flex items-center gap-2 text-sm"><CheckCircle className="h-5 w-5 text-primary" /> C'est envoyé !</div>
            )}
          </div>
        </div>

        {/* CTA essai */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-foreground">Et si l'IA préparait toutes vos factures&nbsp;?</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">Dans OdocPilot, vos factures reçues sont lues et classées automatiquement, et vos factures sortent au format conforme — vous validez en un clic.</p>
          <a href={SIGNUP} data-umami-event="generateur-cta-essai">
            <Button size="lg" className="mt-4 bg-gradient-cta text-primary-foreground font-bold px-8">Commencer gratuitement <ArrowRight className="ml-2 h-5 w-5" /></Button>
          </a>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><CreditCard className="h-3.5 w-3.5 text-primary" /> Sans carte bancaire</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> Données en France</span>
          </div>
          <TrustCredentials className="mt-8" />
        </div>
      </section>
    </div>
  );
}
