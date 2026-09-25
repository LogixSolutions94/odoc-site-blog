import { fr } from "@/lib/typo";

/**
 * Exemple de facture d'auto-entrepreneur en franchise de TVA, au format électronique.
 * Chaque mention qui compte est surlignée (le surligneur = ce qui a été préparé) et
 * numérotée ; la légende est rendue par la page, à partir de `specimenLegend`.
 * Entreprises, SIREN et montants fictifs (SIREN volontairement invalides).
 */
function Num({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="ml-1.5 inline-grid h-[1.1rem] w-[1.1rem] shrink-0 place-items-center rounded-full bg-[hsl(var(--sheet-ink))] align-middle font-data text-[0.625rem] font-bold not-italic text-[hsl(var(--sheet))]"
    >
      {n}
    </span>
  );
}

function Mark({ children, wrap = false }: { children: React.ReactNode; wrap?: boolean }) {
  return <span className={wrap ? "marker-inline" : "marker marker-static"}>{children}</span>;
}

export function MicroInvoiceSpecimen({ caption }: { caption: string }) {
  return (
    <figure>
      <div className="relative">
      <div aria-hidden="true" className="absolute inset-0 translate-x-2 translate-y-3 rotate-[2deg] rounded-[3px] bg-sheet shadow-sheet" />
      <div className="relative rounded-[3px] bg-sheet p-5 text-sheet-ink shadow-lift sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display text-[1.125rem] font-bold leading-tight">Marie Lambert</p>
            <p className="mt-0.5 text-[0.75rem] text-sheet-soft">Graphiste, entrepreneur individuel</p>
            <p className="mt-0.5 font-data text-[0.6875rem] text-sheet-soft">SIREN 901 234 568</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-[0.75rem] font-bold tracking-[0.2em] text-sheet-soft">FACTURE</p>
            <p className="mt-1 font-data text-[0.75rem]">N° 2026-018</p>
            <p className="mt-2 inline-flex items-center font-data text-[0.625rem] font-bold">
              <Mark>Factur-X · EN 16931</Mark>
              <Num n={5} />
            </p>
          </div>
        </div>

        <dl className="mt-5 grid gap-3 border-y border-sheet-rule py-3 text-[0.75rem] leading-snug sm:grid-cols-2">
          <div>
            <dt className="text-sheet-soft">Facturé à</dt>
            <dd className="font-bold">Studio Garnier SARL</dd>
            <dd className="font-data">
              <Mark>SIREN 812 345 671</Mark>
              <Num n={1} />
            </dd>
          </div>
          <div>
            <dt className="text-sheet-soft">{fr("Catégorie de l'opération")}</dt>
            <dd>
              <Mark>Prestation de services</Mark>
              <Num n={2} />
            </dd>
            <dd className="mt-1 font-data text-sheet-soft">Émise le 25/09/2026</dd>
          </div>
        </dl>

        <table className="mt-3 w-full text-[0.75rem]">
          <thead>
            <tr className="text-left text-sheet-soft">
              <th className="pb-1 font-normal">Désignation</th>
              <th className="pb-1 text-right font-normal">Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-sheet-rule">
              <td className="py-1.5 pr-2">{fr("Création d'une identité visuelle")}</td>
              <td className="py-1.5 text-right font-data">{fr("1 200,00 €")}</td>
            </tr>
            <tr className="border-t border-sheet-rule">
              <td className="py-1.5 pr-2">Déclinaison sur cartes de visite</td>
              <td className="py-1.5 text-right font-data">{fr("180,00 €")}</td>
            </tr>
          </tbody>
        </table>

        <div className="ml-auto mt-3 max-w-[16rem] text-[0.8125rem]">
          <div className="flex justify-between border-t border-sheet-ink/70 pt-1.5 font-bold">
            <span>Net à payer</span>
            <span className="font-data">{fr("1 380,00 €")}</span>
          </div>
          <p className="mt-1.5 text-right text-[0.6875rem]">
            <Mark wrap>TVA non applicable, art. 293 B du CGI</Mark>
            <Num n={3} />
          </p>
        </div>

        <p className="mt-5 text-[0.625rem] leading-snug text-sheet-soft">
          <Mark wrap>{fr("Paiement à 30 jours. Pénalités de retard : trois fois le taux d'intérêt légal. Indemnité forfaitaire pour frais de recouvrement : 40 €.")}</Mark>
          <Num n={4} />
        </p>
      </div>
      </div>
      <figcaption className="mt-5 text-[0.8125rem] text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}
