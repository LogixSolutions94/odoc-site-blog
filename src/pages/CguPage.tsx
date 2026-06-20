import { SEOHead } from "@/components/SEOHead";

export default function CguPage() {
  return (
    <div className="mx-auto max-w-3xl py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="CGU — OdocPilot | Conditions Générales d'Utilisation"
        description="Conditions générales d'utilisation de la plateforme OdocPilot."
        canonical="/cgu"
      />
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Conditions Générales d'Utilisation</h1>
      <div className="mt-8 space-y-8 text-muted-foreground leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-foreground">Article 1 — Objet</h2>
          <p className="mt-3">
            Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation de la plateforme SaaS OdocPilot, éditée par Logix Solutions SASU. OdocPilot est une solution de gestion administrative et de conformité pour les TPE, PME et indépendants : facturation électronique au format Factur-X (norme EN 16931), lecture et classement des documents par intelligence artificielle, et export comptable (FEC).
          </p>
          <p className="mt-2">
            L'utilisation de la plateforme implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Article 2 — Accès au service</h2>
          <p className="mt-3">
            L'accès à la plateforme OdocPilot nécessite la création d'un compte utilisateur. L'utilisateur s'engage à fournir des informations exactes et à jour lors de son inscription, et à maintenir la confidentialité de ses identifiants de connexion.
          </p>
          <p className="mt-2">
            L'utilisateur est seul responsable de toute activité effectuée depuis son compte. En cas de suspicion d'utilisation non autorisée, l'utilisateur doit en informer immédiatement OdocPilot à l'adresse contact@odocpilot.com.
          </p>
          <p className="mt-2">
            OdocPilot se réserve le droit de suspendre ou de résilier l'accès d'un utilisateur en cas de non-respect des présentes CGU, sans préavis ni indemnité.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Article 3 — Abonnements et facturation</h2>
          <p className="mt-3">
            OdocPilot propose plusieurs formules d'abonnement selon le plan tarifaire en vigueur, consultable sur la page <a href="/pricing" className="text-primary hover:underline">Tarifs</a> (à partir de 49 € HT/mois). Les prix peuvent évoluer ; seule la page Tarifs fait foi.
          </p>
          <p className="mt-2">
            Les abonnements sont <strong className="text-foreground">sans engagement</strong> : l'utilisateur peut résilier à tout moment depuis son espace client. En cas de paiement annuel, l'abonnement reste actif jusqu'à la fin de la période payée. Aucun remboursement n'est effectué pour la période en cours.
          </p>
          <p className="mt-2">
            Les factures sont émises au format conforme à la réglementation française et sont accessibles depuis l'espace client. Tout montant non réglé à échéance pourra entraîner la suspension du service après un délai de relance de 15 jours.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Article 4 — Données et confidentialité</h2>
          <p className="mt-3">
            Les données des utilisateurs sont hébergées au sein de l'Union Européenne, conformément au Règlement Général sur la Protection des Données (RGPD). Les documents et données traitées par OdocPilot sont chiffrés au repos et en transit.
          </p>
          <p className="mt-2">
            OdocPilot s'engage à ne jamais revendre, céder ou partager les données de ses utilisateurs à des tiers à des fins commerciales. Les données ne sont utilisées que dans le strict cadre de la fourniture du service.
          </p>
          <p className="mt-2">
            L'utilisateur peut à tout moment exporter l'intégralité de ses données (documents, métadonnées) aux formats PDF, CSV ou JSON depuis les paramètres de son compte. En cas de suppression de compte, les données sont supprimées sous 30 jours.
          </p>
          <p className="mt-2">
            Pour toute question relative à vos données personnelles : <strong className="text-foreground">privacy@odocpilot.com</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Article 5 — Limitation de responsabilité</h2>
          <p className="mt-3">
            OdocPilot met en œuvre tous les moyens raisonnables pour assurer la disponibilité et le bon fonctionnement de la plateforme. Toutefois, le service est fourni « en l'état » et OdocPilot ne garantit pas l'absence d'interruptions, d'erreurs ou de dysfonctionnements.
          </p>
          <p className="mt-2">
            En aucun cas Logix Solutions SASU ne pourra être tenue responsable des dommages indirects, pertes de bénéfices, pertes de données ou préjudices commerciaux résultant de l'utilisation ou de l'impossibilité d'utiliser la plateforme.
          </p>
          <p className="mt-2">
            La responsabilité totale de Logix Solutions SASU au titre des présentes CGU est limitée au montant des sommes effectivement versées par l'utilisateur au cours des 12 mois précédant l'événement à l'origine du dommage.
          </p>
          <p className="mt-2">
            Les présentes CGU sont soumises au droit français. Tout litige sera porté devant les tribunaux compétents d'Île-de-France.
          </p>
        </section>

        <p className="pt-4 text-sm text-muted-foreground/70 border-t border-border/40">
          Dernière mise à jour : mars 2026
        </p>
      </div>
    </div>
  );
}
