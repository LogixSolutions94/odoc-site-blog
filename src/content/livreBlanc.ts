/**
 * Contenu du livre blanc « Facturation électronique 2026/2027 » (page /livre-blanc).
 * Long-form ungated + version imprimable. Faits alignés sur src/content/guides.ts.
 * Ton : honnête (ce qui est sûr / ce qui bouge), « l'IA prépare, vous validez ».
 */
export interface WpSection {
  h2: string;
  slug: string;
  atomic?: string;
  body: string[];
  bullets?: string[];
}
export interface WpFaq {
  q: string;
  a: string;
}

export const WHITE_PAPER = {
  title: "Facturation électronique 2026/2027 : le guide honnête pour les TPE/PME",
  subtitle:
    "Tout ce qu'un dirigeant doit comprendre pour être prêt — le calendrier, les formats, la plateforme agréée, les sanctions et un plan d'action concret. Sans jargon, sans survente, et en disant ce qui est encore mouvant.",
  tldr: [
    "Dès le 1er septembre 2026, toute entreprise assujettie à la TVA doit pouvoir RECEVOIR ses factures au format électronique. L'émission et l'e-reporting suivent au 1er septembre 2027 pour les TPE/PME.",
    "Une facture électronique n'est PAS un PDF par email : c'est un format structuré (Factur-X, UBL, CII) qui circule via une plateforme agréée (PA, ex-PDP).",
    "Le portail public gratuit (PPF) a été abandonné le 15 octobre 2024 : passer par une plateforme agréée privée est devenu obligatoire.",
    "Se préparer tôt coûte beaucoup moins cher que les sanctions. Vous pouvez commencer gratuitement, sans expert-comptable et sans compétences techniques.",
  ],
  sections: [
    {
      h2: "De quoi parle-t-on, exactement ?",
      slug: "de-quoi-parle-t-on",
      atomic:
        "La facturation électronique est une facture émise, transmise et reçue dans un format structuré, lisible automatiquement par les logiciels et l'administration fiscale — et non un simple PDF envoyé par email. En France, elle devient progressivement obligatoire entre 2026 et 2027 pour toutes les entreprises assujetties à la TVA.",
      body: [
        "Deux choses changent en même temps : le format ET le canal. Le format, parce qu'une facture devient un fichier structuré (Factur-X, UBL ou CII) dont les données sont exploitables par une machine. Le canal, parce qu'elle ne circule plus de boîte mail à boîte mail, mais via une plateforme agréée par l'administration.",
        "L'objectif de la réforme est double : simplifier la vie des entreprises (moins de ressaisie, paiements plus rapides, suivi des statuts) et lutter contre la fraude à la TVA grâce à la transmission des données à l'administration (l'e-reporting).",
      ],
    },
    {
      h2: "Le calendrier officiel",
      slug: "calendrier",
      atomic:
        "Le 1er septembre 2026, la réception de factures électroniques devient obligatoire pour toutes les entreprises assujetties à la TVA. Le 1er septembre 2027, l'émission et l'e-reporting deviennent obligatoires pour les TPE, PME et micro-entreprises.",
      body: [
        "La réforme s'applique en deux temps. L'échéance la plus universelle est la première : pouvoir recevoir une facture électronique dès le 1er septembre 2026. La seconde ajoute l'émission et l'e-reporting pour les petites structures en 2027.",
        "Un événement a tout changé en cours de route : l'abandon, le 15 octobre 2024, du Portail Public de Facturation (PPF) gratuit de l'État. Il n'existe donc plus de canal public par défaut.",
      ],
      bullets: [
        "01/09/2026 — réception obligatoire (toutes les entreprises assujetties à la TVA)",
        "01/09/2027 — émission + e-reporting (TPE, PME, micro-entreprises)",
        "15/10/2024 — abandon du Portail Public de Facturation gratuit (PPF)",
      ],
    },
    {
      h2: "Qui est concerné ?",
      slug: "qui-est-concerne",
      atomic:
        "Toutes les entreprises établies en France et assujetties à la TVA sont concernées, y compris les micro-entreprises et les indépendants. C'est le statut d'assujetti, pas la taille, qui déclenche l'obligation.",
      body: [
        "Le périmètre couvre les opérations entre entreprises (B2B) établies en France. Même une petite structure est concernée — au minimum par l'obligation de réception dès 2026.",
        "Le doute le plus fréquent porte sur la date exacte qui s'applique à votre cas. Un diagnostic de 3 minutes lève l'ambiguïté et vous donne un plan daté.",
      ],
    },
    {
      h2: "Les formats : Factur-X, UBL, CII",
      slug: "formats",
      atomic:
        "Les formats légaux sont structurés : Factur-X (un PDF lisible doublé de données XML intégrées), UBL et CII. Pour une TPE, Factur-X est le plus simple : il ressemble à une facture PDF classique tout en étant conforme à la norme européenne EN 16931.",
      body: [
        "Factur-X est un format « hybride » : un PDF/A-3 qui embarque un volet XML (au format CII). Il satisfait à la fois l'humain (le PDF) et la machine (le XML), sans ressaisie.",
        "Le piège le plus courant — et le plus risqué — est de croire qu'envoyer un PDF suffit. Un PDF sans volet structuré n'est pas une facture électronique conforme. Vous pouvez le vérifier en quelques secondes.",
      ],
    },
    {
      h2: "La plateforme agréée (PA, ex-PDP)",
      slug: "plateforme-agreee",
      atomic:
        "À partir de 2026, les factures transitent par une plateforme agréée (PA, anciennement PDP) immatriculée par la DGFiP, qui achemine la facture et transmet les données fiscales à l'administration. On comptait plus de 130 plateformes agréées mi-2026.",
      body: [
        "La plateforme agréée est l'intermédiaire obligatoire entre vous, vos clients/fournisseurs et l'administration. Le terme officiel est « plateforme agréée (PA) » depuis 2025 ; c'est le même rôle que l'ancien « PDP ».",
        "Le nombre de plateformes peut être déroutant. Pour une TPE, le critère décisif n'est pas le nombre mais la simplicité : une solution qui prépare le bon format (Factur-X / EN 16931), gère la transmission, et reste lisible sans expertise comptable.",
      ],
    },
    {
      h2: "Les sanctions",
      slug: "sanctions",
      atomic:
        "La loi de finances prévoit une amende de 50 € par facture émise dans un format non conforme et de 500 € par manquement à l'e-reporting, avec des mécanismes de clémence. La conformité coûte donc nettement moins cher que l'amende.",
      body: [
        "Ces montants unitaires peuvent s'accumuler vite pour une entreprise qui facture régulièrement. Se mettre en conformité en amont reste la stratégie la plus économique.",
        "Soyons transparents : nous indiquons des montants unitaires confirmés ; les plafonds et modalités peuvent évoluer. Vérifiez toujours la source officielle (impots.gouv.fr) avant toute décision.",
      ],
    },
    {
      h2: "Votre plan d'action en 4 étapes",
      slug: "plan-daction",
      atomic:
        "Quatre étapes suffisent pour être prêt : faire le point sur votre situation, savoir recevoir, émettre au bon format, et préparer la transmission. Aucune ne demande d'expertise comptable.",
      body: [
        "L'idée n'est pas de tout faire d'un coup, mais d'avancer dans l'ordre. La réception est l'urgence 2026 ; l'émission et l'e-reporting, l'échéance 2027.",
      ],
      bullets: [
        "1. Faire le point : un diagnostic de 3 minutes pour connaître votre date butoir et vos obligations.",
        "2. Savoir recevoir : être en mesure de recevoir une facture électronique via une plateforme agréée (échéance 2026).",
        "3. Émettre au bon format : produire vos factures en Factur-X conforme EN 16931 (échéance 2027).",
        "4. Préparer la transmission : choisir la plateforme agréée qui acheminera vos factures et votre e-reporting.",
      ],
    },
    {
      h2: "La place de l'IA : elle prépare, vous validez",
      slug: "place-de-lia",
      atomic:
        "Un copilote IA français comme OdocPilot génère vos factures au format Factur-X, lit et classe vos factures reçues, et prépare votre administratif. L'IA prépare le travail ; vous validez en un clic. Rien n'est comptabilisé sans vous.",
      body: [
        "Le bon usage de l'IA pour une TPE n'est pas « l'IA exécute seule », mais « l'IA fait le travail pénible et vous gardez le dernier mot ». Lecture des factures, extraction du montant, de la TVA et de l'échéance, classement, relances : l'IA prépare, vous validez.",
        "Par honnêteté : chez OdocPilot, la génération au format conforme et la lecture des factures fonctionnent aujourd'hui ; la transmission via une plateforme agréée partenaire est en cours de raccordement et sera prête avant l'échéance. Données et IA sont hébergées en France.",
      ],
    },
  ] as WpSection[],
  faqs: [
    {
      q: "Une facture électronique, c'est juste un PDF par email ?",
      a: "Non. La loi impose un format structuré, lisible automatiquement par les logiciels et l'administration : Factur-X (PDF + données XML), UBL ou CII. Un simple PDF envoyé par email ne sera plus suffisant à partir de 2026.",
    },
    {
      q: "Suis-je concerné même en micro-entreprise ?",
      a: "Oui. La réforme s'applique à toutes les entreprises assujetties à la TVA, y compris les micro-entreprises. La réception devient obligatoire au 1er septembre 2026, l'émission et l'e-reporting au 1er septembre 2027.",
    },
    {
      q: "Faut-il un expert-comptable pour se mettre en conformité ?",
      a: "Non. Un outil qui génère le bon format sans paramétrage, lit vos factures reçues et exporte votre FEC suffit. Si vous avez un comptable, vous lui facilitez le travail ; sinon, vous gardez la main.",
    },
    {
      q: "Combien ça coûte ?",
      a: "Vous pouvez commencer gratuitement : diagnostic, générateur Factur-X et vérificateur sont sans compte. Les offres OdocPilot démarrent à 49,99 €/mois par entreprise, sans coût par utilisateur, avec un essai de 14 jours sans carte bancaire.",
    },
  ] as WpFaq[],
};
