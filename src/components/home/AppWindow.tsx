/**
 * Vue d'ensemble de l'application, redessinée d'après les vrais écrans
 * d'app.odocpilot.com (barre latérale, libellés, statuts, couleurs crème et
 * ambre du produit), avec l'entreprise fictive de démonstration « Atelier Beaulieu ».
 * Illustration non interactive : aria-hidden, rien n'est cliquable.
 */

const NAV = [
  { label: "Copilote" },
  { label: "Factures", badge: "3", active: true },
  { label: "Achats" },
  { label: "Trésorerie" },
  { label: "Documents", badge: "2" },
  { label: "Pilotage" },
  { label: "Équipe" },
];

const KPIS = [
  { value: "2", label: "factures en retard", hint: "Relances programmées", tone: "bg-[#FBE7E4] border-[#F2C9C2]" },
  { value: "3", label: "factures à valider", hint: "Déposées cette semaine", tone: "bg-[#FFFDF9] border-[#E8DFD0]" },
  { value: "12 480 €", label: "à encaisser", hint: "D'ici fin octobre", tone: "bg-[#FFFDF9] border-[#E8DFD0]" },
];

const ROWS = [
  { name: "Plâtrerie Morel", kind: "Fournisseur", due: "16/10/2026", amount: "1 248,00 €", status: "À valider", tone: "bg-[#FDECD8] text-[#8A4B0B]" },
  { name: "Garnier Rénovation", kind: "Client", due: "24/10/2026", amount: "4 920,00 €", status: "Envoyée", tone: "bg-[#E4EEF1] text-[#0E5870]" },
  { name: "SCI Horizon", kind: "Client", due: "12/09/2026", amount: "2 160,00 €", status: "En retard", tone: "bg-[#FBE7E4] text-[#A12A1D]" },
  { name: "Location Martin", kind: "Fournisseur", due: "03/10/2026", amount: "330,00 €", status: "Approuvée", tone: "bg-[#E6F2EA] text-[#1F6B3A]" },
  { name: "Bois & Fixations Robert", kind: "Fournisseur", due: "22/10/2026", amount: "583,80 €", status: "Payée", tone: "bg-[#EFEAE1] text-[#5B5146]" },
];

export function AppWindow() {
  return (
    <div aria-hidden="true" className="select-none overflow-hidden rounded-lg border border-[#E2D8C8] bg-[#F5EFE5] text-[#2A211A] shadow-lift">
      {/* Barre du navigateur */}
      <div className="flex items-center gap-3 border-b border-[#E2D8C8] bg-[#EFE7DA] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#D9CDBB]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#D9CDBB]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#D9CDBB]" />
        </div>
        <p className="mx-auto rounded bg-[#F8F3EA] px-3 py-0.5 font-data text-[0.6875rem] text-[#7A6D5E]">app.odocpilot.com/factures</p>
      </div>

      <div className="flex min-h-[23rem]">
        {/* Barre latérale */}
        <aside className="hidden w-44 shrink-0 border-r border-[#E2D8C8] px-3 py-4 md:block">
          <div className="flex items-center gap-2 px-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-[#F97316]">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-white" />
            </span>
            <span className="text-[0.8125rem] font-bold">OdocPilot</span>
          </div>
          <p className="mt-4 rounded-md bg-[#A6560F] px-3 py-1.5 text-center text-[0.75rem] font-bold text-white">+ Déposer</p>
          <ul className="mt-4 space-y-0.5 text-[0.75rem]">
            {NAV.map((n) => (
              <li key={n.label} className={`flex items-center justify-between rounded-md px-2.5 py-1.5 ${n.active ? "bg-[#F3E2CF] font-bold" : "text-[#5B5146]"}`}>
                {n.label}
                {n.badge && <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[#C2410C] px-1 text-[0.5625rem] font-bold text-white">{n.badge}</span>}
              </li>
            ))}
          </ul>
          <p className="mt-6 px-2 text-[0.6875rem] text-[#7A6D5E]">Atelier Beaulieu</p>
        </aside>

        {/* Contenu */}
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <p className="text-[0.875rem] font-bold">
            Factures <span className="font-normal text-[#7A6D5E]">· clients et fournisseurs</span>
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {KPIS.map((k) => (
              <div key={k.label} className={`rounded-md border px-2.5 py-2 ${k.tone}`}>
                <p className="font-data text-[0.9375rem] font-bold leading-tight sm:text-[1.0625rem]">{k.value}</p>
                <p className="mt-0.5 text-[0.625rem] leading-tight text-[#5B5146] sm:text-[0.6875rem]">{k.label}</p>
                <p className="mt-1 hidden text-[0.5625rem] text-[#8C7F70] sm:block">{k.hint}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 overflow-hidden rounded-md border border-[#E8DFD0] bg-[#FFFDF9]">
            <div className="hidden grid-cols-[minmax(0,1.6fr)_0.9fr_0.9fr_0.9fr] gap-3 border-b border-[#EFE7DA] px-3 py-2 text-[0.5625rem] font-bold uppercase tracking-wide text-[#8C7F70] sm:grid">
              <span>Contrepartie</span>
              <span>Échéance</span>
              <span className="text-right">Montant TTC</span>
              <span className="text-right">Statut</span>
            </div>
            <ul className="text-[0.6875rem]">
              {ROWS.map((r) => (
                <li key={r.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-[#F3ECE1] px-3 py-2 last:border-b-0 sm:grid-cols-[minmax(0,1.6fr)_0.9fr_0.9fr_0.9fr]">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{r.name}</p>
                    <p className="text-[0.5625rem] text-[#8C7F70]">{r.kind}</p>
                  </div>
                  <p className="hidden font-data text-[#5B5146] sm:block">{r.due}</p>
                  <p className="hidden text-right font-data sm:block">{r.amount}</p>
                  <p className="text-right">
                    <span className={`inline-block rounded px-1.5 py-0.5 text-[0.5625rem] font-bold ${r.tone}`}>{r.status}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
