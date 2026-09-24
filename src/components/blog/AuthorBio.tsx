import { Link } from "react-router-dom";
import { fr } from "@/lib/typo";

interface AuthorBioProps {
  name: string;
  /** Photo réelle fournie par la base, seulement. Jamais de portrait ni d'initiales inventés. */
  avatarUrl?: string | null;
  /** Une à deux phrases. Défaut honnête, sans faux titre ni fausse expertise. */
  bio?: string;
}

const DEFAULT_BIO =
  "Le blog d'OdocPilot explique la facture électronique aux dirigeants de TPE, aux indépendants et aux auto-entrepreneurs. Éditeur : M. Brahimi R., fondateur d'OdocPilot.";

/** Bloc auteur (E-E-A-T) en pied d'article : sobre, crédite la source réelle. */
export function AuthorBio({ name, avatarUrl, bio = DEFAULT_BIO }: AuthorBioProps) {
  return (
    <div className="flex items-start gap-4">
      {avatarUrl && (
        <img src={avatarUrl} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" loading="lazy" decoding="async" />
      )}
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">Écrit par</p>
        <p className="font-display text-lg font-bold leading-snug">{name}</p>
        <p className="mt-2 max-w-[60ch] text-[0.9375rem] leading-relaxed text-muted-foreground">{fr(bio)}</p>
        <p className="mt-2 text-[0.9375rem] text-muted-foreground">
          {fr("Une erreur, une question sur cet article ? ")}
          <Link to="/contact" className="text-foreground link-underline">
            Écrivez-nous
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
