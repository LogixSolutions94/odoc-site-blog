import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CONTACT_EMAIL, PUBLISHER } from "@/lib/marketing";
import { fr } from "@/lib/typo";

// L'essentiel seulement (cf. mémoire « design minimalisme ») : pas de lien mort,
// pas de page secondaire. Les autres pages restent accessibles par les contenus et le sitemap.
const COLUMNS: Array<{ title: string; links: Array<{ to: string; label: string }> }> = [
  {
    title: "Produit",
    links: [
      { to: "/fonctionnalites", label: "Fonctionnalités" },
      { to: "/pricing", label: "Tarifs" },
      { to: "/e-facture", label: "Facture électronique" },
      { to: "/diagnostic", label: "Diagnostic en 3 minutes" },
    ],
  },
  {
    title: "Métiers",
    links: [
      { to: "/auto-entrepreneurs", label: "Auto-entrepreneurs" },
      { to: "/artisans", label: "Artisans et BTP" },
      { to: "/commerce", label: "Commerces et services" },
      { to: "/professions-liberales", label: "Professions libérales" },
      { to: "/cabinets-comptables", label: "Cabinets comptables" },
    ],
  },
  {
    title: "Outils gratuits",
    links: [
      { to: "/generateur-factur-x", label: "Générateur Factur-X" },
      { to: "/verificateur", label: "Vérificateur de facture" },
      { to: "/lexique", label: "Lexique de la facture électronique" },
    ],
  },
  {
    title: "OdocPilot",
    links: [
      { to: "/a-propos", label: "À propos" },
      { to: "/editeurs", label: "Offre éditeurs" },
      { to: "/blog", label: "Blog" },
      { to: "/contact", label: "Contact" },
    ],
  },
];

const LEGAL_LINKS = [
  { to: "/mentions-legales", label: "Mentions légales" },
  { to: "/cgu", label: "CGU" },
  { to: "/politique-confidentialite", label: "Confidentialité" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-14 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,19rem)_1fr] lg:gap-20">
          <div>
            <Logo size="md" />
            <p className="mt-5 max-w-[17rem] leading-relaxed text-muted-foreground">{fr("L'IA prépare vos factures et vos documents. Vous décidez.")}</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 inline-block font-data text-[0.9375rem] link-underline">
              {CONTACT_EMAIL}
            </a>
          </div>
          <nav aria-label="Plan du site" className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h2 className="font-display text-[1rem] font-bold">{col.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="text-[0.9375rem] text-muted-foreground transition-colors duration-200 hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-border pt-6 text-[0.875rem] text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[40rem] leading-relaxed">
            {fr(`OdocPilot est conçu et développé à ${PUBLISHER.city} par ${PUBLISHER.name}`)}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="transition-colors duration-200 hover:text-foreground">
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem("odoc_cookie_consent");
                } catch {
                  /* stockage indisponible : le bandeau se rouvre quand même */
                }
                window.dispatchEvent(new CustomEvent("odoc:cookie-consent-reset"));
              }}
              className="transition-colors duration-200 hover:text-foreground"
            >
              Gérer mes cookies
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
