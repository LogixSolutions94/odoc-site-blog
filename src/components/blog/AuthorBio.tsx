interface AuthorBioProps {
  name: string;
  avatarUrl?: string | null;
  /** Une à deux phrases d'expertise. Défaut honnête, sans faux credential. */
  bio?: string;
}

const DEFAULT_BIO =
  "Chez OdocPilot, on suit la réforme de la facturation électronique de près pour la traduire en actions concrètes pour les TPE/PME — clair, daté, sans survente.";

/** Bloc auteur E-E-A-T en pied d'article. Crédite la source réelle (jamais un persona inventé). */
export function AuthorBio({ name, avatarUrl, bio = DEFAULT_BIO }: AuthorBioProps) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mt-12 flex items-start gap-4 rounded-xl border border-border bg-secondary/50 p-6">
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="h-12 w-12 shrink-0 rounded-full object-cover" loading="lazy" />
      ) : (
        <span
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
        >
          {initials}
        </span>
      )}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rédigé par</p>
        <p className="font-bold text-foreground">{name}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{bio}</p>
      </div>
    </div>
  );
}
