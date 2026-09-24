/**
 * Contenu des pages guides SEO (silos conformité e-facture), rendu par GuidePillarPage.
 * Faits : état au 24/09/2026, sourcés sur impots.gouv.fr (page officielle, FAQ et guide
 * pratique de démarrage de la DGFiP). Aucun montant d'amende : les pages officielles n'en
 * citent pas, elles renvoient au code général des impôts.
 * Lu aussi par le prérendu (scripts/lib/marketing-pages.ts) : ne changer ni les clés, ni les
 * slugs, ni la forme des objets. seoTitle, seoDesc, h1 et intro sont affichés sans retouche
 * typographique : leurs espaces insécables sont écrites ici (  avant « : »,   avant « ? »).
 */
export type GuideSection = { h2: string; atomic?: string; body: string[]; bullets?: string[] };
export type GuideFaq = { q: string; a: string };
export type GuideRelated = { to: string; label: string };
export type Guide = {
  slug: string;
  seoTitle: string;
  seoDesc: string;
  eyebrow: string;
  h1: string;
  intro: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
  related: GuideRelated[];
};

const TOOLS: GuideRelated[] = [
  { to: "/diagnostic", label: "Diagnostic en 3 minutes" },
  { to: "/generateur-factur-x", label: "Générateur Factur-X gratuit" },
  { to: "/verificateur", label: "Vérificateur de facture" },
];

export const GUIDES: Guide[] = [
  {
    slug: "facturation-electronique-2026",
    seoTitle: "Facturation électronique 2026 : le guide pour TPE et PME",
    seoDesc:
      "Facturation électronique obligatoire : réception depuis le 1er septembre 2026, émission en 2027, formats, plateforme agréée. Le guide clair des TPE et PME.",
    eyebrow: "Guide · facturation électronique",
    h1: "Facturation électronique 2026 : le guide complet pour les TPE et PME",
    intro:
      "Depuis le 1er septembre 2026, toute entreprise assujettie à la TVA doit pouvoir recevoir des factures électroniques. L'émission et l'e-reporting suivent le 1er septembre 2027 pour les PME, TPE et micro-entreprises. Ce guide explique ce qui change, sans jargon.",
    sections: [
      {
        h2: "Qu'est-ce que la facturation électronique obligatoire ?",
        atomic:
          "Une facture électronique est émise, transmise et reçue dans un format structuré que les logiciels et l'administration lisent automatiquement. Ce n'est pas un PDF envoyé par e-mail. En France, la réception est obligatoire depuis le 1er septembre 2026 ; l'émission le sera le 1er septembre 2027 pour les PME, TPE et micro-entreprises.",
        body: [
          "Le format compte autant que le canal. La facture devient un fichier structuré (Factur-X, UBL ou CII), et elle circule par une plateforme agréée, plus de boîte mail à boîte mail.",
          "Selon l'administration, la réforme doit simplifier la gestion des factures (moins de ressaisie, des statuts de suivi, à terme des déclarations de TVA préremplies) et lutter contre la fraude à la TVA. Elle ne change pas les règles de TVA.",
        ],
      },
      {
        h2: "Le calendrier : qui est concerné, et quand ?",
        atomic:
          "Depuis le 1er septembre 2026, toutes les entreprises assujetties à la TVA doivent pouvoir recevoir des factures électroniques, et les grandes entreprises et les ETI les émettent. Le 1er septembre 2027, les PME, TPE et micro-entreprises devront émettre leurs factures en électronique et transmettre certaines données (e-reporting).",
        body: [
          "La réception est l'obligation la plus large : elle vaut pour toutes les entreprises, quelle que soit leur taille ou leur chiffre d'affaires, micro-entrepreneurs compris.",
          "Il n'existe pas de plateforme publique gratuite pour échanger les factures. L'État tient l'annuaire des destinataires ; les factures passent par des plateformes agréées.",
        ],
        bullets: [
          "1er septembre 2026 : réception pour toutes les entreprises ; émission et e-reporting pour les grandes entreprises et les ETI",
          "1er septembre 2027 : émission et e-reporting pour les PME, TPE et micro-entreprises",
        ],
      },
      {
        h2: "Le format : Factur-X, UBL, CII",
        atomic:
          "Trois formats structurés sont admis : Factur-X (un PDF lisible qui contient les données en XML), UBL et CII (des fichiers XML seuls). Pour une TPE, Factur-X est le plus simple : la facture se lit comme un PDF. OdocPilot crée vos factures au format Factur-X, profil EN 16931.",
        body: [
          "Factur-X associe un PDF lisible par un humain et un fichier XML lisible par les logiciels. Il suit la norme européenne EN 16931.",
          "Vous pouvez essayer sans compte : le générateur gratuit crée le fichier XML de votre facture et un PDF imprimable, et le vérificateur contrôle les principales mentions d'une facture Factur-X existante.",
        ],
      },
      {
        h2: "La transmission : la plateforme agréée (PA)",
        atomic:
          "Une plateforme agréée (PA, anciennement PDP) est un opérateur immatriculé par l'administration fiscale. Elle émet, transmet et reçoit les factures électroniques, et transmet à l'administration les données prévues par la loi. La DGFiP en comptait 150 au 1er août 2026.",
        body: [
          "Vous pouvez la choisir directement, ou passer par votre logiciel, votre banque ou votre expert-comptable s'ils en proposent une. La liste officielle est publiée sur impots.gouv.fr.",
          "OdocPilot n'est pas une plateforme agréée. L'envoi officiel de vos factures passera par une plateforme agréée partenaire ; ce raccordement n'est pas encore ouvert.",
        ],
      },
      {
        h2: "Ce qu'OdocPilot fait pour vous",
        atomic:
          "OdocPilot crée vos factures au format Factur-X, lit les factures que vous recevez et range vos documents. Vous vérifiez, vous validez. Vos documents sont stockés en France, chez OVHcloud ; l'IA est celle de Mistral AI, entreprise française.",
        body: [
          "Les factures reçues sont lues pour vous (fournisseur, numéro, dates, montants, TVA) : vous relisez la fiche, vous corrigez si besoin, vous validez. Vos relances de paiement partent automatiquement aux dates prévues, et vous pouvez les couper facture par facture.",
          "OdocPilot est pensé pour le dirigeant qui fait son administratif lui-même. Si vous avez un expert-comptable, vous lui transmettez un export comptable au format FEC.",
        ],
      },
    ],
    faqs: [
      {
        q: "Une facture électronique, c'est un PDF envoyé par e-mail ?",
        a: "Non. Une facture électronique est émise, transmise et reçue dans un format structuré (Factur-X, UBL ou CII), par une plateforme agréée. L'administration le précise : un PDF envoyé par e-mail n'en est pas une.",
      },
      {
        q: "Suis-je concerné en micro-entreprise ?",
        a: "Oui. Toutes les entreprises assujetties à la TVA sont concernées, micro-entrepreneurs compris, même en franchise en base. La réception est obligatoire depuis le 1er septembre 2026 ; l'émission et l'e-reporting le seront le 1er septembre 2027.",
      },
      {
        q: "Faut-il un expert-comptable pour se mettre en règle ?",
        a: "Non. Il vous faut une plateforme agréée pour recevoir vos factures, et un outil qui produit le bon format pour les émettre. Si vous travaillez avec un expert-comptable, demandez-lui quelle plateforme il utilise : c'est souvent le plus simple.",
      },
      {
        q: "Combien coûte la mise en conformité ?",
        a: "Selon la DGFiP, plus d'une dizaine des 150 plateformes agréées proposaient au 1er août 2026 une offre gratuite ou sans surcoût pour les besoins essentiels. Chez OdocPilot, le palier Conformité est gratuit ; les offres complètes vont de 49,99 € à 149,99 € par mois, avec 14 jours d'essai sans carte bancaire.",
      },
    ],
    related: [
      { to: "/e-facture", label: "La facture électronique obligatoire : le guide" },
      { to: "/guide/obligations-2026-2027", label: "Calendrier 2026-2027 et sanctions" },
      { to: "/guide/plateforme-agreee", label: "Plateforme agréée : rôle et comment choisir" },
      ...TOOLS,
    ],
  },
  {
    slug: "obligations-2026-2027",
    seoTitle: "Facturation électronique : calendrier 2026-2027 et sanctions",
    seoDesc:
      "Réception obligatoire depuis le 1er septembre 2026, émission et e-reporting au 1er septembre 2027 : qui doit faire quoi, et ce que prévoient les sanctions.",
    eyebrow: "Guide · calendrier et sanctions",
    h1: "Obligations de facturation électronique 2026-2027 : calendrier et sanctions",
    intro:
      "Deux dates structurent la réforme. Depuis le 1er septembre 2026, toute entreprise assujettie à la TVA doit pouvoir recevoir des factures électroniques. Le 1er septembre 2027, les PME, TPE et micro-entreprises devront aussi les émettre et transmettre certaines données. Voici qui doit faire quoi, et ce que prévoient les sanctions.",
    sections: [
      {
        h2: "Le calendrier officiel en deux étapes",
        atomic:
          "Depuis le 1er septembre 2026, toutes les entreprises doivent pouvoir recevoir des factures électroniques, et les grandes entreprises et les ETI les émettent. Au plus tard le 1er septembre 2027, les PME, TPE et micro-entreprises émettront à leur tour et transmettront leurs données de transaction et de paiement (e-reporting).",
        body: [
          "Recevoir, concrètement, c'est avoir choisi une plateforme agréée, directement ou par votre logiciel, votre banque ou votre expert-comptable. L'administration demande aux entreprises qui ne l'ont pas encore fait d'engager la démarche sans attendre.",
          "Jusqu'au 1er septembre 2027, une PME, une TPE ou une micro-entreprise peut continuer à émettre ses factures comme aujourd'hui. Elle peut aussi passer à l'émission électronique plus tôt, de façon volontaire.",
        ],
        bullets: [
          "1er septembre 2026 : réception pour toutes les entreprises ; émission et e-reporting pour les grandes entreprises et les ETI",
          "1er septembre 2027 : émission et e-reporting pour les PME, TPE et micro-entreprises",
        ],
      },
      {
        h2: "Qui est concerné ?",
        atomic:
          "Toutes les entreprises établies en France et assujetties à la TVA, quelle que soit leur taille, micro-entrepreneurs et indépendants compris. La facture électronique vise les échanges entre entreprises ; les ventes à des particuliers relèvent de l'e-reporting.",
        body: [
          "La taille de l'entreprise ne fixe que la date d'émission. La réception, elle, vaut pour toutes depuis le 1er septembre 2026.",
          "Pour connaître votre situation, faites le diagnostic en 3 minutes : il vous donne vos dates et les étapes qui s'appliquent à vous.",
        ],
      },
      {
        h2: "Pas de plateforme publique gratuite",
        atomic:
          "En octobre 2024, l'État a renoncé à faire de son portail public une plateforme gratuite d'échange de factures. Il tient l'annuaire des destinataires et reçoit les données fiscales ; les factures, elles, passent par des plateformes agréées privées.",
        body: [
          "Selon la DGFiP, plus d'une dizaine des 150 plateformes agréées au 1er août 2026 proposaient une offre gratuite ou sans surcoût pour les besoins essentiels des petites structures.",
        ],
      },
      {
        h2: "Les sanctions",
        atomic:
          "Les textes prévoient des amendes : par facture non émise en électronique (article 1737 du code général des impôts) et pour les données non transmises (article 1788 D). Pour la réception, une mise en demeure de trois mois précède toute amende. Pendant la phase de démarrage, pas de sanction automatique pour les entreprises engagées dans une démarche de mise en conformité.",
        body: [
          "L'administration distingue les difficultés réelles, documentées et suivies d'actions de correction, d'une inertie ou d'un refus d'entrer dans le dispositif. Gardez la trace de vos démarches : choix d'une plateforme, échanges avec votre logiciel ou votre expert-comptable.",
          "Les montants et plafonds sont fixés par le code général des impôts. Vérifiez-les sur impots.gouv.fr avant toute décision.",
        ],
      },
    ],
    faqs: [
      {
        q: "Quelle est la première échéance à retenir ?",
        a: "Le 1er septembre 2026, déjà passé : depuis cette date, toute entreprise assujettie à la TVA doit pouvoir recevoir des factures électroniques par une plateforme agréée. Si ce n'est pas encore fait, choisissez-en une sans attendre.",
      },
      {
        q: "Les micro-entreprises sont-elles concernées par l'e-reporting ?",
        a: "Oui, au 1er septembre 2027, en même temps que l'émission. La réception, elle, s'applique depuis le 1er septembre 2026, micro-entreprises comprises.",
      },
      {
        q: "Y aura-t-il des sanctions dès 2026 ?",
        a: "Pas de manière automatique. Selon la DGFiP, les entreprises qui rencontrent des difficultés mais sont engagées dans une démarche de mise en conformité ne seront pas sanctionnées pendant la phase de démarrage. Les amendes prévues par le code général des impôts visent l'inertie et le refus.",
      },
    ],
    related: [
      { to: "/e-facture", label: "La facture électronique obligatoire : le guide" },
      { to: "/guide/facturation-electronique-2026", label: "Facturation électronique 2026 : le guide complet" },
      { to: "/guide/plateforme-agreee", label: "Choisir sa plateforme agréée" },
      ...TOOLS,
    ],
  },
  {
    slug: "plateforme-agreee",
    seoTitle: "Plateforme agréée (PA, ex-PDP) : rôle et comment choisir",
    seoDesc:
      "Plateforme agréée (PA, ex-PDP) : son rôle dans la facture électronique, pourquoi elle est obligatoire depuis 2026, comment la choisir. Guide pour TPE et PME.",
    eyebrow: "Guide · plateforme agréée",
    h1: "Plateforme agréée (PA, ex-PDP) : ce qu'un dirigeant de TPE doit savoir",
    intro:
      "Depuis le 1er septembre 2026, vos factures électroniques passent par une plateforme agréée (PA, anciennement « PDP »), un opérateur immatriculé par l'administration fiscale. Voici son rôle, comment la choisir, et où en est OdocPilot.",
    sections: [
      {
        h2: "Qu'est-ce qu'une plateforme agréée (PA) ?",
        atomic:
          "Une plateforme agréée est un opérateur immatriculé par l'administration fiscale. Elle émet, transmet et reçoit les factures électroniques, contrôle leurs données, et transmet à l'administration les données prévues par la loi. C'est le passage obligé de la réforme.",
        body: [
          "« Plateforme agréée » est le terme employé par l'administration depuis 2025 ; on parlait auparavant de « PDP », plateforme de dématérialisation partenaire. Le rôle est le même.",
          "Les plateformes agréées doivent notamment être certifiées ISO 27001 pour leur activité de facturation électronique, héberger leurs données dans l'Union européenne et se soumettre à des audits réguliers.",
        ],
      },
      {
        h2: "Pourquoi est-elle obligatoire ?",
        atomic:
          "Parce que la loi prévoit que l'émission, la transmission et la réception des factures électroniques passent par une plateforme agréée (article 289 bis du code général des impôts). L'État n'a pas créé de plateforme publique gratuite pour échanger les factures.",
        body: [
          "L'État tient l'annuaire qui indique la plateforme de réception de chaque entreprise. Une entreprise sans plateforme n'y figure pas : ses fournisseurs ne peuvent pas lui adresser de facture électronique.",
        ],
      },
      {
        h2: "Comment choisir sa plateforme agréée ?",
        atomic:
          "La DGFiP comptait 150 plateformes agréées au 1er août 2026, dont plus d'une dizaine avec une offre gratuite ou sans surcoût pour les besoins essentiels. Choisissez selon votre volume de factures, les outils que vous utilisez déjà et ce que proposent votre banque ou votre expert-comptable.",
        body: [
          "Commencez par ce que vous avez déjà : votre logiciel de facturation, votre banque ou votre expert-comptable proposent peut-être une plateforme agréée. Vous pourrez en changer plus tard si vos besoins évoluent.",
          "Vérifiez qu'elle figure sur la liste officielle publiée sur impots.gouv.fr, qu'elle gère la réception comme l'émission, et que son tarif correspond à votre volume.",
        ],
      },
      {
        h2: "Où en est OdocPilot ?",
        atomic:
          "OdocPilot n'est pas une plateforme agréée. Il crée vos factures au format Factur-X, profil EN 16931. L'envoi officiel passera par une plateforme agréée partenaire ; ce raccordement n'est pas encore ouvert.",
        body: [
          "Le 18 septembre 2026, notre chaîne complète a été validée sur l'environnement de test d'une plateforme agréée : le dépôt a été accepté après correction de 9 règles. Le passage en production n'est pas encore ouvert.",
          "En attendant, pour la réception obligatoire depuis le 1er septembre 2026, choisissez une plateforme agréée dans la liste officielle.",
        ],
      },
    ],
    faqs: [
      {
        q: "PA ou PDP : quelle différence ?",
        a: "Aucune sur le fond. « Plateforme agréée (PA) » est le terme employé par l'administration depuis 2025 ; il remplace « plateforme de dématérialisation partenaire (PDP) ». Le rôle est le même.",
      },
      {
        q: "Combien y a-t-il de plateformes agréées ?",
        a: "150 au 1er août 2026, selon la DGFiP. La liste officielle, tenue à jour, est publiée sur impots.gouv.fr : c'est elle qui fait foi.",
      },
      {
        q: "OdocPilot transmet-il déjà mes factures par une plateforme agréée ?",
        a: "Pas encore. OdocPilot n'est pas une plateforme agréée : l'envoi officiel passera par une plateforme agréée partenaire, et ce raccordement n'est pas encore ouvert. Aujourd'hui, OdocPilot crée vos factures au format Factur-X et lit celles que vous recevez.",
      },
    ],
    related: [
      { to: "/e-facture", label: "La facture électronique obligatoire : le guide" },
      { to: "/guide/obligations-2026-2027", label: "Calendrier 2026-2027 et sanctions" },
      { to: "/guide/factur-x", label: "Factur-X expliqué simplement" },
      ...TOOLS,
    ],
  },
  {
    slug: "factur-x",
    seoTitle: "Factur-X : le format de facture électronique expliqué",
    seoDesc:
      "Factur-X expliqué simplement : un PDF lisible qui contient les données de la facture en XML, selon la norme EN 16931. Créez et vérifiez le vôtre gratuitement.",
    eyebrow: "Guide · Factur-X et formats",
    h1: "Factur-X : le format de facture électronique expliqué simplement",
    intro:
      "Factur-X est le format de facture électronique le plus simple pour une TPE : un PDF lisible par un humain, qui contient les mêmes données en XML pour les logiciels, selon la norme européenne EN 16931. Voici comment il fonctionne, et comment l'essayer gratuitement.",
    sections: [
      {
        h2: "Qu'est-ce que Factur-X ?",
        atomic:
          "Factur-X est un format de facture hybride : un fichier PDF/A-3 qui contient à la fois la facture lisible et ses données structurées, dans un fichier XML au format CII. Il suit la norme européenne EN 16931 et fait partie des trois formats admis par la réforme, avec UBL et CII.",
        body: [
          "L'intérêt de Factur-X : l'humain lit le PDF, le logiciel lit le XML, et personne ne ressaisit rien. C'est pourquoi il convient bien aux petites entreprises.",
          "UBL et CII sont des fichiers XML seuls, sans PDF lisible. Ils sont courants entre grandes entreprises et à l'international.",
        ],
      },
      {
        h2: "Les profils Factur-X et la norme EN 16931",
        atomic:
          "La norme EN 16931 définit les données d'une facture électronique et leur signification. Factur-X se décline en profils, du plus léger (MINIMUM) au plus complet (EXTENDED). Le profil EN 16931, aussi appelé COMFORT, reprend l'ensemble des données de la norme.",
        body: [
          "Le profil fixe le niveau de détail des données structurées. Pour une facture entre entreprises, le profil EN 16931 est le choix courant : vendeur et client avec leurs identifiants, dates, lignes, TVA et totaux cohérents.",
          "OdocPilot produit ses factures au profil EN 16931.",
        ],
      },
      {
        h2: "Créer et vérifier une facture Factur-X gratuitement",
        atomic:
          "Sans inscription, le générateur crée le fichier XML de votre facture (CII, profil EN 16931) et un PDF imprimable. Le vérificateur contrôle les principales mentions d'une facture Factur-X existante, PDF ou XML. Les deux fonctionnent dans votre navigateur.",
        body: [
          "Le fichier Factur-X complet, un PDF/A-3 qui contient le XML, se crée dans OdocPilot, y compris avec le palier Conformité gratuit.",
          "Le vérificateur contrôle notamment le numéro, la date, les parties, la ventilation de TVA et la cohérence des totaux. Il ne remplace pas la validation d'une plateforme agréée.",
        ],
      },
      {
        h2: "Le piège du « simple PDF »",
        atomic:
          "Un PDF classique, même envoyé par e-mail, n'est pas une facture électronique : il ne contient pas de données structurées et ne passe pas par une plateforme agréée. C'est la confusion la plus fréquente.",
        body: [
          "Pendant la phase de démarrage, une facture reçue en PDF ou sur papier peut toujours être traitée et payée, et la TVA déduite, si elle correspond à une opération réelle. Mais pour une entreprise tenue d'émettre en électronique, le PDF n'est pas le circuit prévu par la réforme.",
        ],
      },
    ],
    faqs: [
      {
        q: "Factur-X et EN 16931, c'est pareil ?",
        a: "Non. EN 16931 est la norme européenne qui définit les données d'une facture électronique. Factur-X est un format, un PDF qui contient un XML au format CII, qui peut respecter cette norme avec le profil EN 16931. OdocPilot produit du Factur-X à ce profil.",
      },
      {
        q: "Un PDF classique est-il une facture électronique ?",
        a: "Non. Un PDF sans données structurées n'est pas une facture électronique au sens de la réforme. Les formats admis sont Factur-X, UBL et CII. Vous pouvez contrôler une facture Factur-X avec le vérificateur gratuit.",
      },
      {
        q: "Comment créer une facture Factur-X gratuitement ?",
        a: "Le générateur gratuit d'OdocPilot, sans inscription, crée le fichier XML de votre facture (CII, profil EN 16931) et un PDF imprimable. Pour obtenir le fichier Factur-X complet, créez votre compte : le palier Conformité est gratuit.",
      },
    ],
    related: [
      { to: "/generateur-factur-x", label: "Générateur Factur-X gratuit" },
      { to: "/verificateur", label: "Vérifier une facture Factur-X" },
      { to: "/guide/facturation-electronique-2026", label: "Facturation électronique 2026 : le guide complet" },
      { to: "/e-facture", label: "La facture électronique obligatoire : le guide" },
    ],
  },
  {
    slug: "tpe-sans-comptable",
    seoTitle: "Facture électronique sans comptable : par où commencer",
    seoDesc:
      "Vous gérez votre TPE sans expert-comptable au quotidien ? Les étapes pour être en règle avec la facture électronique, simplement, date par date.",
    eyebrow: "Guide · TPE sans expert-comptable",
    h1: "Facture électronique pour une TPE sans expert-comptable : par où commencer",
    intro:
      "Vous dirigez une TPE et faites votre administratif vous-même ? La facture électronique peut sembler intimidante. Elle reste gérable, sans expert-comptable au quotidien et sans compétence technique. Voici la marche à suivre.",
    sections: [
      {
        h2: "C'est gérable, étape par étape",
        atomic:
          "Être en règle avec la facture électronique ne demande pas d'expertise comptable. Il vous faut une plateforme agréée pour recevoir vos factures, un outil qui produit le bon format pour les émettre, et un peu d'ordre dans vos documents.",
        body: [
          "OdocPilot est pensé pour ce profil : le dirigeant qui n'a pas de cabinet pour tout gérer. Il crée vos factures au format Factur-X, lit celles que vous recevez et range vos documents ; vous vérifiez, vous validez.",
          "Vous n'avez pas à devenir expert des formats ou des plateformes. Ce qui compte : savoir ce qui vous concerne, et à quelle date.",
        ],
      },
      {
        h2: "Les 3 étapes pour être en règle",
        atomic:
          "Trois étapes : choisir une plateforme agréée pour recevoir vos factures, obligatoire depuis le 1er septembre 2026 ; émettre vos factures au bon format, avec les nouvelles mentions ; préparer l'émission électronique et l'e-reporting avant le 1er septembre 2027.",
        body: [
          "Le diagnostic en 3 minutes vous donne vos dates et une feuille de route. Commencez par là.",
        ],
        bullets: [
          "1. Choisissez une plateforme agréée pour la réception (liste officielle sur impots.gouv.fr)",
          "2. Créez vos factures au format Factur-X, avec le SIREN du client et la catégorie de l'opération",
          "3. Préparez l'émission et l'e-reporting du 1er septembre 2027",
        ],
      },
      {
        h2: "Et mon expert-comptable, dans tout ça ?",
        atomic:
          "OdocPilot ne remplace pas un expert-comptable. Il range vos pièces et produit un export comptable au format FEC, que votre expert-comptable importe dans son logiciel. Sans expert-comptable, vous gardez vos documents classés et retrouvables.",
        body: [
          "Si vous travaillez avec un cabinet, demandez-lui quelle plateforme agréée il utilise : le plus simple est souvent de passer par la même.",
        ],
      },
      {
        h2: "Commencer gratuitement",
        atomic:
          "Le diagnostic, le générateur Factur-X et le vérificateur sont gratuits et sans inscription. Dans OdocPilot, le palier Conformité est gratuit ; les offres complètes vont de 49,99 € à 149,99 € par mois, avec 14 jours d'essai de l'offre Pro sans carte bancaire.",
        body: [
          "Faites le diagnostic, créez une facture au bon format, puis déposez une facture reçue pour voir la fiche se remplir.",
        ],
      },
    ],
    faqs: [
      {
        q: "Faut-il un expert-comptable pour être en règle ?",
        a: "Non. La loi demande de recevoir vos factures par une plateforme agréée et, au 1er septembre 2027, de les émettre au format électronique. Un outil adapté suffit ; un expert-comptable reste utile pour votre comptabilité.",
      },
      {
        q: "Je ne suis pas à l'aise avec l'informatique, est-ce un problème ?",
        a: "Non. Créer une facture au bon format se fait comme on remplit un formulaire. Pour les factures reçues, OdocPilot remplit la fiche à partir du document ; vous relisez, vous validez.",
      },
      {
        q: "Par quoi commencer concrètement ?",
        a: "Par le diagnostic (3 minutes, gratuit, sans inscription) : il vous indique vos dates et une feuille de route en 3 étapes. Si vous n'avez pas encore de plateforme agréée pour recevoir vos factures, c'est la première chose à faire.",
      },
    ],
    related: [
      { to: "/diagnostic", label: "Diagnostic en 3 minutes" },
      { to: "/e-facture", label: "La facture électronique obligatoire : le guide" },
      { to: "/guide/facturation-electronique-2026", label: "Facturation électronique 2026 : le guide complet" },
      { to: "/pricing", label: "Les tarifs, palier gratuit compris" },
    ],
  },
];

export const GUIDE_BY_SLUG: Record<string, Guide> = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));
