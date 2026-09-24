import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { fr } from "@/lib/typo";

/**
 * Une ligne de faits vérifiables, à la place de l'ancien mur de badges.
 * Chaque fait est détaillé ailleurs sur le site (FAQ, page À propos), et nos
 * limites sont écrites sur /a-propos#limites. Aucune certification ni aucun
 * label n'est revendiqué ici : nous n'en avons pas.
 * Export et props inchangés, plusieurs pages l'importent.
 */
const FACTS = [
  "Données stockées en France, chez OVHcloud",
  "IA : Mistral AI, entreprise française",
  "Factures au format Factur-X (EN 16931)",
];

export function TrustCredentials({ className = "" }: { className?: string }) {
  return (
    <ul
      aria-label="OdocPilot en bref"
      className={cn(
        "flex flex-wrap items-baseline justify-center gap-x-6 gap-y-2 text-center text-[0.875rem] leading-snug text-muted-foreground",
        className,
      )}
    >
      {FACTS.map((fact) => (
        <li key={fact}>{fr(fact)}</li>
      ))}
      <li>
        <Link to="/a-propos#limites" className="text-foreground link-underline">
          Ce que nous ne faisons pas encore
        </Link>
      </li>
    </ul>
  );
}

export default TrustCredentials;
