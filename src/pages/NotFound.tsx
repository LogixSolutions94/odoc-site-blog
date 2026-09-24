import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { fr } from "@/lib/typo";

const SUGGESTIONS = [
  {
    to: "/e-facture",
    title: "La facture électronique, expliquée",
    text: "Le calendrier 2026-2027, les formats et ce qui change pour vous.",
  },
  {
    to: "/diagnostic",
    title: "Suis-je concerné ?",
    text: "Un diagnostic en 3 minutes, sans créer de compte.",
  },
  {
    to: "/blog",
    title: "Le blog",
    text: "Nos articles sur la facturation des petites entreprises.",
  },
];

const NotFound = () => {
  const { pathname } = useLocation();

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
      {/* Page d'erreur : pas de canonical ni de données structurées, et noindex. */}
      <SEOHead
        title="Page introuvable | OdocPilot"
        description="Cette page n'existe pas ou a été déplacée. Retrouvez le guide de la facture électronique, le diagnostic gratuit et le blog d'OdocPilot."
        noindex
      />

      <div className="max-w-3xl">
        <p className="font-data text-[0.875rem] text-muted-foreground">Erreur 404</p>
        <h1 className="mt-4 font-display display-tight text-[clamp(2.4rem,5.2vw,4.25rem)] font-bold leading-[1.02]">
          Cette page n'existe pas.
        </h1>
        <p className="mt-6 max-w-[36rem] text-[1.1875rem] leading-relaxed text-muted-foreground">
          L'adresse <span className="break-all font-data text-foreground">{pathname}</span> ne mène à aucune page. Le lien est
          peut-être ancien, ou l'adresse contient une faute de frappe.
        </p>
        <div className="mt-9">
          <Link to="/" className="btn-ink">
            Retour à l'accueil <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <nav aria-labelledby="suggestions-titre" className="mt-16 max-w-3xl sm:mt-20">
        <h2 id="suggestions-titre" className="font-display text-xl font-bold">
          Vous cherchiez peut-être
        </h2>
        <ul className="mt-5 border-t border-foreground/80">
          {SUGGESTIONS.map((s) => (
            <li key={s.to} className="border-b border-border">
              <Link to={s.to} className="group flex items-start justify-between gap-6 py-5">
                <span>
                  <span className="block font-bold">{fr(s.title)}</span>
                  <span className="mt-1 block leading-relaxed text-muted-foreground">{fr(s.text)}</span>
                </span>
                <ArrowRight
                  size={18}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="mt-1 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default NotFound;
