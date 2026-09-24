import { SEOHead } from "@/components/SEOHead";

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Mentions légales | OdocPilot"
        description="Mentions légales du site odocpilot.com : identification de l'éditeur (entreprise individuelle, SIREN 842 920 084), hébergeur, propriété intellectuelle et données personnelles."
        canonical="/mentions-legales"
      />
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Mentions légales</h1>
      <div className="mt-8 space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <p>
            En application de l'article 6, III, de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, les informations suivantes sont portées à la connaissance des utilisateurs du site accessible à l'adresse odocpilot.com.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Éditeur du site</h2>
          <div className="mt-3 space-y-1">
            <p><strong className="text-foreground">Éditeur :</strong> Monsieur Riad Brahimi</p>
            <p><strong className="text-foreground">Forme juridique :</strong> entreprise individuelle, exerçant sous le régime de la micro-entreprise</p>
            <p><strong className="text-foreground">Noms commerciaux et marques exploités :</strong> Logix Solutions, OdocPilot, Odoc</p>
            <p><strong className="text-foreground">Adresse de l'établissement :</strong> 89-91 Avenue de la République, 75011 Paris, France</p>
            <p><strong className="text-foreground">SIREN :</strong> 842 920 084</p>
            <p><strong className="text-foreground">SIRET (établissement principal) :</strong> 842 920 084 00022</p>
            <p><strong className="text-foreground">Immatriculation :</strong> registre national des entreprises, tenu par l'Institut national de la propriété industrielle</p>
            <p><strong className="text-foreground">Téléphone :</strong> +33 6 10 02 04 76</p>
            <p><strong className="text-foreground">Adresse électronique :</strong> contact@odocpilot.com</p>
            <p><strong className="text-foreground">Directeur de la publication :</strong> M. Brahimi R.</p>
          </div>
          <p className="mt-3">
            L'éditeur exerce une activité libérale non réglementée de programmation informatique. À ce titre, il est immatriculé au registre national des entreprises et n'entre pas dans le champ de l'obligation d'immatriculation au registre du commerce et des sociétés, réservée aux commerçants et aux sociétés.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Hébergeur</h2>
          <p className="mt-3">Le site est hébergé par :</p>
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
            L'ensemble des éléments composant le site, notamment les textes, images, logos, graphismes, icônes, logiciels et bases de données, constitue la propriété exclusive de Monsieur Riad Brahimi ou de ses partenaires, et se trouve protégé par les dispositions du code de la propriété intellectuelle ainsi que par les conventions internationales applicables. Les dénominations Logix Solutions, OdocPilot et Odoc appartiennent à Monsieur Riad Brahimi.
          </p>
          <p className="mt-2">
            Toute reproduction, représentation, modification, publication, extraction ou adaptation de tout ou partie de ces éléments, quel que soit le moyen ou le procédé employé, est interdite sans l'autorisation écrite et préalable de Monsieur Riad Brahimi. Une utilisation non autorisée est susceptible d'engager la responsabilité de son auteur sur le fondement de la contrefaçon.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Données personnelles</h2>
          <p className="mt-3">
            Conformément au règlement (UE) 2016/679 du 27 avril 2016 relatif à la protection des données à caractère personnel et à la loi n° 78-17 du 6 janvier 1978 modifiée, l'utilisateur dispose d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, de portabilité et d'opposition sur les données le concernant.
          </p>
          <p className="mt-2">
            Ces droits s'exercent, ainsi que toute demande relative au traitement des données, auprès de l'éditeur à l'adresse suivante : <strong className="text-foreground">privacy@odocpilot.com</strong>. L'utilisateur dispose également du droit d'introduire une réclamation auprès de la Commission nationale de l'informatique et des libertés.
          </p>
          <p className="mt-2">
            Les données à caractère personnel sont collectées pour les seuls besoins de la fourniture des services proposés sur le site. Elles ne font l'objet d'aucune cession, vente ou location à des tiers à des fins commerciales.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Cookies</h2>
          <p className="mt-3">
            Le site n'a recours qu'à des cookies fonctionnels strictement nécessaires à la fourniture du service expressément demandé par l'utilisateur. Aucun cookie publicitaire ni traceur tiers de mesure d'audience n'est déposé. En application de l'article 82 de la loi n° 78-17 du 6 janvier 1978 modifiée, ces cookies sont dispensés du recueil préalable du consentement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Limitation de responsabilité</h2>
          <p className="mt-3">
            L'éditeur apporte le plus grand soin à l'exactitude et à l'actualisation des informations diffusées sur le site. Il ne saurait toutefois être tenu pour responsable des erreurs ou omissions qu'elles pourraient comporter, ni des résultats obtenus par l'utilisateur à la suite de leur exploitation. L'utilisateur demeure seul responsable de l'usage qu'il fait des contenus mis à sa disposition.
          </p>
        </section>
      </div>
    </div>
  );
}
