/**
 * Lexique de la facturation électronique (page /lexique).
 * Une définition courte par terme (cible DefinedTerm et extraits de réponse), puis une précision.
 * Faits alignés sur src/content/guides.ts et sur impots.gouv.fr, état au 24/09/2026.
 * Lu aussi par le prérendu (scripts/lib/marketing-pages.ts) : ne changer ni les clés, ni les
 * slugs (ancres publiques /lexique#slug), ni la forme des objets.
 */
export interface GlossaryTerm {
  /** Terme affiché. */
  term: string;
  /** Sigle ou forme développée, affiché à côté du terme. */
  acronym?: string;
  /** Ancre URL stable. */
  slug: string;
  /** Définition courte (une ou deux phrases) : cible DefinedTerm et extraits de réponse. */
  short: string;
  /** Précision (une ou deux phrases). */
  body?: string;
  /** Lien interne utile (guide ou outil). */
  related?: { to: string; label: string };
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Assujetti à la TVA",
    slug: "assujetti-tva",
    short:
      "Une entreprise qui réalise des opérations soumises à la TVA. Toutes les entreprises assujetties établies en France sont concernées par la facture électronique obligatoire.",
    body: "Micro-entrepreneurs et indépendants compris, même en franchise en base. C'est ce statut qui fait entrer dans la réforme ; la taille de l'entreprise fixe seulement la date d'émission.",
    related: { to: "/diagnostic", label: "Vérifier ma situation (diagnostic)" },
  },
  {
    term: "Annuaire",
    slug: "annuaire",
    short:
      "L'annuaire national des destinataires, tenu par l'administration : il indique la plateforme agréée par laquelle chaque entreprise reçoit ses factures.",
    body: "Il est alimenté par les plateformes agréées. Une entreprise qui n'a pas choisi de plateforme n'y figure pas, et ne peut donc pas recevoir de facture électronique.",
  },
  {
    term: "B2B / B2C / B2G",
    slug: "b2b-b2c-b2g",
    short:
      "Les types de ventes : B2B entre entreprises, B2C à un particulier, B2G au secteur public. La facture électronique obligatoire vise le B2B entre entreprises établies en France.",
    body: "Les factures au secteur public passent déjà par Chorus Pro. Les ventes aux particuliers ne donnent pas lieu à une facture électronique : leurs données relèvent de l'e-reporting.",
  },
  {
    term: "Chorus Pro",
    slug: "chorus-pro",
    short:
      "La plateforme publique par laquelle passent, depuis 2017, les factures adressées au secteur public (B2G).",
    body: "Chorus Pro reste le canal des factures vers l'administration. Entre entreprises, les factures passent par les plateformes agréées.",
  },
  {
    term: "CII",
    acronym: "Cross Industry Invoice",
    slug: "cii",
    short:
      "Un format de facture électronique en XML, normalisé par les Nations unies (UN/CEFACT). C'est aussi le langage de la partie XML d'une facture Factur-X.",
    body: "Le CII est l'un des trois formats admis par la réforme, avec l'UBL et Factur-X. OdocPilot produit ses données XML au format CII, profil EN 16931.",
    related: { to: "/guide/factur-x", label: "Factur-X expliqué simplement" },
  },
  {
    term: "Cycle de vie de la facture",
    slug: "cycle-de-vie",
    short:
      "La suite des statuts d'une facture électronique (déposée, rejetée, refusée, encaissée…), que les plateformes agréées se transmettent.",
    body: "Vous savez où en est chaque facture sans relancer à l'aveugle. Un rejet vient d'une plateforme (format, donnée manquante) ; un refus vient du client, et il doit être motivé.",
  },
  {
    term: "e-facturation",
    acronym: "facturation électronique",
    slug: "e-facturation",
    short:
      "L'émission, la transmission et la réception de factures dans un format structuré, que les logiciels et l'administration lisent automatiquement. Un PDF envoyé par e-mail n'en est pas une.",
    body: "Le format compte autant que le canal : la facture est un fichier structuré (Factur-X, UBL ou CII) et elle passe par une plateforme agréée.",
    related: { to: "/guide/facturation-electronique-2026", label: "Facturation électronique 2026 : le guide complet" },
  },
  {
    term: "e-reporting",
    slug: "e-reporting",
    short:
      "La transmission à l'administration, par une plateforme agréée, des données des opérations qui ne passent pas par une facture électronique entre entreprises françaises (ventes à des particuliers, opérations internationales), et de certaines données de paiement.",
    body: "Obligatoire depuis le 1er septembre 2026 pour les grandes entreprises et les ETI, et au 1er septembre 2027 pour les PME, TPE et micro-entreprises.",
    related: { to: "/guide/obligations-2026-2027", label: "Calendrier et sanctions" },
  },
  {
    term: "EN 16931",
    slug: "en-16931",
    short:
      "La norme européenne qui définit les données d'une facture électronique et leur signification. Les formats admis par la réforme française la respectent.",
    body: "Le profil « EN 16931 » de Factur-X, aussi appelé COMFORT, reprend l'ensemble des données de la norme. C'est celui que produit OdocPilot.",
    related: { to: "/verificateur", label: "Vérifier une facture gratuitement" },
  },
  {
    term: "Factur-X",
    slug: "factur-x",
    short:
      "Un format de facture hybride : un PDF lisible par un humain qui contient les mêmes données en XML (CII), selon la norme EN 16931. Le plus simple à adopter pour une TPE.",
    body: "L'humain lit le PDF, le logiciel lit le XML, et personne ne ressaisit rien.",
    related: { to: "/generateur-factur-x", label: "Créer une facture Factur-X gratuitement" },
  },
  {
    term: "FEC",
    acronym: "Fichier des écritures comptables",
    slug: "fec",
    short:
      "Le fichier normalisé des écritures comptables qu'une entreprise tenant une comptabilité informatisée doit pouvoir remettre à l'administration fiscale en cas de contrôle.",
    body: "Il ne fait pas partie de la réforme, mais des factures bien classées le rendent plus simple à produire. OdocPilot produit un export au format FEC que votre expert-comptable importe dans son logiciel.",
  },
  {
    term: "Mentions obligatoires",
    slug: "mentions-obligatoires",
    short:
      "Les informations qu'une facture doit porter : numéro, date, identité et identifiants du vendeur et du client, désignation, quantités, prix, TVA, totaux et conditions de paiement.",
    body: "La réforme en ajoute quatre : le SIREN du client, la catégorie de l'opération (biens, services ou les deux), l'option pour le paiement de la TVA d'après les débits le cas échéant, et l'adresse de livraison si elle diffère de celle du client.",
    related: { to: "/e-facture#mentions", label: "Les nouvelles mentions, en détail" },
  },
  {
    term: "OD",
    acronym: "Opérateur de dématérialisation",
    slug: "od",
    short:
      "Un prestataire qui prépare et met en forme les factures électroniques, mais qui s'appuie sur une plateforme agréée pour les transmettre dans le circuit officiel.",
    body: "Un OD n'est pas immatriculé par l'administration comme une plateforme agréée. OdocPilot travaille de cette façon : il prépare vos factures, et l'envoi officiel passera par une plateforme agréée partenaire, raccordement pas encore ouvert.",
  },
  {
    term: "PA",
    acronym: "Plateforme agréée",
    slug: "plateforme-agreee",
    short:
      "Un opérateur immatriculé par l'administration fiscale, qui émet, transmet et reçoit les factures électroniques et transmet les données prévues à l'administration. Le passage obligé de la réforme.",
    body: "Terme employé par l'administration depuis 2025, à la place de « PDP ». La DGFiP comptait 150 plateformes agréées au 1er août 2026 ; la liste officielle est publiée sur impots.gouv.fr.",
    related: { to: "/guide/plateforme-agreee", label: "Plateforme agréée : rôle et comment choisir" },
  },
  {
    term: "PAF",
    acronym: "Piste d'audit fiable",
    slug: "paf",
    short:
      "Les contrôles documentés qui relient une facture à l'opération réelle (commande, livraison, paiement), pour garantir son authenticité et son intégrité.",
    body: "C'est l'une des façons admises de garantir l'authenticité d'une facture, avec la signature électronique et l'échange de données informatisé.",
  },
  {
    term: "PDF/A-3",
    slug: "pdf-a3",
    short:
      "La variante du format PDF conçue pour l'archivage, qui permet d'intégrer des fichiers dans le document. C'est le contenant d'une facture Factur-X.",
    body: "Un Factur-X est un PDF/A-3 qui contient le fichier XML des données. Un PDF classique ne contient rien de tel et n'est pas une facture électronique.",
  },
  {
    term: "PDP",
    acronym: "Plateforme de dématérialisation partenaire",
    slug: "pdp",
    short:
      "L'ancien nom de la plateforme agréée (PA). Le rôle est le même : opérateur immatriculé par l'administration pour transmettre les factures électroniques.",
    body: "Si vous lisez « PDP » dans une documentation, comprenez « plateforme agréée » : l'administration a changé de terme en 2025.",
    related: { to: "/guide/plateforme-agreee", label: "PA, ex-PDP : le guide" },
  },
  {
    term: "PPF",
    acronym: "Portail public de facturation",
    slug: "ppf",
    short:
      "Le portail public que l'État prévoyait à l'origine comme plateforme gratuite d'échange de factures. En octobre 2024, il y a renoncé.",
    body: "Il n'existe donc pas de plateforme publique gratuite pour échanger les factures entre entreprises. L'État tient l'annuaire des destinataires et reçoit les données fiscales ; les factures passent par les plateformes agréées.",
    related: { to: "/guide/obligations-2026-2027", label: "Calendrier et sanctions" },
  },
  {
    term: "Profil (Factur-X)",
    slug: "profil-factur-x",
    short:
      "Le niveau de détail des données d'un Factur-X, du plus léger (MINIMUM) au plus complet (EXTENDED). Le profil EN 16931, aussi appelé COMFORT, reprend toutes les données de la norme.",
    body: "Pour une facture entre entreprises, le profil EN 16931 est le choix courant. C'est celui que produit OdocPilot.",
  },
  {
    term: "Réception (obligation de)",
    slug: "reception",
    short:
      "L'obligation de pouvoir recevoir des factures électroniques par une plateforme agréée. Elle s'applique depuis le 1er septembre 2026 à toutes les entreprises assujetties à la TVA.",
    body: "C'est l'échéance la plus large de la réforme : avant même d'émettre, il faut pouvoir recevoir. Pour une entreprise sans plateforme, une mise en demeure de trois mois précède toute amende.",
    related: { to: "/guide/obligations-2026-2027", label: "Le calendrier officiel" },
  },
  {
    term: "Émission (obligation d')",
    slug: "emission",
    short:
      "L'obligation d'émettre ses factures au format électronique, par une plateforme agréée. Pour les PME, TPE et micro-entreprises, elle s'applique au 1er septembre 2027, avec l'e-reporting.",
    body: "Les grandes entreprises et les ETI émettent depuis le 1er septembre 2026. Une petite entreprise peut aussi commencer plus tôt, de façon volontaire.",
  },
  {
    term: "SIREN / SIRET",
    slug: "siren-siret",
    short:
      "Les identifiants d'entreprise français : le SIREN (9 chiffres) identifie l'entreprise, le SIRET (14 chiffres) un de ses établissements.",
    body: "La réforme rend obligatoire le SIREN du client sur les factures entre entreprises : c'est lui qui permet de trouver sa plateforme de réception dans l'annuaire.",
  },
  {
    term: "TVA intracommunautaire",
    slug: "tva-intracommunautaire",
    short:
      "Le numéro d'identification à la TVA d'une entreprise dans l'Union européenne. Il figure parmi les mentions d'une facture entre professionnels.",
    body: "En France, il se construit à partir du SIREN. Le vérificateur gratuit contrôle qu'un identifiant du vendeur (SIRET ou numéro de TVA) figure dans la facture.",
  },
  {
    term: "UBL",
    acronym: "Universal Business Language",
    slug: "ubl",
    short:
      "Un format de facture électronique en XML, normalisé par l'organisation OASIS, admis par la réforme française au même titre que le CII et Factur-X.",
    body: "UBL est très répandu à l'international. Pour une TPE, Factur-X reste le plus simple à adopter, parce qu'il se lit comme un PDF.",
  },
  {
    term: "Sanctions",
    slug: "sanctions",
    short:
      "Le code général des impôts prévoit des amendes par facture non émise en électronique (article 1737) et pour les données non transmises (article 1788 D). Pour la réception, une mise en demeure de trois mois précède toute amende.",
    body: "Pendant la phase de démarrage, l'administration n'appliquera pas de sanction automatique aux entreprises engagées dans une démarche de mise en conformité. Les montants figurent dans le code général des impôts.",
    related: { to: "/guide/obligations-2026-2027", label: "Calendrier et sanctions" },
  },
  {
    term: "Acompte",
    acronym: "facture d'acompte",
    slug: "acompte",
    short:
      "Une facture émise avant la livraison ou la prestation, pour un paiement partiel. Elle porte les mêmes mentions obligatoires qu'une facture.",
    body: "L'acompte se déduit ensuite de la facture finale. La réforme ne change pas ce mécanisme : dans son champ, la facture d'acompte suit le même circuit électronique que les autres factures.",
  },
  {
    term: "Avoir",
    acronym: "facture d'avoir",
    slug: "avoir",
    short:
      "Une facture qui annule ou réduit une facture précédente (retour, remise, erreur). Elle fait référence à la facture d'origine.",
    body: "Une facture émise ne se supprime pas : on la corrige ou on l'annule par un avoir. Dans le champ de la réforme, l'avoir suit le même circuit électronique que la facture.",
  },
  {
    term: "Auto-liquidation de TVA",
    slug: "auto-liquidation",
    short:
      "Le mécanisme par lequel le client, et non le fournisseur, déclare et paie la TVA. Cas fréquents : sous-traitance dans le BTP, achats entre entreprises de pays européens différents.",
    body: "La facture porte la mention « Autoliquidation » et n'affiche pas de TVA. Dans les données structurées, ce cas a son propre code de catégorie de TVA (AE dans la norme EN 16931).",
    related: { to: "/verificateur", label: "Contrôler une facture gratuitement" },
  },
  {
    term: "DGFiP",
    acronym: "Direction générale des finances publiques",
    slug: "dgfip",
    short:
      "L'administration fiscale française. Elle immatricule les plateformes agréées, tient l'annuaire des destinataires et reçoit les données transmises par les plateformes.",
    body: "Elle publie la liste officielle des plateformes agréées, une FAQ et un guide pratique sur impots.gouv.fr. C'est la source de référence.",
  },
  {
    term: "Délais de paiement",
    acronym: "LME",
    slug: "delais-paiement",
    short:
      "Entre professionnels, le délai de paiement est de 30 jours après la livraison ou la prestation, sauf accord. Convenu par contrat, il ne peut pas dépasser 60 jours après la date de la facture, ou 45 jours fin de mois.",
    body: "Ces plafonds viennent de la loi de modernisation de l'économie (LME). La date d'échéance figure sur la facture et dans ses données structurées.",
  },
  {
    term: "Pénalités de retard",
    slug: "penalites-retard",
    short:
      "Les intérêts dus en cas de paiement tardif d'une facture entre professionnels. Leur taux, fixé par vos conditions, ne peut être inférieur à trois fois le taux d'intérêt légal ; à défaut, c'est le taux de la BCE majoré de 10 points.",
    body: "Le taux doit figurer sur la facture. S'y ajoute l'indemnité forfaitaire de 40 € pour frais de recouvrement.",
  },
  {
    term: "Indemnité forfaitaire de recouvrement",
    slug: "indemnite-recouvrement",
    short:
      "L'indemnité de 40 € due de plein droit par un professionnel qui paie une facture en retard. Sa mention sur la facture est obligatoire depuis 2013.",
    body: "Elle s'ajoute aux pénalités de retard. Si les frais de recouvrement réels sont plus élevés, le créancier peut demander une indemnité complémentaire, sur justificatifs.",
  },
  {
    term: "Numéro de facture",
    slug: "numero-facture",
    short:
      "Le numéro unique de chaque facture, attribué selon une séquence chronologique et continue, sans trou ni doublon. Une ou plusieurs séries sont possibles.",
    body: "Une rupture dans la numérotation attire l'attention en cas de contrôle. Un logiciel de facturation numérote pour vous.",
  },
  {
    term: "TVA en franchise",
    slug: "franchise-tva",
    short:
      "Le régime des entreprises, souvent des micro-entrepreneurs, qui ne facturent pas de TVA sous certains seuils de chiffre d'affaires. Il ne dispense pas de la facture électronique.",
    body: "La facture porte la mention « TVA non applicable, art. 293 B du CGI ». Réception obligatoire depuis le 1er septembre 2026, émission au 1er septembre 2027.",
    related: { to: "/diagnostic", label: "Suis-je concerné ? Le diagnostic" },
  },
  {
    term: "Coffre-fort numérique",
    slug: "coffre-fort-numerique",
    short:
      "Un service d'archivage qui garantit qu'un document n'a pas été modifié et qu'il reste lisible dans la durée. Il s'appuie souvent sur la norme NF Z42-013.",
    body: "Les factures se conservent 10 ans au titre du code de commerce, 6 ans au titre du droit fiscal. OdocPilot ne fait pas d'archivage à valeur probante.",
  },
  {
    term: "eIDAS",
    slug: "eidas",
    short:
      "Le règlement européen n° 910/2014, révisé en 2024, qui encadre l'identification électronique, les signatures et les cachets électroniques.",
    body: "Une facture peut être signée ou cachetée électroniquement pour garantir son origine et son intégrité. Ce n'est pas la seule méthode admise : la piste d'audit fiable en est une autre.",
  },
  {
    term: "API de dépôt",
    slug: "api-depot",
    short:
      "L'interface technique par laquelle un logiciel de facturation dépose une facture sur une plateforme agréée, qui l'achemine ensuite vers le destinataire.",
    body: "C'est par ce type d'interface qu'OdocPilot enverra vos factures à une plateforme agréée partenaire. Ce raccordement n'est pas encore ouvert.",
    related: { to: "/guide/plateforme-agreee", label: "Choisir sa plateforme agréée" },
  },
  {
    term: "Sceau électronique",
    slug: "sceau-electronique",
    short:
      "L'équivalent, pour une entreprise, de la signature électronique : il atteste l'origine et l'intégrité d'un document sans qu'une personne signe. Le règlement eIDAS parle de « cachet électronique ».",
    body: "Le cachet électronique qualifié, le niveau le plus élevé, bénéficie d'une présomption d'intégrité des données et d'exactitude de leur origine.",
  },
  {
    term: "OGA",
    acronym: "Organisme de gestion agréé",
    slug: "oga",
    short:
      "Un organisme agréé par l'administration fiscale (centre ou association de gestion agréé) qui accompagne les petites entreprises et les professions libérales dans leurs obligations comptables et fiscales.",
    body: "La réforme de la facture électronique s'applique, que vous soyez adhérent d'un OGA ou non.",
  },
];

export const GLOSSARY_BY_SLUG: Record<string, GlossaryTerm> = Object.fromEntries(
  GLOSSARY.map((t) => [t.slug, t]),
);
