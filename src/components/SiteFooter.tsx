import { Link } from "react-router-dom";
import { TrustCredentials } from "@/components/TrustCredentials";
import { Logo } from "@/components/Logo";

// Footer allégé (07/2026) : ~30 liens → l'essentiel uniquement.
// Sortis du footer : liens morts (docs/status.odocpilot.com), pages secondaires
// (roadmap, changelog, recrutement, comparatifs, guides…) — elles restent
// accessibles depuis les contenus et le sitemap. Légal = ligne inline en bas.

const COLUMNS: Array<{ title: string; links: Array<{ to: string; label: string }> }> = [
  {
    title: "Produit",
    links: [
      { to: "/fonctionnalites", label: "Fonctionnalités" },
      { to: "/pricing", label: "Tarifs" },
      { to: "/e-facture", label: "E-facture 2026" },
      { to: "/diagnostic", label: "Diagnostic conformité" },
    ],
  },
  {
    title: "Outils gratuits",
    links: [
      { to: "/generateur-factur-x", label: "Générateur Factur-X" },
      { to: "/verificateur", label: "Vérificateur de facture" },
      { to: "/lexique", label: "Lexique e-facture" },
    ],
  },
  {
    title: "Métiers",
    links: [
      { to: "/artisans", label: "Artisans & BTP" },
      { to: "/commerce", label: "Commerce & Services" },
      { to: "/professions-liberales", label: "Professions libérales" },
      { to: "/cabinets-comptables", label: "Cabinets comptables" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { to: "/a-propos", label: "À propos" },
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
    <footer className="border-t border-border py-14 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
          <div>
            <Logo size="md" variant="full" />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              L'IA prépare votre administratif, vous validez en un clic. Copilote IA français de facturation et de conformité, hébergé en France.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-bold text-foreground mb-4">{col.title}</h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <TrustCredentials />
          <div className="mt-6 flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} OdocPilot. 🇫🇷 Fait et hébergé en France.</p>
            <nav aria-label="Liens légaux" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <Link key={link.to} to={link.to} className="hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem("odoc_cookie_consent");
                    window.dispatchEvent(new CustomEvent("odoc:cookie-consent-reset"));
                  } catch { /* ignore */ }
                }}
                className="hover:text-foreground transition-colors"
              >
                Gérer mes cookies
              </button>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
