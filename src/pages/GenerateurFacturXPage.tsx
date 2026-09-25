import { useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronRight, Circle, Download, Plus, Trash2 } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { NewsletterInline } from "@/components/blog/NewsletterInline";
import { useToast } from "@/hooks/use-toast";
import { PLANS, SIGNUP_URL, TRIAL, formatEur } from "@/lib/marketing";
import { fr } from "@/lib/typo";

type Line = { designation: string; qte: number; puHt: number; tva: number };

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmt = (n: number) => (Math.round(n * 100) / 100).toFixed(2);
const ymd = (iso: string) => (iso ? iso.replace(/-/g, "") : "");
const todayIso = () => new Date().toISOString().slice(0, 10);

/** Affichage à l'écran seulement (« 1 234,50 € ») ; le XML garde fmt(). */
const money = (n: number) => formatEur(Number(fmt(n)));

const PAGE_URL = "https://odocpilot.com/generateur-factur-x";
const FREE_PLAN = PLANS.find((p) => p.id === "conformite") ?? PLANS[0];

const STEPS = [
  "Remplissez la facture : vous, votre client, les lignes.",
  "Suivez la liste des mentions obligatoires : elle se coche au fur et à mesure.",
  "Téléchargez le XML Factur-X et imprimez la facture en PDF.",
];

const FAQ = [
  {
    q: "Qu'est-ce qu'une facture Factur-X ?",
    a: "Factur-X est un format de facture électronique franco-allemand. C'est un PDF lisible par une personne, qui contient aussi un fichier XML lisible par les logiciels. C'est l'un des trois formats de la réforme française, avec UBL et CII.",
  },
  {
    q: "Qu'est-ce que je télécharge avec ce générateur ?",
    a: "Deux versions de la même facture : le fichier XML au format Factur-X (syntaxe CII, profil EN 16931) et un PDF à imprimer ou à enregistrer. Le générateur ne réunit pas les deux dans un seul fichier : c'est ce que fait OdocPilot.",
  },
  {
    q: "Mes informations sont-elles envoyées quelque part ?",
    a: "Non. La facture est calculée et produite dans votre navigateur : les informations saisies ne sont envoyées à aucun serveur. Vous n'avez pas besoin de compte.",
  },
  {
    q: "Ce fichier suffit-il pour être en règle en 2027 ?",
    a: "Pas à lui seul. À partir du 1er septembre 2027, les PME, les TPE et les micro-entreprises devront émettre leurs factures dans un format électronique et les transmettre par une plateforme agréée. Ce générateur sert à préparer et à tester le format.",
  },
  {
    q: "Je suis auto-entrepreneur, sans TVA. Puis-je l'utiliser ?",
    a: "Pas encore. Le générateur demande un numéro de TVA et applique une TVA à chaque ligne. La franchise en base de TVA (mention « TVA non applicable, art. 293 B du CGI ») n'y est pas encore prise en charge.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${PAGE_URL}#outil`,
      name: "Générateur de facture Factur-X",
      url: PAGE_URL,
      description:
        "Outil gratuit qui produit le fichier XML Factur-X (syntaxe CII, profil EN 16931) d'une facture et un PDF à imprimer, dans le navigateur, sans inscription.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "fr-FR",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      publisher: { "@id": "https://odocpilot.com/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://odocpilot.com/#organization",
      name: "OdocPilot",
      url: "https://odocpilot.com",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://odocpilot.com" },
        { "@type": "ListItem", position: 2, name: "Facture électronique", item: "https://odocpilot.com/e-facture" },
        { "@type": "ListItem", position: 3, name: "Générateur Factur-X", item: PAGE_URL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

/* ── Feuille (objet) : reste une feuille claire en mode sombre ─────────────── */
const SHEET =
  "rounded-lg border border-sheet-rule bg-sheet text-sheet-ink shadow-sheet [color-scheme:light] [&_:focus-visible]:outline-[hsl(var(--sheet-ink))]";
const FIELD =
  "block h-11 w-full rounded-md border border-[hsl(var(--sheet-soft)/0.7)] bg-sheet px-3 text-[0.9375rem] text-sheet-ink placeholder:text-[hsl(var(--sheet-soft)/0.8)] focus-visible:border-[hsl(var(--sheet-ink))] focus-visible:outline-offset-0";
const NUMBER_FIELD = `${FIELD} px-2.5 text-right font-data`;

function Field({
  id,
  label,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[0.875rem] font-bold">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.8125rem] leading-snug text-sheet-soft">
          {hint}
        </p>
      )}
    </div>
  );
}

function StepLegend({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <legend className="mb-4 flex items-baseline gap-2.5 font-display text-[1.0625rem] font-bold">
      <span className="font-data text-[0.875rem] font-normal text-sheet-soft">{n}</span>
      {children}
    </legend>
  );
}

function CheckRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-start gap-2.5 py-1.5 text-[0.875rem] leading-snug">
      <span
        aria-hidden="true"
        className={`mt-px grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border ${
          ok
            ? "border-[hsl(var(--sheet-ink))] bg-[hsl(var(--sheet-ink))] text-[hsl(var(--sheet))]"
            : "border-[hsl(var(--sheet-soft)/0.7)] text-transparent"
        }`}
      >
        <Check size={11} strokeWidth={3} />
      </span>
      <span className={ok ? "text-sheet-soft" : "font-bold"}>
        <span className="sr-only">{ok ? "Renseigné : " : "À compléter : "}</span>
        {label}
      </span>
      {!ok && (
        <span aria-hidden="true" className="ml-auto shrink-0 pl-2 text-[0.8125rem] text-sheet-soft">
          à compléter
        </span>
      )}
    </li>
  );
}

export default function GenerateurFacturXPage() {
  const { toast } = useToast();
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  const [emetteur, setEmetteur] = useState({ nom: "", siret: "", adresse: "", tva: "" });
  const [client, setClient] = useState({ nom: "", siret: "", adresse: "" });
  const [meta, setMeta] = useState({ numero: "", date: todayIso(), echeance: "" });
  const [lines, setLines] = useState<Line[]>([{ designation: "", qte: 1, puHt: 0, tva: 20 }]);
  /** Ce que le visiteur vient d'obtenir (affiche la suite logique : OdocPilot). */
  const [produced, setProduced] = useState<"xml" | "pdf" | null>(null);

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
  const okCount = checks.filter((c) => c.ok).length;

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
      toast({
        title: "Des mentions manquent",
        description: fr("Complétez les mentions marquées « à compléter », puis téléchargez."),
        variant: "destructive",
      });
      return;
    }
    download(`facture-${meta.numero || "facturx"}.xml`, buildCII(), "application/xml");
    setProduced("xml");
    toast({
      title: "XML Factur-X téléchargé",
      description: "Le fichier XML de votre facture (syntaxe CII, profil EN 16931) est téléchargé.",
    });
  }

  function printPdf() {
    const rows = lines
      .map(
        (l) => `<tr><td>${esc(l.designation)}</td><td style="text-align:right">${fmt(Number(l.qte) || 0)}</td><td style="text-align:right">${fmt(Number(l.puHt) || 0)} €</td><td style="text-align:right">${fmt(Number(l.tva) || 0)} %</td><td style="text-align:right">${fmt((Number(l.qte) || 0) * (Number(l.puHt) || 0))} €</td></tr>`
      )
      .join("");
    // Pas de « noopener » dans les options : avec lui, window.open renvoie toujours null
    // (spécification HTML), la fenêtre restait vide et l'on annonçait « pop-up bloquée ».
    // Le lien vers cette page est coupé juste après l'ouverture (w.opener = null).
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) {
      toast({
        title: "Fenêtre bloquée",
        description: "Autorisez les fenêtres pop-up pour ce site, puis réessayez.",
        variant: "destructive",
      });
      return;
    }
    w.opener = null;
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
<p class="muted" style="margin-top:32px;font-size:11px">Document généré avec le générateur gratuit OdocPilot (odocpilot.com)</p>
</body></html>`);
    w.document.close();
    // Impression lancée depuis cette page : la CSP du site (script-src 'self') bloquerait
    // un <script> écrit dans la fenêtre.
    w.focus();
    w.print();
    setProduced((p) => p ?? "pdf");
  }

  return (
    <div>
      <SEOHead
        title="Générateur de facture Factur-X gratuit | OdocPilot"
        description="Créez gratuitement le fichier XML Factur-X (profil EN 16931) de votre facture et un PDF à imprimer. Sans inscription, tout reste dans votre navigateur."
        canonical="/generateur-factur-x"
        jsonLd={JSON_LD}
      />

      {/* ─── En-tête ─────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10">
          <nav aria-label="Fil d'Ariane" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link to="/" className="transition-colors duration-200 hover:text-foreground">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} strokeWidth={1.75} />
              </li>
              <li>
                <Link to="/e-facture" className="transition-colors duration-200 hover:text-foreground">
                  Facture électronique
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} strokeWidth={1.75} />
              </li>
              <li aria-current="page" className="text-foreground">
                Générateur Factur-X
              </li>
            </ol>
          </nav>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-20">
            <div>
              <p className="text-sm font-bold text-muted-foreground">Outil gratuit, sans inscription</p>
              <h1 className="mt-4 font-display display-tight text-[clamp(2.4rem,5.2vw,4.25rem)] font-bold leading-[1.02]">
                Générateur de facture Factur-X gratuit
              </h1>
              <p className="mt-6 max-w-[38rem] text-[1.1875rem] leading-relaxed text-muted-foreground">
                Remplissez votre facture&nbsp;: vous obtenez le fichier XML au format Factur-X (profil EN 16931) et un PDF
                à imprimer, avec la vérification des mentions obligatoires. Gratuit et sans inscription&nbsp;: tout se
                passe dans votre navigateur.
              </p>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">En 3 étapes</h2>
              <ol className="mt-4 border-t border-foreground/80">
                {STEPS.map((step, i) => (
                  <li key={step} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 border-b border-border py-3 leading-snug">
                    <span className="font-data text-muted-foreground">{i + 1}</span>
                    <span>{fr(step)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ─── L'outil : la facture (feuille) et le contrôle ─────── */}
      <section aria-label="Créer votre facture" className="border-b border-border bg-desk">
        <div className="mx-auto grid max-w-[1240px] items-start gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-10">
          <form aria-label="Votre facture" onSubmit={(e) => e.preventDefault()} className={SHEET}>
            <div className="flex items-center justify-between gap-3 border-b border-sheet-rule px-5 py-3.5 sm:px-7">
              <p className="font-display text-[1.05rem] font-bold">Votre facture</p>
              <p className="text-[0.8125rem] text-sheet-soft">Montants en euros</p>
            </div>

            <fieldset className="border-b border-sheet-rule px-5 py-6 sm:px-7">
              <StepLegend n={1}>Vous, l'émetteur</StepLegend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id={fid("em-nom")} label="Nom ou raison sociale">
                  <input
                    id={fid("em-nom")}
                    className={FIELD}
                    autoComplete="organization"
                    value={emetteur.nom}
                    onChange={(e) => setEmetteur({ ...emetteur, nom: e.target.value })}
                  />
                </Field>
                <Field id={fid("em-siret")} label="SIRET" hint="14 chiffres">
                  <input
                    id={fid("em-siret")}
                    className={`${FIELD} font-data`}
                    inputMode="numeric"
                    autoComplete="off"
                    aria-describedby={`${fid("em-siret")}-hint`}
                    value={emetteur.siret}
                    onChange={(e) => setEmetteur({ ...emetteur, siret: e.target.value })}
                  />
                </Field>
                <Field id={fid("em-adresse")} label="Adresse">
                  <input
                    id={fid("em-adresse")}
                    className={FIELD}
                    autoComplete="street-address"
                    value={emetteur.adresse}
                    onChange={(e) => setEmetteur({ ...emetteur, adresse: e.target.value })}
                  />
                </Field>
                <Field id={fid("em-tva")} label="N° de TVA intracommunautaire" hint="Commence par FR">
                  <input
                    id={fid("em-tva")}
                    className={`${FIELD} font-data`}
                    autoComplete="off"
                    aria-describedby={`${fid("em-tva")}-hint`}
                    value={emetteur.tva}
                    onChange={(e) => setEmetteur({ ...emetteur, tva: e.target.value })}
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset className="border-b border-sheet-rule px-5 py-6 sm:px-7">
              <StepLegend n={2}>Votre client</StepLegend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id={fid("cl-nom")} label="Nom du client">
                  <input
                    id={fid("cl-nom")}
                    className={FIELD}
                    autoComplete="off"
                    value={client.nom}
                    onChange={(e) => setClient({ ...client, nom: e.target.value })}
                  />
                </Field>
                <Field
                  id={fid("cl-siret")}
                  label="SIREN ou SIRET du client (facultatif)"
                  hint="Facultatif ici, mais c'est une des nouvelles mentions de la facture électronique."
                >
                  <input
                    id={fid("cl-siret")}
                    className={`${FIELD} font-data`}
                    inputMode="numeric"
                    autoComplete="off"
                    aria-describedby={`${fid("cl-siret")}-hint`}
                    value={client.siret}
                    onChange={(e) => setClient({ ...client, siret: e.target.value })}
                  />
                </Field>
                <Field id={fid("cl-adresse")} label="Adresse du client" className="sm:col-span-2">
                  <input
                    id={fid("cl-adresse")}
                    className={FIELD}
                    autoComplete="off"
                    value={client.adresse}
                    onChange={(e) => setClient({ ...client, adresse: e.target.value })}
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset className="border-b border-sheet-rule px-5 py-6 sm:px-7">
              <StepLegend n={3}>La facture</StepLegend>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field id={fid("numero")} label="Numéro de facture">
                  <input
                    id={fid("numero")}
                    className={`${FIELD} font-data`}
                    placeholder="F-2026-001"
                    autoComplete="off"
                    value={meta.numero}
                    onChange={(e) => setMeta({ ...meta, numero: e.target.value })}
                  />
                </Field>
                <Field id={fid("date")} label="Date d'émission">
                  <input
                    id={fid("date")}
                    className={`${FIELD} font-data`}
                    type="date"
                    value={meta.date}
                    onChange={(e) => setMeta({ ...meta, date: e.target.value })}
                  />
                </Field>
                <Field id={fid("echeance")} label="Échéance (facultatif)">
                  <input
                    id={fid("echeance")}
                    className={`${FIELD} font-data`}
                    type="date"
                    value={meta.echeance}
                    onChange={(e) => setMeta({ ...meta, echeance: e.target.value })}
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset className="px-5 py-6 sm:px-7">
              <StepLegend n={4}>Les lignes</StepLegend>
              <div
                aria-hidden="true"
                className="hidden grid-cols-[minmax(0,1fr)_4.75rem_6.5rem_4.75rem_2.75rem] gap-2 pb-2 text-[0.8125rem] font-bold text-sheet-soft sm:grid"
              >
                <span>Désignation</span>
                <span className="text-right">Qté</span>
                <span className="text-right">PU HT (€)</span>
                <span className="text-right">TVA (%)</span>
                <span />
              </div>
              <ul className="space-y-3 sm:space-y-2">
                {lines.map((l, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-3 gap-2 border-t border-sheet-rule pt-3 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,1fr)_4.75rem_6.5rem_4.75rem_2.75rem] sm:items-center sm:border-t-0 sm:pt-0"
                  >
                    <div className="col-span-3 sm:col-span-1">
                      <label htmlFor={fid(`l${i}-designation`)} className="mb-1 block text-[0.8125rem] font-bold sm:sr-only">
                        Désignation<span className="sr-only">, ligne {i + 1}</span>
                      </label>
                      <input
                        id={fid(`l${i}-designation`)}
                        className={FIELD}
                        placeholder="Prestation, produit…"
                        autoComplete="off"
                        value={l.designation}
                        onChange={(e) => setLine(i, { designation: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor={fid(`l${i}-qte`)} className="mb-1 block text-[0.8125rem] font-bold sm:sr-only">
                        Quantité<span className="sr-only">, ligne {i + 1}</span>
                      </label>
                      <input
                        id={fid(`l${i}-qte`)}
                        className={NUMBER_FIELD}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        value={l.qte}
                        onChange={(e) => setLine(i, { qte: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label htmlFor={fid(`l${i}-pu`)} className="mb-1 block text-[0.8125rem] font-bold sm:sr-only">
                        PU HT (€)<span className="sr-only">, ligne {i + 1}</span>
                      </label>
                      <input
                        id={fid(`l${i}-pu`)}
                        className={NUMBER_FIELD}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        value={l.puHt}
                        onChange={(e) => setLine(i, { puHt: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label htmlFor={fid(`l${i}-tva`)} className="mb-1 block text-[0.8125rem] font-bold sm:sr-only">
                        TVA (%)<span className="sr-only">, ligne {i + 1}</span>
                      </label>
                      <input
                        id={fid(`l${i}-tva`)}
                        className={NUMBER_FIELD}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        value={l.tva}
                        onChange={(e) => setLine(i, { tva: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-span-3 flex justify-end sm:col-span-1">
                      <button
                        type="button"
                        onClick={() => setLines(lines.filter((_, idx) => idx !== i))}
                        disabled={lines.length === 1}
                        aria-label={`Retirer la ligne ${i + 1}`}
                        className="inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-md px-2 text-[0.8125rem] text-sheet-soft transition-colors duration-200 hover:text-sheet-ink disabled:opacity-30"
                      >
                        <Trash2 size={16} strokeWidth={1.75} aria-hidden="true" />
                        <span className="sm:sr-only">Retirer</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setLines([...lines, { designation: "", qte: 1, puHt: 0, tva: 20 }])}
                className="mt-4 inline-flex min-h-10 items-center gap-1.5 rounded-md text-[0.9375rem] font-bold underline-offset-4 hover:underline"
              >
                <Plus size={16} strokeWidth={2} aria-hidden="true" /> Ajouter une ligne
              </button>

              <dl className="ml-auto mt-6 w-full max-w-[17rem] text-[0.9375rem]">
                <div className="flex justify-between py-1">
                  <dt className="text-sheet-soft">Total HT</dt>
                  <dd className="font-data">{money(totals.ht)}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-sheet-soft">TVA</dt>
                  <dd className="font-data">{money(totals.tva)}</dd>
                </div>
                <div className="mt-1 flex justify-between border-t border-[hsl(var(--sheet-ink)/0.7)] pt-2 font-bold">
                  <dt>Total TTC</dt>
                  <dd className="font-data">{money(totals.ttc)}</dd>
                </div>
              </dl>
            </fieldset>
          </form>

          <div className="space-y-6 lg:sticky lg:top-24">
            <section aria-labelledby={fid("mentions")} className={SHEET}>
              <div className="flex items-center justify-between gap-3 border-b border-sheet-rule px-5 py-3.5">
                <h2 id={fid("mentions")} className="font-display text-[1.05rem] font-bold">
                  Mentions obligatoires
                </h2>
                <p className="font-data text-[0.8125rem] text-sheet-soft">
                  {okCount}/{checks.length}
                </p>
              </div>
              <ul className="px-5 py-3">
                {checks.map((c) => (
                  <CheckRow key={c.label} ok={c.ok} label={c.label} />
                ))}
              </ul>
              <p className="border-t border-sheet-rule px-5 py-3 text-[0.8125rem] leading-snug text-sheet-soft">
                {fr(allOk ? "Tout y est : vous pouvez télécharger." : "Complétez les mentions « à compléter » pour télécharger le XML.")}
              </p>
            </section>

            <div className="space-y-3">
              <button type="button" onClick={downloadXml} className="btn-ink w-full" data-umami-event="generateur-xml">
                <Download size={18} strokeWidth={1.75} aria-hidden="true" /> Télécharger le XML Factur-X
              </button>
              <button
                type="button"
                onClick={printPdf}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-foreground/30 px-5 font-bold transition-colors duration-200 hover:border-foreground active:scale-[0.97]"
                data-umami-event="generateur-pdf"
              >
                Imprimer ou enregistrer en PDF
              </button>
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                {fr("Pour le PDF, choisissez « Enregistrer au format PDF » dans la fenêtre d'impression.")}
              </p>
            </div>

            {produced && (
              <div className="border-t border-foreground/80 pt-5">
                <p className="font-display text-lg font-bold leading-snug">
                  {produced === "xml" ? "Votre XML Factur-X est téléchargé." : "Votre facture est prête à imprimer."}
                </p>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {fr("Dans OdocPilot, le PDF et le XML sont réunis dans un seul fichier Factur-X, et vos factures restent rangées au même endroit.")}
                </p>
                <a href={SIGNUP_URL} className="btn-ink mt-4 w-full text-center" data-umami-event="generateur-cta-resultat">
                  {fr("Créer vos factures conformes dans OdocPilot, gratuitement")}
                </a>
              </div>
            )}

            <Link
              to="/verificateur"
              className="inline-flex min-h-10 items-center gap-2 text-[0.9375rem] font-bold link-underline"
              data-umami-event="generateur-to-verificateur"
            >
              {fr("Déjà une facture ? Vérifiez-la")} <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── La suite : OdocPilot ─────────────────────────────── */}
      <section aria-labelledby="cta-odocpilot" className="border-b border-border">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
          <div>
            <h2
              id="cta-odocpilot"
              className="font-display text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-[2.6rem]"
            >
              {fr("Créer vos factures conformes dans OdocPilot, gratuitement")}
            </h2>
            <p className="mt-5 max-w-[36rem] text-[1.0625rem] leading-relaxed text-muted-foreground">
              {fr("Dans OdocPilot, chaque facture sort au format Factur-X, profil EN 16931 : le PDF et le XML réunis dans un seul fichier. Vous la relisez, puis vous l'envoyez.")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href={SIGNUP_URL} className="btn-ink" data-umami-event="generateur-cta-essai">
                Commencer gratuitement <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
              </a>
              <Link to="/pricing" className="inline-flex min-h-12 items-center font-bold link-underline" data-umami-event="generateur-cta-tarifs">
                Voir les tarifs
              </Link>
            </div>
            <p className="mt-4 text-[0.9375rem] text-muted-foreground">
              {fr(`Palier ${FREE_PLAN.name} gratuit. Essai de l'offre ${TRIAL.plan} pendant ${TRIAL.days} jours, sans carte bancaire.`)}
            </p>
          </div>
          <div>
            <p className="font-display text-lg font-bold">{fr(`Compris dans le palier ${FREE_PLAN.name}, gratuit`)}</p>
            <ul className="mt-4 border-t border-foreground/80">
              {FREE_PLAN.features.map((feature) => (
                <li key={feature} className="flex gap-3 border-b border-border py-3 leading-snug">
                  <Check size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-petrole" />
                  {fr(feature)}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-foreground">
              {fr("OdocPilot n'est pas une plateforme agréée. L'envoi officiel de vos factures passera par une plateforme agréée partenaire ; ce raccordement n'est pas encore ouvert.")}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Factur-X, en bref ────────────────────────────────── */}
      <section aria-labelledby="factur-x" className="border-b border-border bg-desk">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <h2 id="factur-x" className="font-display text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-[2.6rem]">
            {fr("Factur-X : qu'est-ce que c'est ?")}
          </h2>
          <div className="max-w-[40rem] text-[1.0625rem] leading-relaxed">
            <p className="font-bold">
              {fr("Factur-X est un format de facture électronique : un PDF lisible par une personne, qui contient aussi un fichier XML lisible par les logiciels. C'est l'un des trois formats de la réforme, avec UBL et CII.")}
            </p>
            <p className="mt-5 text-muted-foreground">
              {fr("Une facture électronique n'est pas un PDF envoyé par e-mail. Depuis le 1er septembre 2026, toutes les entreprises assujetties à la TVA doivent pouvoir en recevoir. Le 1er septembre 2027, les PME, les TPE et les micro-entreprises devront aussi les émettre, et les transmettre par une plateforme agréée.")}
            </p>

            <h3 className="mt-10 font-display text-xl font-bold">Ce que fait ce générateur</h3>
            <ul className="mt-3 border-t border-foreground/80">
              {[
                "Il produit le fichier XML de votre facture (syntaxe CII, profil EN 16931) et une version PDF à imprimer.",
                "Il vérifie huit mentions : émetteur, SIRET, numéro de TVA, client, numéro et date de facture, lignes, TVA.",
              ].map((item) => (
                <li key={item} className="flex gap-3 border-b border-border py-3 text-base leading-snug">
                  <Check size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-petrole" />
                  {fr(item)}
                </li>
              ))}
            </ul>

            <h3 className="mt-8 font-display text-xl font-bold">Ce qu'il ne fait pas (encore)</h3>
            <ul className="mt-3 border-t border-foreground/80">
              {[
                "Il ne réunit pas le PDF et le XML dans un seul fichier Factur-X, et il n'envoie pas votre facture.",
                "Il ne gère pas la franchise en base de TVA (auto-entrepreneurs), ni les nouvelles mentions de la réforme comme le SIREN du client dans le XML ou la nature de l'opération.",
              ].map((item) => (
                <li key={item} className="flex gap-3 border-b border-border py-3 text-base leading-snug text-muted-foreground">
                  <Circle size={18} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0" />
                  {fr(item)}
                </li>
              ))}
            </ul>

            <ul className="mt-8 space-y-3 text-base">
              <li>
                <Link to="/verificateur" className="inline-flex items-center gap-2 font-bold link-underline">
                  Vérifier une facture Factur-X <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </li>
              <li>
                <Link to="/diagnostic" className="inline-flex items-center gap-2 font-bold link-underline">
                  Savoir ce qui vous concerne, en 3 minutes <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </li>
              <li>
                <Link to="/e-facture" className="inline-flex items-center gap-2 text-muted-foreground link-underline">
                  Le guide de la facture électronique <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── Questions ────────────────────────────────────────── */}
      <section aria-labelledby="faq-generateur">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <h2 id="faq-generateur" className="font-display text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-[2.6rem]">
              Questions fréquentes
            </h2>
            <NewsletterInline source="generateur" umamiEvent="generateur-email" />
          </div>
          <div className="border-t border-foreground/80">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-border">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[1.0625rem] font-bold leading-snug [&::-webkit-details-marker]:hidden">
                  {fr(f.q)}
                  <span
                    aria-hidden="true"
                    className="mt-0.5 font-display text-[1.5rem] font-normal leading-none transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </summary>
                <p className="-mt-1 pb-6 pr-10 leading-relaxed text-muted-foreground">{fr(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
