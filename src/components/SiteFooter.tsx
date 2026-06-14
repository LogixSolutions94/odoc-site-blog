import { Link } from "react-router-dom";
import { TrustCredentials } from "@/components/TrustCredentials";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-14 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4">Produit</h3>
            <ul className="space-y-2.5">
              <li><Link to="/fonctionnalites" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</Link></li>
              <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tarifs</Link></li>
              <li><Link to="/e-facture" className="text-sm text-muted-foreground hover:text-foreground transition-colors">E-facture 2026</Link></li>
              <li><Link to="/diagnostic" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Diagnostic conformité</Link></li>
              <li><Link to="/generateur-factur-x" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Générateur Factur-X</Link></li>
              <li><Link to="/verificateur" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Vérificateur de facture</Link></li>
              <li><Link to="/comparatif/pennylane" className="text-sm text-muted-foreground hover:text-foreground transition-colors">OdocPilot vs Pennylane</Link></li>
              <li><Link to="/comparatif/qonto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">OdocPilot vs Qonto</Link></li>
              <li><Link to="/roadmap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Roadmap</Link></li>
              <li><Link to="/changelog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4">Métiers</h3>
            <ul className="space-y-2.5">
              <li><Link to="/artisans" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Artisans &amp; BTP</Link></li>
              <li><Link to="/commerce" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Commerce &amp; Services</Link></li>
              <li><Link to="/professions-liberales" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Professions libérales</Link></li>
              <li><Link to="/cabinets-comptables" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cabinets comptables</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4">Entreprise</h3>
            <ul className="space-y-2.5">
              <li><Link to="/a-propos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">À propos</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/recrutement" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Recrutement</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4">Ressources</h3>
            <ul className="space-y-2.5">
              <li><a href="https://docs.odocpilot.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="https://docs.odocpilot.com/api" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API</a></li>
              <li><a href="https://status.odocpilot.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Statut</a></li>
              <li><Link to="/llm-info" className="text-sm text-muted-foreground hover:text-foreground transition-colors">OdocPilot en bref</Link></li>
              <li><Link to="/livre-blanc" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Livre blanc 2026/2027</Link></li>
              <li><Link to="/lexique" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Lexique e-facture</Link></li>
              <li><Link to="/guide/facturation-electronique-2026" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Guide e-facture 2026</Link></li>
              <li><Link to="/guide/obligations-2026-2027" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Obligations &amp; calendrier</Link></li>
              <li><Link to="/guide/factur-x" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Le format Factur-X</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4">Légal</h3>
            <ul className="space-y-2.5">
              <li><Link to="/mentions-legales" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Mentions légales</Link></li>
              <li><Link to="/cgu" className="text-sm text-muted-foreground hover:text-foreground transition-colors">CGU</Link></li>
              <li><Link to="/politique-confidentialite" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Politique de confidentialité</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <TrustCredentials />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} OdocPilot. Tous droits réservés. 🇫🇷 Fait en France · Données hébergées en France.
          </p>
        </div>
      </div>
    </footer>
  );
}
