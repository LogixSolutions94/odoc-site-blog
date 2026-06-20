import { SEOHead } from "@/components/SEOHead";
import { MotionDiv } from "@/components/MotionDiv";

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Politique de confidentialité — OdocPilot"
        description="Politique de confidentialité d'OdocPilot. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles conformément au RGPD."
        canonical="/politique-confidentialite"
      />

      <MotionDiv>
        <h1 className="text-4xl font-bold tracking-tight">Politique de confidentialité</h1>
        <p className="mt-4 text-sm text-muted-foreground">Dernière mise à jour : 29 mars 2026</p>
      </MotionDiv>

      <div className="mt-12 space-y-10 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">1. Responsable du traitement</h2>
          <p>
            Logix Solutions SASU, éditrice de la plateforme OdocPilot<br />
            Siège social : Le Plessis-Trévise, France<br />
            Contact : <a href="mailto:privacy@odocpilot.com" className="text-primary hover:underline">privacy@odocpilot.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">2. Données collectées</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Données d'inscription :</strong> nom, prénom, adresse email professionnelle, nom de l'entreprise, mot de passe (chiffré).</li>
            <li><strong className="text-foreground">Documents uploadés :</strong> fichiers déposés par l'utilisateur (factures, contrats, etc.) traités par nos algorithmes d'IA.</li>
            <li><strong className="text-foreground">Données de facturation :</strong> informations de paiement traitées par notre prestataire Stripe. Nous ne stockons aucun numéro de carte bancaire.</li>
            <li><strong className="text-foreground">Données de navigation :</strong> adresse IP, type de navigateur, pages visitées, durée de session (cookies analytiques avec consentement uniquement).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">3. Finalités du traitement</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Fourniture du service :</strong> création et gestion de votre compte, traitement de vos documents, exécution des fonctionnalités de la plateforme.</li>
            <li><strong className="text-foreground">Amélioration du produit :</strong> analyse agrégée et anonymisée de l'utilisation pour améliorer nos algorithmes et l'expérience utilisateur.</li>
            <li><strong className="text-foreground">Communications commerciales :</strong> envoi de newsletters et informations sur les nouveautés OdocPilot, uniquement avec votre consentement explicite.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Base légale</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Exécution du contrat :</strong> traitement nécessaire à la fourniture du service OdocPilot.</li>
            <li><strong className="text-foreground">Intérêt légitime :</strong> amélioration du produit, sécurité de la plateforme, prévention de la fraude.</li>
            <li><strong className="text-foreground">Consentement :</strong> communications commerciales, cookies analytiques.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">5. Durée de conservation</h2>
          <p>
            Vos données personnelles sont conservées pendant toute la durée de votre contrat, puis pendant une période de 3 ans après la fin du contrat, conformément aux obligations légales françaises. Les documents uploadés sont supprimés dans un délai de 30 jours après la clôture de votre compte, sauf obligation légale de conservation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">6. Droits des utilisateurs</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong className="text-foreground">Droit d'accès :</strong> obtenir la confirmation que vos données sont traitées et en obtenir une copie.</li>
            <li><strong className="text-foreground">Droit de rectification :</strong> faire corriger vos données inexactes ou incomplètes.</li>
            <li><strong className="text-foreground">Droit à l'effacement :</strong> demander la suppression de vos données dans les conditions prévues par la loi.</li>
            <li><strong className="text-foreground">Droit à la portabilité :</strong> recevoir vos données dans un format structuré et couramment utilisé.</li>
            <li><strong className="text-foreground">Droit d'opposition :</strong> vous opposer au traitement de vos données pour des motifs légitimes.</li>
          </ul>
          <p className="mt-3">
            Pour exercer vos droits, contactez-nous à : <a href="mailto:privacy@odocpilot.com" className="text-primary hover:underline">privacy@odocpilot.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">7. Sous-traitants</h2>
          <p>Nous faisons appel aux sous-traitants suivants pour la fourniture de notre service :</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong className="text-foreground">Supabase (backend) :</strong> hébergement des données et authentification — serveurs en Europe.</li>
            <li><strong className="text-foreground">Resend :</strong> envoi d'emails transactionnels.</li>
            <li><strong className="text-foreground">Stripe :</strong> traitement des paiements (certifié PCI-DSS).</li>
            <li><strong className="text-foreground">Google / Dropbox :</strong> synchronisation de fichiers (uniquement si activée par l'utilisateur).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">8. Cookies</h2>
          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Cookies strictement nécessaires</h3>
          <p>Ces cookies sont indispensables au fonctionnement du site (authentification, sécurité, préférences de session). Ils ne peuvent pas être désactivés.</p>
          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Cookies analytiques</h3>
          <p>Avec votre consentement, nous utilisons des cookies analytiques pour mesurer l'audience du site et améliorer nos services. Vous pouvez retirer votre consentement à tout moment via le bandeau cookies ou en nous contactant.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">9. Contact</h2>
          <p>
            Pour toute question relative à la protection de vos données personnelles, vous pouvez nous contacter à :<br />
            <a href="mailto:privacy@odocpilot.com" className="text-primary hover:underline">privacy@odocpilot.com</a>
          </p>
          <p className="mt-3">
            Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a>
          </p>
        </section>
      </div>
    </div>
  );
}
