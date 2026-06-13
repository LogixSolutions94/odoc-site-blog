/**
 * Pages comparatives « OdocPilot vs X » (BOFU).
 * RÈGLE HONNÊTETÉ (publicité comparative licite) : comparaisons OBJECTIVES et vérifiables,
 * jamais de dénigrement. On reconnaît la vraie force du concurrent, et on positionne le
 * créneau d'OdocPilot (« l'IA prépare, vous validez » + souveraineté FR + wedge conformité).
 * On reste honnête sur OdocPilot : transmission via plateforme agréée = « bientôt » (partenaire).
 */
export type CompareRow = { dim: string; odoc: string | boolean; them: string | boolean; note?: string };
export type CompareFaq = { q: string; a: string };
export type Comparison = {
  slug: string;
  competitor: string;
  seoTitle: string;
  seoDesc: string;
  h1: string;
  intro: string;
  themStrength: string;   // ce que le concurrent fait très bien (honnête)
  odocAngle: string;      // le créneau OdocPilot
  rows: CompareRow[];
  chooseThem: string[];
  chooseOdoc: string[];
  faqs: CompareFaq[];
};

// Lignes objectives communes (valeurs renseignées par concurrent).
const ODOC = {
  pourQui: "Le dirigeant de TPE/PME qui prépare son admin sans expert-comptable au quotidien",
  facturX: "Oui (EN 16931)",
  iaPrepare: true,
  souverainete: "Données ET IA en France (Mistral)",
  gratuit: "Palier Conformité 0€ + essai 14 j sans CB",
  prix: "Par entreprise, sans coût par utilisateur (0€ / 49 / 89 / 149)",
};

export const COMPARISONS: Comparison[] = [
  {
    slug: "pennylane",
    competitor: "Pennylane",
    seoTitle: "OdocPilot vs Pennylane (2026) : lequel pour un dirigeant de TPE ?",
    seoDesc:
      "Comparatif honnête OdocPilot vs Pennylane : positionnement, facturation électronique, IA, souveraineté, prix. Pennylane est pensé pour le cabinet comptable ; OdocPilot pour le dirigeant qui prépare son admin sans comptable au quotidien.",
    h1: "OdocPilot vs Pennylane : lequel choisir en 2026 ?",
    intro:
      "Pennylane et OdocPilot préparent tous deux à la facturation électronique 2026/2027, mais ne s'adressent pas à la même personne. Pennylane est une plateforme de comptabilité pensée autour de l'expert-comptable ; OdocPilot est un copilote IA pour le dirigeant de TPE qui gère son administratif lui-même.",
    themStrength:
      "Pennylane est une excellente plateforme de comptabilité et de gestion, très complète, avec une collaboration native avec l'expert-comptable. Si vous travaillez en étroite relation avec un cabinet, c'est un choix solide et mûr.",
    odocAngle:
      "OdocPilot occupe le créneau que Pennylane ne vise pas : le dirigeant de TPE qui n'a pas de cabinet au quotidien et veut que l'IA prépare son admin (lecture de factures, classement, relances) — il valide en un clic. Données et IA hébergées en France.",
    rows: [
      { dim: "Pensé pour", odoc: ODOC.pourQui, them: "Le dirigeant ET son expert-comptable (cabinet-centric)" },
      { dim: "Génération Factur-X (EN 16931)", odoc: ODOC.facturX, them: "Oui" },
      { dim: "L'IA prépare l'admin, vous validez en 1 clic", odoc: ODOC.iaPrepare, them: "Suggestions IA, orientées compta" },
      { dim: "IA souveraine (modèle français hébergé France)", odoc: ODOC.souverainete, them: "Données en France (modèle IA non français)" },
      { dim: "Palier / essai gratuit", odoc: ODOC.gratuit, them: "Plan gratuit micro-entreprise + essai 15 j sans CB" },
      { dim: "Modèle de prix", odoc: ODOC.prix, them: "Freemium + 7 / 14 / 24 / 79 € selon profil" },
    ],
    chooseThem: [
      "Vous travaillez main dans la main avec un expert-comptable au quotidien.",
      "Vous avez besoin d'une comptabilité complète et de fonctions avancées de cabinet.",
    ],
    chooseOdoc: [
      "Vous gérez votre administratif vous-même, sans comptable au quotidien.",
      "Vous voulez que l'IA prépare le travail (factures, classement, relances) — vous validez.",
      "La souveraineté compte : données ET IA hébergées en France.",
    ],
    faqs: [
      { q: "Pennylane est-il fait pour les dirigeants sans comptable ?", a: "Pennylane est conçu autour de la collaboration avec l'expert-comptable et brille dans ce cadre. Pour un dirigeant qui gère son administratif seul, OdocPilot vise spécifiquement ce profil : l'IA prépare, vous validez en un clic." },
      { q: "Les deux génèrent-ils des factures Factur-X conformes ?", a: "Oui, Pennylane comme OdocPilot génèrent des factures au format électronique conforme. OdocPilot génère du Factur-X au profil EN 16931 et propose un générateur gratuit sans compte pour tester." },
      { q: "Quelle différence sur la souveraineté ?", a: "Les deux hébergent les données en France. La différence d'OdocPilot : l'intelligence artificielle elle-même est française (Mistral) et hébergée en France — pas seulement les données." },
    ],
  },
  {
    slug: "qonto",
    competitor: "Qonto",
    seoTitle: "OdocPilot vs Qonto (2026) : copilote IA d'admin ou compte pro ?",
    seoDesc:
      "Comparatif honnête OdocPilot vs Qonto : Qonto est un compte pro qui fait aussi de la facturation ; OdocPilot est un copilote IA qui prépare tout votre administratif. Facturation électronique, IA, souveraineté, prix.",
    h1: "OdocPilot vs Qonto : copilote d'admin ou compte pro ?",
    intro:
      "Qonto est avant tout un compte professionnel, qui ajoute la facturation électronique. OdocPilot n'est pas une banque : c'est un copilote IA qui prépare votre administratif (lecture de factures, classement, relances), quel que soit votre établissement bancaire.",
    themStrength:
      "Qonto est un excellent compte pro en ligne, rapide à ouvrir, avec une facturation intégrée et un statut de plateforme agréée. Si vous cherchez d'abord un compte professionnel moderne, Qonto est une référence.",
    odocAngle:
      "OdocPilot ne remplace pas votre banque : il prépare votre administratif avec l'IA, sans vous obliger à changer de compte. Le cœur n'est pas le paiement, mais le travail de paperasse fait à votre place — vous validez.",
    rows: [
      { dim: "Nature du produit", odoc: "Copilote IA d'administratif (indépendant de la banque)", them: "Compte pro + facturation intégrée" },
      { dim: "Génération Factur-X (EN 16931)", odoc: ODOC.facturX, them: "Oui" },
      { dim: "L'IA prépare l'admin, vous validez en 1 clic", odoc: ODOC.iaPrepare, them: "Automatisations bancaires / OCR" },
      { dim: "Lecture & classement IA des factures reçues", odoc: "Oui (GED IA, recherche en langage naturel)", them: "Selon offre" },
      { dim: "IA souveraine (modèle français hébergé France)", odoc: ODOC.souverainete, them: "Données en France" },
      { dim: "Faut-il changer de banque ?", odoc: "Non", them: "Pleine valeur avec le compte Qonto" },
    ],
    chooseThem: [
      "Vous cherchez d'abord un compte professionnel en ligne moderne.",
      "Vous voulez une plateforme agréée déjà raccordée pour la transmission.",
    ],
    chooseOdoc: [
      "Vous voulez garder votre banque et confier l'admin à une IA.",
      "Vous voulez que l'IA lise, classe et prépare vos factures — vous validez.",
      "La souveraineté de l'IA (française, hébergée France) compte pour vous.",
    ],
    faqs: [
      { q: "Faut-il un compte Qonto pour utiliser OdocPilot ?", a: "Non. OdocPilot est indépendant de votre banque : il prépare votre administratif (factures, classement, relances) quel que soit votre établissement. Qonto, lui, donne sa pleine valeur avec son compte pro." },
      { q: "Qonto transmet-il déjà les factures électroniques ?", a: "Qonto est une plateforme agréée. OdocPilot, lui, génère le format conforme aujourd'hui et raccorde la transmission via une plateforme agréée partenaire (en cours, prêt avant l'échéance)." },
      { q: "Lequel pour préparer mon admin avec l'IA ?", a: "OdocPilot est centré sur ce point : l'IA lit vos factures, les classe, prépare vos relances, et vous validez en un clic. Qonto automatise surtout des tâches bancaires." },
    ],
  },
  {
    slug: "indy",
    competitor: "Indy",
    seoTitle: "OdocPilot vs Indy (2026) : préparer son admin ou sa déclaration TNS ?",
    seoDesc:
      "Comparatif honnête OdocPilot vs Indy : Indy excelle pour la compta et la déclaration des indépendants/TNS ; OdocPilot prépare l'admin du dirigeant de TPE avec l'IA (factures, classement, relances). Facturation électronique, souveraineté, prix.",
    h1: "OdocPilot vs Indy : lequel pour votre administratif ?",
    intro:
      "Indy est une référence pour la comptabilité et la déclaration des indépendants (TNS), avec un plan gratuit à vie. OdocPilot répond à une autre attente : préparer l'administratif courant du dirigeant avec l'IA — factures reçues lues et classées, relances préparées — et vous validez.",
    themStrength:
      "Indy est très bon pour automatiser la comptabilité et la déclaration des indépendants et professions libérales, avec une offre gratuite à vie appréciée. Si votre besoin n°1 est la déclaration TNS, Indy est solide.",
    odocAngle:
      "OdocPilot ne se limite pas à la déclaration : c'est un copilote qui prépare le travail administratif au quotidien (lecture de factures, GED, relances), pour le dirigeant qui veut que ce soit géré — il garde le dernier mot.",
    rows: [
      { dim: "Cœur de la promesse", odoc: "L'IA prépare l'admin (factures, GED, relances), vous validez", them: "Compta automatisée + déclaration TNS" },
      { dim: "Génération Factur-X (EN 16931)", odoc: ODOC.facturX, them: "Oui" },
      { dim: "Copilote IA qui prépare et que l'on valide", odoc: ODOC.iaPrepare, them: "Automatisation compta (pas un copilote de préparation)" },
      { dim: "Lecture & classement IA des factures reçues", odoc: "Oui (GED IA)", them: "Selon offre" },
      { dim: "IA souveraine (modèle français hébergé France)", odoc: ODOC.souverainete, them: "Données en France" },
      { dim: "Palier / essai gratuit", odoc: ODOC.gratuit, them: "Plan gratuit à vie (sans CB)" },
    ],
    chooseThem: [
      "Votre priorité est la comptabilité et la déclaration de l'indépendant/TNS.",
      "Vous voulez un outil de compta gratuit à vie centré sur la déclaration.",
    ],
    chooseOdoc: [
      "Vous voulez que l'IA prépare votre admin courant — vous validez.",
      "Vous gérez des factures reçues à lire, classer et relancer.",
      "La souveraineté de l'IA (française) et le wedge conformité comptent.",
    ],
    faqs: [
      { q: "Indy fait-il la facturation électronique ?", a: "Oui, Indy propose la génération de factures conformes. OdocPilot aussi (Factur-X EN 16931, avec un générateur gratuit sans compte), et ajoute la lecture IA des factures reçues et leur classement." },
      { q: "Indy a un plan gratuit à vie, et OdocPilot ?", a: "OdocPilot propose un palier Conformité gratuit (générateur, diagnostic, vérificateur, aperçu lecture IA) et un essai 14 jours sans carte bancaire sur les offres payantes." },
      { q: "Lequel si je n'ai pas d'expert-comptable ?", a: "Les deux s'adressent à des dirigeants autonomes. Indy est orienté déclaration TNS ; OdocPilot est orienté préparation de l'admin par l'IA (vous validez)." },
    ],
  },
  {
    slug: "sellsy",
    competitor: "Sellsy",
    seoTitle: "OdocPilot vs Sellsy (2026) : copilote IA simple ou suite CRM ?",
    seoDesc:
      "Comparatif honnête OdocPilot vs Sellsy : Sellsy est une suite CRM + facturation pour équipes ; OdocPilot est un copilote IA simple et sans engagement pour le dirigeant de TPE. Facturation électronique, IA, prix, engagement.",
    h1: "OdocPilot vs Sellsy : copilote IA simple ou suite CRM ?",
    intro:
      "Sellsy est une suite complète CRM + facturation pour les équipes commerciales. OdocPilot vise la simplicité pour le dirigeant de TPE : l'IA prépare l'admin, vous validez, sans engagement et sans coût par utilisateur.",
    themStrength:
      "Sellsy est une suite riche (CRM, prospection, facturation, trésorerie) très adaptée aux équipes commerciales qui veulent tout piloter au même endroit. Si vous gérez un pipe commercial avec une équipe, Sellsy a de la profondeur.",
    odocAngle:
      "OdocPilot fait le choix inverse de la richesse : pas un CRM de plus à apprendre, mais une IA qui prépare l'administratif du dirigeant. Sans engagement, sans minimum d'utilisateurs, et un palier gratuit pour démarrer.",
    rows: [
      { dim: "Nature du produit", odoc: "Copilote IA d'administratif (simple)", them: "Suite CRM + facturation (riche)" },
      { dim: "Génération Factur-X (EN 16931)", odoc: ODOC.facturX, them: "Oui" },
      { dim: "L'IA prépare l'admin, vous validez en 1 clic", odoc: ODOC.iaPrepare, them: "Non (suite de gestion)" },
      { dim: "Palier / essai gratuit", odoc: ODOC.gratuit, them: "Essai 15 j sans CB (pas de palier gratuit)" },
      { dim: "Engagement / utilisateurs", odoc: "Sans engagement, sans coût par utilisateur", them: "Souvent min. 2 utilisateurs + engagement annuel" },
      { dim: "Prise en main", odoc: "Immédiate (l'IA fait le travail)", them: "Suite riche à paramétrer" },
    ],
    chooseThem: [
      "Vous pilotez une équipe commerciale et voulez un CRM + facturation complet.",
      "Vous avez besoin de prospection, trésorerie et reporting intégrés.",
    ],
    chooseOdoc: [
      "Vous êtes seul ou en petite équipe et voulez de la simplicité.",
      "Vous voulez que l'IA prépare l'admin — pas un logiciel de plus à apprendre.",
      "Vous voulez démarrer gratuitement, sans engagement ni coût par utilisateur.",
    ],
    faqs: [
      { q: "Sellsy a-t-il un palier gratuit ?", a: "Sellsy propose un essai gratuit de 15 jours sans carte bancaire, mais pas de palier gratuit permanent, et souvent un minimum de 2 utilisateurs avec engagement annuel. OdocPilot propose un palier Conformité gratuit, sans engagement." },
      { q: "OdocPilot fait-il du CRM comme Sellsy ?", a: "Non, et c'est un choix. OdocPilot se concentre sur la préparation de l'administratif par l'IA (factures, classement, relances, conformité). Sellsy est une suite CRM + facturation plus large." },
      { q: "Lequel est le plus simple à prendre en main ?", a: "OdocPilot vise la prise en main immédiate : l'IA prépare le travail, vous validez. Sellsy, plus riche, demande davantage de paramétrage." },
    ],
  },
  {
    slug: "axonaut",
    competitor: "Axonaut",
    seoTitle: "OdocPilot vs Axonaut (2026) : l'IA fait le travail, ou ERP à gérer ?",
    seoDesc:
      "Comparatif honnête OdocPilot vs Axonaut : Axonaut est un ERP tout-en-un à gérer manuellement ; OdocPilot laisse l'IA préparer l'administratif, vous validez. Facturation électronique, IA, souveraineté, prix.",
    h1: "OdocPilot vs Axonaut : l'IA prépare, ou vous gérez l'ERP ?",
    intro:
      "Axonaut est un ERP tout-en-un français (CRM, facturation, dépenses, projets) que vous pilotez manuellement. OdocPilot prend le parti inverse : l'IA prépare l'administratif à votre place — lecture des factures, classement, relances — et vous validez en un clic.",
    themStrength:
      "Axonaut est un ERP tout-en-un complet et abordable pour une TPE qui veut centraliser CRM, devis/factures, dépenses et projets dans un seul outil. Si vous cherchez une boîte à outils de gestion large, Axonaut couvre beaucoup de terrain.",
    odocAngle:
      "Là où un ERP vous demande de tout saisir et piloter, OdocPilot met l'IA au travail : elle lit, classe et prépare — vous validez. Le but n'est pas d'avoir plus de modules, mais moins de paperasse à faire soi-même.",
    rows: [
      { dim: "Approche", odoc: "L'IA prépare le travail, vous validez", them: "ERP tout-en-un piloté manuellement" },
      { dim: "Génération Factur-X (EN 16931)", odoc: ODOC.facturX, them: "Oui" },
      { dim: "Lecture & classement IA des factures reçues", odoc: "Oui (GED IA, recherche en langage naturel)", them: "Fonctions IA limitées" },
      { dim: "IA souveraine (modèle français hébergé France)", odoc: ODOC.souverainete, them: "Données en France" },
      { dim: "Palier / essai gratuit", odoc: ODOC.gratuit, them: "Essai 15 j sans CB (pas de palier gratuit)" },
      { dim: "Modèle de prix", odoc: ODOC.prix, them: "Par utilisateur (à partir de ~69,99 €/mois en mensuel)" },
    ],
    chooseThem: [
      "Vous voulez un ERP large pour centraliser CRM, projets, dépenses, stocks.",
      "Vous êtes à l'aise pour piloter manuellement vos process de gestion.",
    ],
    chooseOdoc: [
      "Vous voulez que l'IA fasse la paperasse à votre place — vous validez.",
      "Vous cherchez la simplicité, pas un ERP avec beaucoup de modules.",
      "La lecture IA des factures et la souveraineté française comptent.",
    ],
    faqs: [
      { q: "Axonaut a-t-il une IA qui prépare l'admin ?", a: "Axonaut est un ERP de gestion piloté manuellement, avec des fonctions IA limitées. OdocPilot met l'IA au cœur : elle lit, classe et prépare vos factures, et vous validez en un clic." },
      { q: "Lequel est le moins cher pour démarrer ?", a: "OdocPilot propose un palier Conformité gratuit et des offres dès 49 €/mois par entreprise (sans coût par utilisateur). Axonaut fonctionne par utilisateur, avec un essai gratuit de 15 jours mais pas de palier gratuit permanent." },
      { q: "Les deux préparent-ils à la facturation électronique 2026 ?", a: "Oui, les deux génèrent des factures au format conforme. OdocPilot ajoute la lecture IA des factures reçues, l'export FEC et un générateur Factur-X gratuit sans compte." },
    ],
  },
  {
    slug: "abby",
    competitor: "Abby",
    seoTitle: "OdocPilot vs Abby (2026) : micro-entrepreneur ou TPE/PME ?",
    seoDesc:
      "Comparatif honnête OdocPilot vs Abby : Abby est excellent pour le micro-entrepreneur ; OdocPilot vise les TPE/PME qui veulent que l'IA prépare leur admin. Facturation électronique, IA, souveraineté, prix.",
    h1: "OdocPilot vs Abby : micro-entrepreneur ou TPE/PME ?",
    intro:
      "Abby est une référence pour les micro-entrepreneurs : facturation, compta et déclarations URSSAF dans une appli simple, avec un plan gratuit. OdocPilot vise un cran au-dessus : les dirigeants de TPE/PME qui veulent que l'IA prépare leur administratif — vous validez.",
    themStrength:
      "Abby est très bien conçu pour le micro-entrepreneur : déclarations URSSAF, simulateurs, plan gratuit, prise en main immédiate. Si vous êtes auto-entrepreneur, Abby est un excellent point de départ.",
    odocAngle:
      "OdocPilot s'adresse au dirigeant de TPE/PME dont l'administratif dépasse la micro : factures reçues à lire et classer, relances à préparer, conformité à tenir. L'IA prépare ; vous gardez le dernier mot. Données et IA en France.",
    rows: [
      { dim: "Cible principale", odoc: "Dirigeant de TPE/PME (au-delà de la micro)", them: "Micro-entrepreneur / auto-entrepreneur" },
      { dim: "Génération Factur-X (EN 16931)", odoc: ODOC.facturX, them: "Oui" },
      { dim: "L'IA prépare l'admin, vous validez en 1 clic", odoc: ODOC.iaPrepare, them: "Facturation + compta micro (pas un copilote IA)" },
      { dim: "Lecture & classement IA des factures reçues", odoc: "Oui (GED IA)", them: "Limité" },
      { dim: "IA souveraine (modèle français hébergé France)", odoc: ODOC.souverainete, them: "Données en France" },
      { dim: "Palier / essai gratuit", odoc: ODOC.gratuit, them: "Plan gratuit + essai 14 j sans CB" },
    ],
    chooseThem: [
      "Vous êtes micro-entrepreneur et voulez gérer URSSAF + factures simplement.",
      "Vous cherchez un outil gratuit centré sur la micro-entreprise.",
    ],
    chooseOdoc: [
      "Votre activité dépasse la micro : plus de factures reçues à traiter.",
      "Vous voulez que l'IA lise, classe et prépare votre admin — vous validez.",
      "La souveraineté de l'IA (française) et la conformité comptent.",
    ],
    faqs: [
      { q: "Abby est-il adapté à une PME ?", a: "Abby est surtout pensé pour le micro-entrepreneur. Pour une TPE/PME avec davantage de factures reçues à lire, classer et relancer, OdocPilot ajoute une couche d'IA qui prépare ce travail." },
      { q: "Les deux ont un plan gratuit ?", a: "Oui : Abby a un plan gratuit pour la micro, et OdocPilot a un palier Conformité gratuit (générateur, diagnostic, vérificateur, aperçu lecture IA) + un essai 14 jours sans carte bancaire." },
      { q: "Lequel pour la facturation électronique 2026 ?", a: "Les deux génèrent des factures conformes. OdocPilot se distingue par la lecture IA des factures reçues, l'export FEC et le wedge conformité, avec données et IA hébergées en France." },
    ],
  },
];

export const COMPARISON_BY_SLUG: Record<string, Comparison> = Object.fromEntries(COMPARISONS.map((c) => [c.slug, c]));
