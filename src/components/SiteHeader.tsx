import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const LOGIN_URL = "https://app.odocpilot.com/auth";
const SIGNUP_URL = "https://app.odocpilot.com/auth";

const navLinks = [
  { href: "/fonctionnalites", label: "Fonctionnalités" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/blog", label: "Blog" },
  { href: "/e-facture", label: "E-Facture" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="mr-auto flex items-center shrink-0 sm:mr-8">
          <Logo size="sm" variant="full" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="font-medium text-text-muted transition-colors hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Login (Desktop) */}
          <a
            href={LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex text-sm font-medium text-text-muted hover:text-text transition-colors"
            data-umami-event="cta-connexion"
          >
            Connexion
          </a>

          {/* CTA Button (Desktop) */}
          <a
            href={SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex"
            data-umami-event="cta-essai-gratuit"
          >
            <Button
              size="sm"
              className="bg-gradient-to-r from-[hsl(30_100%_50%)] to-[hsl(30_90%_55%)] text-white font-semibold shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:shadow-[0_0_28px_rgba(249,115,22,0.5)] hover:scale-[1.03] transition-all duration-200"
            >
              Commencer gratuitement →
            </Button>
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-text-muted hover:text-text transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block text-sm font-medium text-text-muted hover:text-text transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-divider pt-3 mt-3 space-y-2">
            <a
              href={LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-medium text-text-muted hover:text-text transition-colors"
              onClick={() => setMobileOpen(false)}
              data-umami-event="cta-connexion"
            >
              Connexion
            </a>
            <a
              href={SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              data-umami-event="cta-essai-gratuit"
            >
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-[hsl(30_100%_50%)] to-[hsl(30_90%_55%)] text-white font-semibold hover:scale-[1.02] transition-all duration-200"
              >
                Commencer gratuitement →
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
