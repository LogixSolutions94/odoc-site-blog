/**
 * Contenu des pages piliers SEO (silos conformité e-facture).
 * Pages éducatives (AEO/GEO) qui maillent vers /e-facture, les outils gratuits et /pricing.
 * Honnêteté : faits réglementaires sourcés, « l'IA prépare, vous validez », transmission « bientôt ».
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
  { to: "/diagnostic", label: "Diagnostic conformité (3 min)" },
  { to: "/generateur-factur-x", label: "Générateur Factur-X gratuit" },
  { to: "/verificateur", label: "Vérifier une facture" },
];

export const GUIDES: Guide[] = [
  {
    slug: "facturation-electronique-2026",
    seoTitle: "Facturation électronique 2026 : le guide pour les dirigeants de TPE/PME",
    seoDesc:
      "Tout comprendre à la facturation électronique obligatoire en France : calendrier 2026/2027, format Factur-X, plateforme agréée, sanctions. Le guide clair pour un dirigeant de TPE/PME, sans jargon.",
    eyebrow: "Guide pilier · facturation électronique",
    h1: "Facturation électronique 2026 : le guide complet pour les dirigeants de TPE/PME",
    intro:
      "La facturation électronique devient obligatoire en France : dès le 1er septembre 2026, toute entreprise assujettie à la TVA devra recevoir ses factures au format électronique structuré ; l'émission et l'e-reporting suivront en 2027. Ce guide explique, sans jargon, ce qui change et comment s'y préparer.",
    sections: [
      {
        h2: "Qu'est-ce que la facturation électronique obligatoire ?",
        atomic:
          "La facturation électronique est une facture émise, transmise et reçue dans un format structuré, lisible automatiquement par les logiciels et l'administration fiscale — et non un simple PDF envoyé par email. En France, elle devient progressivement obligatoire entre 2026 et 2027 pour toutes les entreprises assujetties à la TVA.",
        body: [
          "Une facture électronique n'est pas une image ou un PDF classique. C'est un fichier au format structuré (Factur-X, UBL ou CII) qui contient les données de la facture de manière exploitable par une machine. Le format compte autant que le canal : une facture circulera désormais via une plateforme agréée, pas de boîte mail à boîte mail.",
          "L'objectif de la réforme est double : simplifier la vie des entreprises (moins de ressaisie, paiements plus rapides) et lutter contre la fraude à la TVA grâce à la transmission des données à l'administration (e-reporting).",
        ],
      },
      {
        h2: "Le calendrier : qui est concerné, et quand ?",
        atomic:
          "Le 1er septembre 2026, la réception de factures électroniques devient obligatoire pour toutes les entreprises assujetties à la TVA. Le 1er septembre 2027, l'émission et l'e-reporting deviennent obligatoires pour les TPE, PME et micro-entreprises.",
        body: [
          "La réforme s'applique en deux temps. La première échéance, au 1er septembre 2026, concerne la réception : toute entreprise doit être en mesure de recevoir une facture au format électronique. La seconde, au 1er septembre 2027, concerne l'émission et l'e-reporting pour les petites structures.",
          "Un point change tout : le Portail Public de Facturation (PPF) gratuit de l'État a été abandonné le 15 octobre 2024. Passer par une plateforme agréée privée est devenu le chemin obligatoire.",
        ],
        bullets: [
          "01/09/2026 — réception obligatoire (toutes les entreprises assujetties à la TVA)",
          "01/09/2027 — émission + e-reporting (TPE, PME, micro-entreprises)",
          "15/10/2024 — abandon du Portail Public de Facturation gratuit",
        ],
      },
      {
        h2: "Le format : Factur-X, UBL, CII",
        atomic:
          "Les formats légaux sont structurés : Factur-X (un PDF lisible doublé de données XML intégrées), UBL et CII. OdocPilot génère vos factures directement au format Factur-X conforme au profil EN 16931, sans paramétrage technique de votre part.",
        body: [
          "Factur-X est le format le plus pratique pour les TPE : il combine un PDF lisible par un humain et un volet XML structuré lisible par les machines. C'est un format « hybride » conforme à la norme européenne EN 16931.",
          "Vous pouvez tester gratuitement, sans compte : générez une facture au format Factur-X, ou vérifiez qu'une facture existante est bien conforme.",
        ],
      },
      {
        h2: "La transmission : la plateforme agréée (PA)",
        atomic:
          "À partir de 2026, les factures transitent par une plateforme agréée (PA, anciennement PDP) immatriculée par la DGFiP, qui achemine la facture et transmet les données fiscales à l'administration. On compte plus de 130 plateformes agréées mi-2026.",
        body: [
          "La plateforme agréée est l'intermédiaire obligatoire entre vous, vos clients/fournisseurs et l'administration. Elle remplace l'ancien canal public.",
          "Chez OdocPilot, la transmission via une plateforme agréée partenaire est en cours de raccordement et sera prête avant l'échéance. Aujourd'hui, l'outil génère vos factures au format conforme et prépare votre dossier.",
        ],
      },
      {
        h2: "Comment OdocPilot vous prépare",
        atomic:
          "OdocPilot est un copilote IA français : il génère vos factures au format Factur-X, lit et classe vos factures reçues, et prépare votre administratif. L'IA prépare le travail ; vous validez en un clic. Données et IA hébergées en France.",
        body: [
          "Le principe d'OdocPilot est simple : l'intelligence artificielle prépare (lecture des factures, extraction du montant/TVA/échéance, classement, relances), mais rien n'est validé ni comptabilisé sans vous. Vous gardez le dernier mot.",
          "C'est conçu pour le dirigeant de TPE qui gère son administratif sans expert-comptable au quotidien : pas un logiciel de plus à apprendre, mais une assistance qui fait le travail pénible à votre place.",
        ],
      },
    ],
    faqs: [
      { q: "Une facture électronique, c'est juste un PDF par email ?", a: "Non. La loi impose un format structuré, lisible automatiquement par les logiciels et l'administration : Factur-X (PDF + données XML), UBL ou CII. Un simple PDF envoyé par email ne sera plus suffisant à partir de 2026." },
      { q: "Suis-je concerné même si je suis micro-entreprise ?", a: "Oui. La réforme s'applique à toutes les entreprises assujetties à la TVA, y compris les micro-entreprises. La réception devient obligatoire au 1er septembre 2026, l'émission et l'e-reporting au 1er septembre 2027." },
      { q: "Faut-il un expert-comptable pour se mettre en conformité ?", a: "Non. OdocPilot est justement conçu pour les dirigeants qui pilotent leur administratif eux-mêmes : génération Factur-X sans paramétrage, lecture IA des factures, export FEC pour transmettre à un comptable si besoin." },
      { q: "Combien ça coûte de se mettre en conformité ?", a: "Vous pouvez commencer gratuitement : générateur Factur-X, diagnostic et vérificateur sont sans compte. Les offres OdocPilot démarrent à 49,99 €/mois, par entreprise et sans coût par utilisateur, avec un essai de 14 jours sans carte bancaire." },
    ],
    related: [
      { to: "/e-facture", label: "La réforme e-facture (page pilier)" },
      { to: "/guide/obligations-2026-2027", label: "Obligations & calendrier détaillés" },
      { to: "/guide/plateforme-agreee", label: "Comprendre la plateforme agréée" },
      ...TOOLS,
    ],
  },
  {
    slug: "obligations-2026-2027",
    seoTitle: "Obligations facturation électronique 2026/2027 : calendrier et sanctions",
    seoDesc:
      "Calendrier officiel de la facturation électronique : réception au 1er septembre 2026, émission et e-reporting au 1er septembre 2027. Qui est concerné, quelles sanctions. Guide clair pour TPE/PME.",
    eyebrow: "Guide · obligations & calendrier",
    h1: "Obligations de facturation électronique 2026/2027 : calendrier, périmètre et sanctions",
    intro:
      "Deux échéances structurent la réforme : la réception obligatoire au 1er septembre 2026 pour toutes les entreprises assujetties à la TVA, puis l'émission et l'e-reporting au 1er septembre 2027 pour les TPE, PME et micro-entreprises. Voici précisément qui doit faire quoi, et quand.",
    sections: [
      {
        h2: "Le calendrier officiel en deux étapes",
        atomic:
          "Au 1er septembre 2026, toute entreprise assujettie à la TVA doit pouvoir recevoir ses factures au format électronique. Au 1er septembre 2027, les TPE, PME et micro-entreprises doivent émettre leurs factures au format électronique et transmettre leur e-reporting.",
        body: [
          "La première obligation est la plus universelle : dès le 1er septembre 2026, vous devez être capable de recevoir une facture électronique. Concrètement, il faut être raccordé à une plateforme agréée.",
          "La seconde étape, au 1er septembre 2027, ajoute l'émission (envoyer vos propres factures au format structuré) et l'e-reporting (transmettre certaines données de transactions à l'administration).",
        ],
        bullets: [
          "01/09/2026 — réception obligatoire : toutes les entreprises assujetties à la TVA",
          "01/09/2027 — émission + e-reporting : TPE, PME, micro-entreprises",
        ],
      },
      {
        h2: "Qui est concerné ?",
        atomic:
          "Toutes les entreprises établies en France et assujetties à la TVA sont concernées, y compris les micro-entreprises et les indépendants. Le calendrier d'émission distingue les grandes entreprises (plus tôt) des TPE/PME (1er septembre 2027).",
        body: [
          "Le périmètre est très large : il couvre les opérations entre entreprises (B2B) établies en France. Même si vous êtes une petite structure, vous êtes concerné — au minimum par l'obligation de réception dès 2026.",
          "Vérifiez votre situation exacte en 3 minutes avec le diagnostic de conformité : il vous indique votre date butoir et les étapes qui s'appliquent à votre activité.",
        ],
      },
      {
        h2: "Le PPF abandonné : pourquoi c'est décisif",
        atomic:
          "Le Portail Public de Facturation (PPF) gratuit de l'État a été abandonné le 15 octobre 2024. Il n'existe donc plus de canal public gratuit : passer par une plateforme agréée privée est devenu obligatoire pour émettre et recevoir.",
        body: [
          "Au départ, l'État prévoyait un portail public gratuit. Son abandon change la donne : il n'y a plus d'option « gratuite par défaut » de l'État, et chaque entreprise doit choisir une plateforme agréée.",
        ],
      },
      {
        h2: "Les sanctions",
        atomic:
          "La loi de finances prévoit une amende de 50 € par facture émise dans un format non conforme et de 500 € par manquement à l'e-reporting, avec des mécanismes de clémence. La conformité coûte donc nettement moins cher que l'amende.",
        body: [
          "Les montants unitaires (50 € par facture non conforme, 500 € par manquement à l'e-reporting) peuvent s'accumuler vite pour une entreprise qui facture régulièrement. Se mettre en conformité en amont est la stratégie la plus économique.",
          "Source officielle à jour : impots.gouv.fr. Nous indiquons des montants unitaires confirmés ; les plafonds et modalités peuvent évoluer, vérifiez toujours la source officielle.",
        ],
      },
    ],
    faqs: [
      { q: "Quelle est la première échéance à retenir ?", a: "Le 1er septembre 2026 : à cette date, toute entreprise assujettie à la TVA doit pouvoir recevoir ses factures au format électronique via une plateforme agréée. C'est l'obligation la plus universelle." },
      { q: "Les micro-entreprises sont-elles concernées par l'e-reporting ?", a: "Oui, au 1er septembre 2027 pour l'émission et l'e-reporting. La réception, elle, s'applique dès le 1er septembre 2026, y compris pour les micro-entreprises." },
      { q: "Quelles sont les sanctions en cas de non-conformité ?", a: "La loi de finances prévoit 50 € par facture non conforme et 500 € par manquement à l'e-reporting, avec une période de clémence. Référez-vous à impots.gouv.fr pour les modalités exactes." },
    ],
    related: [
      { to: "/e-facture", label: "La réforme e-facture (page pilier)" },
      { to: "/guide/facturation-electronique-2026", label: "Le guide complet 2026" },
      { to: "/guide/plateforme-agreee", label: "Choisir sa plateforme agréée" },
      ...TOOLS,
    ],
  },
  {
    slug: "plateforme-agreee",
    seoTitle: "Plateforme agréée (PA, ex-PDP) : définition et comment se raccorder",
    seoDesc:
      "Qu'est-ce qu'une plateforme agréée (PA, anciennement PDP) pour la facturation électronique ? Rôle, choix, raccordement, abandon du PPF. Le guide clair pour un dirigeant de TPE/PME.",
    eyebrow: "Guide · plateforme agréée (PA)",
    h1: "Plateforme agréée (PA, ex-PDP) : ce qu'un dirigeant de TPE doit savoir",
    intro:
      "À partir de 2026, vos factures électroniques transiteront par une plateforme agréée (PA, anciennement « PDP »), un intermédiaire immatriculé par la DGFiP. Voici son rôle, comment la choisir, et ce que prépare OdocPilot.",
    sections: [
      {
        h2: "Qu'est-ce qu'une plateforme agréée (PA) ?",
        atomic:
          "Une plateforme agréée (PA, ex-PDP) est un opérateur immatriculé par l'administration fiscale, chargé d'émettre, transmettre et recevoir les factures électroniques, et de transmettre les données fiscales à l'administration. C'est l'intermédiaire obligatoire entre les entreprises et la DGFiP.",
        body: [
          "Le terme officiel est « plateforme agréée (PA) » depuis 2025 ; on parlait auparavant de « PDP » (plateforme de dématérialisation partenaire). C'est le même rôle.",
          "Sans plateforme agréée, vous ne pouvez ni recevoir ni émettre vos factures dans le circuit légal. C'est le point de passage obligé de la réforme.",
        ],
      },
      {
        h2: "Pourquoi est-elle obligatoire ?",
        atomic:
          "Parce que le Portail Public de Facturation gratuit a été abandonné le 15 octobre 2024. Il n'existe plus de canal public : chaque entreprise doit passer par une plateforme agréée privée pour être conforme.",
        body: [
          "L'abandon du PPF a rendu la plateforme agréée incontournable. C'est aujourd'hui le meilleur argument d'incontournabilité de la réforme.",
        ],
      },
      {
        h2: "Comment choisir sa plateforme agréée ?",
        atomic:
          "On compte plus de 130 plateformes agréées immatriculées par la DGFiP mi-2026. Pour une TPE, l'essentiel est de choisir une solution simple, qui génère le bon format (Factur-X / EN 16931), gère la transmission, et reste lisible sans expertise comptable.",
        body: [
          "Le nombre de plateformes agréées est élevé, ce qui peut être déroutant. Pour un dirigeant de TPE, mieux vaut une solution intégrée qui prépare la facture conforme ET gère la transmission, plutôt que d'empiler des outils.",
          "Critères utiles : format conforme (Factur-X EN 16931), souveraineté (données hébergées en France), simplicité, et un accompagnement humain de la conformité.",
        ],
      },
      {
        h2: "Où en est OdocPilot ?",
        atomic:
          "OdocPilot génère dès aujourd'hui vos factures au format Factur-X conforme et prépare votre conformité. La transmission via une plateforme agréée partenaire est en cours de raccordement et sera prête avant l'échéance.",
        body: [
          "Nous préférons être transparents : la transmission via plateforme agréée n'est pas encore branchée. En attendant, OdocPilot vous met en conformité de format (Factur-X) et prépare votre administratif — vous serez prêt le jour J.",
        ],
      },
    ],
    faqs: [
      { q: "PA ou PDP : quelle différence ?", a: "Aucune sur le fond : « plateforme agréée (PA) » est le terme officiel depuis 2025, qui remplace « PDP » (plateforme de dématérialisation partenaire). C'est le même rôle d'opérateur immatriculé par la DGFiP." },
      { q: "Combien y a-t-il de plateformes agréées ?", a: "Plus de 130 plateformes agréées étaient immatriculées par la DGFiP mi-2026. Le chiffre évolue ; pour une TPE, le critère décisif n'est pas le nombre mais la simplicité et le bon format de facture." },
      { q: "OdocPilot transmet-il déjà mes factures via une PA ?", a: "Pas encore : la transmission via une plateforme agréée partenaire est en cours de raccordement et sera prête avant l'échéance. Aujourd'hui, OdocPilot génère vos factures au format Factur-X conforme et prépare votre dossier." },
    ],
    related: [
      { to: "/e-facture", label: "La réforme e-facture (page pilier)" },
      { to: "/guide/obligations-2026-2027", label: "Obligations & calendrier" },
      { to: "/guide/factur-x", label: "Le format Factur-X expliqué" },
      ...TOOLS,
    ],
  },
  {
    slug: "factur-x",
    seoTitle: "Factur-X : le format de facture électronique expliqué (EN 16931, CII, PDF/A-3)",
    seoDesc:
      "Factur-X expliqué simplement : un PDF lisible doublé de données XML structurées, conforme à la norme EN 16931. Comment générer et vérifier une facture Factur-X gratuitement.",
    eyebrow: "Guide · Factur-X & formats",
    h1: "Factur-X : le format de facture électronique expliqué simplement",
    intro:
      "Factur-X est le format de facture électronique le plus pratique pour les TPE : un PDF lisible par un humain, doublé d'un volet XML structuré lisible par les machines, conforme à la norme européenne EN 16931. Voici comment ça marche — et comment en générer une gratuitement.",
    sections: [
      {
        h2: "Qu'est-ce que Factur-X ?",
        atomic:
          "Factur-X est un format de facture « hybride » : un fichier PDF/A-3 qui contient à la fois la facture lisible (le PDF) et ses données structurées (un volet XML au format CII). Il est conforme à la norme européenne EN 16931, exigée par la réforme française.",
        body: [
          "L'intérêt de Factur-X est qu'il satisfait à la fois l'humain (qui lit le PDF) et la machine (qui exploite le XML), sans ressaisie. C'est pour cela qu'il est privilégié par les petites entreprises.",
          "Les autres formats légaux sont l'UBL et le CII « pur » (XML seul). Factur-X reste le plus simple à adopter car il ressemble à une facture PDF classique.",
        ],
      },
      {
        h2: "Les profils EN 16931",
        atomic:
          "La norme EN 16931 définit les mentions obligatoires d'une facture électronique. Factur-X décline plusieurs profils (de MINIMUM à EXTENDED) ; le profil EN 16931 (aussi appelé COMFORT) couvre l'ensemble des mentions exigées pour une facture B2B conforme.",
        body: [
          "Un profil détermine le niveau de détail des données structurées. Pour une facture B2B standard, le profil EN 16931 est la cible : identité et identifiants du vendeur (SIRET, TVA) et du client, dates, lignes, ventilation de TVA, totaux cohérents.",
          "OdocPilot génère le volet XML au profil EN 16931, et notre vérificateur contrôle ces mentions sur n'importe quelle facture que vous déposez.",
        ],
      },
      {
        h2: "Générer et vérifier une Factur-X, gratuitement",
        atomic:
          "Vous pouvez générer une facture Factur-X conforme sans inscription, ou déposer une facture existante (PDF Factur-X ou XML) pour vérifier ses mentions obligatoires selon EN 16931. Les deux outils sont gratuits et l'analyse se fait dans votre navigateur.",
        body: [
          "Notre générateur produit le volet XML structuré (CII, profil EN 16931) + un PDF. Notre vérificateur extrait le volet structuré d'un PDF Factur-X et contrôle les mentions obligatoires.",
        ],
      },
      {
        h2: "Le piège du « simple PDF »",
        atomic:
          "Un simple PDF (même envoyé par email) n'est pas une facture électronique conforme : il n'a pas de volet structuré. À partir de 2026, le format structuré devient obligatoire. C'est la confusion la plus fréquente — et la plus risquée.",
        body: [
          "Beaucoup d'entreprises pensent être conformes parce qu'elles envoient des PDF. Ce n'est pas le cas : sans volet XML structuré, la facture n'est pas conforme. Vérifiez la vôtre en quelques secondes.",
        ],
      },
    ],
    faqs: [
      { q: "Factur-X et EN 16931, c'est pareil ?", a: "Pas exactement : EN 16931 est la norme européenne qui définit les mentions obligatoires d'une facture électronique ; Factur-X est un format (PDF + XML CII) qui peut être conforme au profil EN 16931. OdocPilot génère du Factur-X au profil EN 16931." },
      { q: "Un PDF classique est-il une facture électronique ?", a: "Non. Un PDF sans volet de données structurées (XML) n'est pas conforme à la réforme. Une facture électronique légale doit être au format structuré (Factur-X, UBL ou CII). Vous pouvez vérifier une facture gratuitement avec notre vérificateur." },
      { q: "Comment générer une facture Factur-X gratuitement ?", a: "Avec le générateur Factur-X d'OdocPilot, sans inscription : vous remplissez la facture, vous obtenez le volet XML structuré (CII, profil EN 16931) + un PDF, et nous vérifions vos mentions obligatoires." },
    ],
    related: [
      { to: "/generateur-factur-x", label: "Générateur Factur-X gratuit" },
      { to: "/verificateur", label: "Vérifier une facture Factur-X" },
      { to: "/guide/facturation-electronique-2026", label: "Le guide complet 2026" },
      { to: "/e-facture", label: "La réforme e-facture" },
    ],
  },
  {
    slug: "tpe-sans-comptable",
    seoTitle: "Facturation électronique pour une TPE sans expert-comptable : par où commencer",
    seoDesc:
      "Vous dirigez une TPE et gérez votre administratif sans expert-comptable au quotidien ? Voici comment vous mettre en conformité avec la facturation électronique 2026, simplement, étape par étape.",
    eyebrow: "Guide · TPE sans expert-comptable",
    h1: "Facturation électronique pour une TPE sans expert-comptable : par où commencer",
    intro:
      "Si vous dirigez une TPE et gérez votre administratif vous-même, la réforme de la facturation électronique peut sembler intimidante. Bonne nouvelle : c'est gérable, et vous n'avez besoin ni d'un expert-comptable au quotidien, ni de compétences techniques. Voici la marche à suivre.",
    sections: [
      {
        h2: "Le bon état d'esprit : c'est gérable",
        atomic:
          "La conformité à la facturation électronique 2026 ne demande pas d'expertise comptable : il faut un outil qui génère le bon format (Factur-X), qui lit vos factures reçues, et qui prépare le travail à votre place. Vous validez ; vous gardez le dernier mot.",
        body: [
          "Le dirigeant de TPE est exactement la cible d'OdocPilot : débordé, non-technicien, sans cabinet qui gère tout au quotidien. L'approche « l'IA prépare, vous validez » est conçue pour ce profil.",
          "Vous n'avez pas à devenir expert de Factur-X ou des plateformes agréées : l'outil s'en charge, et reste honnête sur ce qui est actif aujourd'hui (génération, lecture, classement) et ce qui arrive (transmission).",
        ],
      },
      {
        h2: "Les 3 étapes pour être prêt",
        atomic:
          "Trois étapes suffisent : (1) vérifier votre situation avec un diagnostic, (2) émettre vos factures au format Factur-X conforme, (3) centraliser vos factures reçues pour les lire et les classer automatiquement.",
        body: [
          "Commencez par le diagnostic : il vous donne votre date butoir et un plan daté. Ensuite, générez vos factures au format Factur-X. Enfin, laissez l'IA lire et classer vos factures reçues.",
        ],
        bullets: [
          "1. Vérifiez votre conformité (diagnostic 3 min)",
          "2. Émettez au format Factur-X conforme",
          "3. Centralisez et faites lire vos factures reçues par l'IA",
        ],
      },
      {
        h2: "Et mon expert-comptable, dans tout ça ?",
        atomic:
          "OdocPilot ne remplace pas votre expert-comptable : il prépare des données propres et classées, et exporte votre FEC (Fichier des Écritures Comptables) en un clic. Si vous avez un comptable, vous lui facilitez le travail ; sinon, vous gardez la main.",
        body: [
          "Que vous ayez un comptable ou non, l'export FEC conforme à la DGFiP permet de transmettre des données propres en un clic. L'outil s'intègre à votre organisation au lieu de la bousculer.",
        ],
      },
      {
        h2: "Commencer gratuitement",
        atomic:
          "Vous pouvez commencer sans rien payer : le diagnostic, le générateur Factur-X et le vérificateur sont gratuits et sans inscription. Le palier Conformité d'OdocPilot est gratuit ; les offres complètes démarrent à 49,99 €/mois, sans coût par utilisateur.",
        body: [
          "Pas besoin de carte bancaire pour tester. Faites le diagnostic, générez une facture conforme, et voyez l'IA préparer votre administratif sur vos propres documents.",
        ],
      },
    ],
    faqs: [
      { q: "Faut-il un expert-comptable pour être conforme ?", a: "Non. OdocPilot est conçu pour les dirigeants de TPE qui gèrent leur administratif sans expert-comptable au quotidien : génération Factur-X sans paramétrage, lecture IA des factures, export FEC si vous travaillez avec un comptable." },
      { q: "Je ne suis pas à l'aise avec la technique, est-ce un problème ?", a: "Non. Il n'y a aucun paramétrage technique : vous générez une facture conforme comme vous rempliriez un formulaire, et l'IA prépare le reste. Vous validez en un clic." },
      { q: "Par quoi commencer concrètement ?", a: "Par le diagnostic de conformité (3 minutes, gratuit, sans compte) : il vous indique votre date butoir et un plan daté en 3 étapes adapté à votre activité." },
    ],
    related: [
      { to: "/diagnostic", label: "Diagnostic conformité (3 min)" },
      { to: "/e-facture", label: "La réforme e-facture" },
      { to: "/guide/facturation-electronique-2026", label: "Le guide complet 2026" },
      { to: "/pricing", label: "Voir les tarifs (palier gratuit)" },
    ],
  },
];

export const GUIDE_BY_SLUG: Record<string, Guide> = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));
