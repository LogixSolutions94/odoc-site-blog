import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { LOGIN_URL, SIGNUP_URL } from "@/lib/marketing";

const NAV = [
  { href: "/#produit", label: "Produit" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/e-facture", label: "Facture électronique" },
  { href: "/editeurs", label: "Éditeurs" },
  { href: "/blog", label: "Blog" },
];

function NavItem({ href, label, className, onClick }: { href: string; label: string; className: string; onClick?: () => void }) {
  // Les ancres de l'accueil passent par <a> (le routeur ne gère pas le défilement vers #id).
  if (href.includes("#")) {
    return <a href={href} className={className} onClick={onClick}>{label}</a>;
  }
  return <Link to={href} className={className} onClick={onClick}>{label}</Link>;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background">
        Aller au contenu
      </a>
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-10 px-5 sm:px-8">
        <Link to="/" aria-label="OdocPilot, retour à l'accueil" className="shrink-0">
          <Logo size="md" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              className="text-[0.9375rem] text-muted-foreground transition-colors duration-200 hover:text-foreground"
            />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <a href={LOGIN_URL} className="hidden text-[0.9375rem] text-muted-foreground transition-colors duration-200 hover:text-foreground sm:inline" data-umami-event="header-login">
            Connexion
          </a>
          <a href={SIGNUP_URL} className="btn-ink btn-ink-sm hidden sm:inline-flex" data-umami-event="header-trial">
            Commencer gratuitement
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen(!open)}
            className="-mr-2 grid h-11 w-11 place-items-center rounded-md text-foreground lg:hidden"
          >
            {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label="Navigation mobile" className="border-t border-border bg-background px-5 pb-6 pt-2 lg:hidden">
          <ul>
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-border">
                <NavItem {...item} onClick={() => setOpen(false)} className="block py-3.5 font-display text-xl font-semibold" />
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3">
            <a href={SIGNUP_URL} className="btn-ink w-full" data-umami-event="mobile-trial">Commencer gratuitement</a>
            <a href={LOGIN_URL} className="py-2 text-center text-muted-foreground" data-umami-event="mobile-login">Connexion</a>
          </div>
        </nav>
      )}
    </header>
  );
}
