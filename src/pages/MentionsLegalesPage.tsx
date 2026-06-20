import { SEOHead } from "@/components/SEOHead";

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Mentions Légales — OdocPilot | Logix Solutions SASU"
        description="Mentions légales d'OdocPilot : éditeur, hébergeur, propriété intellectuelle. Site édité par Logix Solutions SASU, 89-91 Av. de la République, 75011 Paris."
        canonical="/mentions-legales"
      />
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Mentions Légales</h1>
      <div className="mt-8 space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground">Éditeur du site</h2>
          <div className="mt-3 space-y-1">
            <p><strong className="text-foreground">Raison sociale :</strong> Logix Solutions SASU</p>
            <p><strong className="text-foreground">Noms commerciaux :</strong> OdocPilot, OdocPilot — marques appartenant à Logix Solutions SASU</p>
            <p><strong className="text-foreground">Siège social :</strong> 89-91 Avenue de la République, 75011 Paris, France</p>
            <p><strong className="text-foreground">Email :</strong> contact@odocpilot.com</p>
            <p><strong className="text-foreground">Directeur de la publication :</strong> Lucas Belloc</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Hébergeur</h2>
          <div className="mt-3 space-y-1">
            <p><strong className="text-foreground">Raison sociale :</strong> OVH SAS</p>
            <p><strong className="text-foreground">Adresse :</strong> 2 rue Kellermann, 59100 Roubaix, France</p>
            <p><strong className="text-foreground">Téléphone :</strong> 1007</p>
            <p><strong className="text-foreground">Site web :</strong> www.ovhcloud.com</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Propriété intellectuelle</h2>
          <p className="mt-3">
            L'ensemble des contenus présents sur le site OdocPilot (textes, images, logos, graphismes, icônes, logiciels, base de données) sont la propriété exclusive de Logix Solutions SASU ou de ses partenaires et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de Logix Solutions SASU.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Données personnelles</h2>
          <p className="mt-3">
            Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez d'un droit d'accès, de rectification, de suppression, de limitation du traitement, de portabilité et d'opposition concernant vos données personnelles.
          </p>
          <p className="mt-2">
            Pour exercer ces droits ou pour toute question relative au traitement de vos données, vous pouvez nous contacter à l'adresse : <strong className="text-foreground">privacy@odocpilot.com</strong>.
          </p>
          <p className="mt-2">
            Vos données personnelles sont collectées uniquement dans le cadre de l'utilisation de nos services et ne sont en aucun cas cédées, vendues ou louées à des tiers à des fins commerciales.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Cookies</h2>
          <p className="mt-3">
            Ce site utilise uniquement des cookies fonctionnels strictement nécessaires au bon fonctionnement de la plateforme. Aucun cookie publicitaire ou de suivi tiers n'est déposé. Conformément à la directive européenne 2009/136/CE, ces cookies fonctionnels ne requièrent pas de consentement préalable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Limitation de responsabilité</h2>
          <p className="mt-3">
            Logix Solutions SASU s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, elle ne saurait être tenue responsable des erreurs, omissions ou résultats obtenus suite à l'utilisation de ces informations. L'utilisateur est seul responsable de l'utilisation qu'il fait des contenus du site.
          </p>
        </section>
      </div>
    </div>
  );
}
