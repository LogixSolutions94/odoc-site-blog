import { ShieldCheck, Scale, Leaf, BadgeCheck, MapPin, Cpu, Lock } from "lucide-react";

/**
 * Bandeau de labels / engagements de confiance OdocPilot.
 * Réutilisable (Home, /e-facture, /pricing). Tokens uniquement, pas de couleur hardcodée.
 * ⚠️ N'afficher que des certifications réellement détenues et valides.
 */
const CREDENTIALS = [
  { icon: BadgeCheck, label: "Numérique Responsable" },
  { icon: Leaf, label: "IA frugale" },
  { icon: ShieldCheck, label: "Conforme RGPD" },
  { icon: Scale, label: "Aligné AI Act" },
  { icon: MapPin, label: "Hébergé en France" },
  { icon: Cpu, label: "IA Mistral · France" },
  { icon: Lock, label: "Sécurité maximale" },
];

export function TrustCredentials({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center justify-center gap-2.5 ${className}`}>
      {CREDENTIALS.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-card"
        >
          <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}

export default TrustCredentials;
