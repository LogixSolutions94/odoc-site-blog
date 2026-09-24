import { Download, FileText, Search } from "lucide-react";

/**
 * Vignettes du produit, redessinées à partir des vrais écrans d'OdocPilot
 * (libellés et statuts repris de l'application), avec des données fictives.
 * Ce sont des illustrations : rien n'y est cliquable, et c'est voulu.
 */

function Frame({ title, meta, children }: { title: string; meta?: string; children: React.ReactNode }) {
  return (
    <div aria-hidden="true" className="select-none rounded-lg border border-sheet-rule bg-sheet text-sheet-ink shadow-lift">
      <div className="flex items-center justify-between gap-3 border-b border-sheet-rule px-4 py-3">
        <p className="text-[0.8125rem] font-bold">{title}</p>
        {meta && <p className="text-[0.6875rem] text-sheet-soft">{meta}</p>}
      </div>
      {children}
    </div>
  );
}

const chip = {
  toValidate: "bg-[hsl(29_100%_63%/0.28)] text-[#7A3A06]",
  validated: "bg-[#0E5870]/10 text-[#0E5870]",
  paid: "bg-[#0F2229]/[0.06] text-[#4F6168]",
  late: "bg-[#B42318]/10 text-[#B42318]",
};

export function ReceivedInvoices() {
  const rows = [
    { name: "Plâtrerie Morel", due: "16 oct.", amount: "1 248,00 €", status: "À valider", tone: chip.toValidate },
    { name: "Location Martin", due: "3 oct.", amount: "330,00 €", status: "Validée", tone: chip.validated },
    { name: "Bois & Fixations Robert", due: "22 oct.", amount: "583,80 €", status: "Validée", tone: chip.validated },
    { name: "Énergie Plus", due: "20 sept.", amount: "142,80 €", status: "Payée", tone: chip.paid },
  ];
  return (
    <Frame title="Factures reçues" meta="Septembre 2026">
      <ul className="divide-y divide-[hsl(var(--sheet-rule))] px-4 text-[0.75rem]">
        {rows.map((r) => (
          <li key={r.name} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate font-bold">{r.name}</p>
              <p className="text-[0.6875rem] text-sheet-soft">Échéance {r.due}</p>
            </div>
            <p className="font-data">{r.amount}</p>
            <span className={`w-[4.75rem] rounded px-2 py-0.5 text-center text-[0.6875rem] font-bold ${r.tone}`}>{r.status}</span>
          </li>
        ))}
      </ul>
      <p className="border-t border-sheet-rule px-4 py-2.5 text-[0.6875rem] text-sheet-soft">4 factures lues ce mois-ci, 1 attend votre validation.</p>
    </Frame>
  );
}

export function DocumentSearch() {
  return (
    <Frame title="Documents" meta="25 documents">
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2.5 rounded-md border border-[#0F2229]/25 px-3 py-2.5 text-[0.8125rem]">
          <Search size={15} className="shrink-0 text-sheet-soft" />
          <span>la facture d'électricité de mars</span>
          <span className="ml-[-0.4rem] h-4 w-px animate-pulse bg-sheet-ink motion-reduce:animate-none" />
        </div>
      </div>
      <p className="px-4 pb-1 pt-3 text-[0.6875rem] text-sheet-soft">2 documents trouvés</p>
      <ul className="px-4 pb-4 text-[0.75rem]">
        {[
          { name: "Facture Énergie Plus, mars 2026", detail: "142,80 € · payée le 20 mars", tag: "Factures" },
          { name: "Contrat d'électricité, atelier", detail: "Signé le 12 janv. 2026", tag: "Contrats" },
        ].map((d) => (
          <li key={d.name} className="mt-2 flex items-center gap-3 rounded-md border border-sheet-rule px-3 py-2.5">
            <FileText size={16} className="shrink-0 text-sheet-soft" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{d.name}</p>
              <p className="text-[0.6875rem] text-sheet-soft">{d.detail}</p>
            </div>
            <span className="rounded bg-[#0F2229]/[0.06] px-2 py-0.5 text-[0.6875rem] text-sheet-soft">{d.tag}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function ReminderDraft() {
  return (
    <Frame title="Relance programmée" meta="Envoi prévu le 28 sept.">
      <div className="space-y-1.5 border-b border-sheet-rule px-4 py-3 text-[0.75rem]">
        <p><span className="text-sheet-soft">À </span><span className="font-bold">SCI Horizon</span></p>
        <p><span className="text-sheet-soft">Objet </span>Facture F-2026-0098 : règlement en attente</p>
      </div>
      <div className="space-y-2 px-4 py-3 text-[0.75rem] leading-relaxed">
        <p>Bonjour Madame Roux,</p>
        <p>
          Sauf erreur de notre part, la facture <span className="font-data">F-2026-0098</span> du 12 août, d'un montant de{" "}
          <span className="font-data font-bold">2 160,00 €</span>, reste à régler. Pourriez-vous nous indiquer la date prévue du paiement ?
        </p>
        <p>Bien cordialement,<br />Atelier Beaulieu</p>
      </div>
      <div className="flex items-center gap-2 border-t border-sheet-rule px-4 py-3">
        <span className="rounded-md bg-[#0F2229] px-3 py-1.5 text-[0.75rem] font-bold text-white">Envoyer maintenant</span>
        <span className="rounded-md border border-sheet-rule px-3 py-1.5 text-[0.75rem]">Modifier</span>
        <span className="ml-auto text-[0.6875rem] text-sheet-soft underline underline-offset-2">Couper l&apos;envoi</span>
      </div>
    </Frame>
  );
}

export function AccountingExport() {
  return (
    <Frame title="Export comptable" meta="Exercice 2026">
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="grid h-12 w-10 shrink-0 place-items-center rounded-sm border border-sheet-rule text-[0.5625rem] font-bold tracking-wider text-sheet-soft">FEC</div>
        <div className="min-w-0 flex-1 text-[0.75rem]">
          <p className="truncate font-bold">Fichier des écritures comptables</p>
          <p className="text-[0.6875rem] text-sheet-soft">Du 1er janvier au 30 septembre 2026</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#0F2229] px-3 py-1.5 text-[0.75rem] font-bold text-white">
          <Download size={13} /> Télécharger
        </span>
      </div>
      <dl className="grid grid-cols-3 border-t border-sheet-rule text-center text-[0.6875rem]">
        {[
          ["Achats", "214"],
          ["Ventes", "96"],
          ["Banque", "32"],
        ].map(([k, v]) => (
          <div key={k} className="border-r border-sheet-rule px-2 py-3 last:border-r-0">
            <dt className="text-sheet-soft">{k}</dt>
            <dd className="mt-0.5 font-data text-[0.875rem] font-bold">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-sheet-rule px-4 py-2.5 text-[0.6875rem] text-sheet-soft">342 écritures, au format lu par les logiciels de votre expert-comptable.</p>
    </Frame>
  );
}
