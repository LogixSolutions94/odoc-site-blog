/**
 * Lexique de la facturation électronique (page /lexique).
 * Définitions courtes (cibles AEO/DefinedTerm) + précision honnête là où la réforme
 * reste mouvante. Faits alignés sur src/content/guides.ts (source unique).
 */
export interface GlossaryTerm {
  /** Terme affiché. */
  term: string;
  /** Sigle/forme alternative (affichée à côté du terme). */
  acronym?: string;
  /** Ancre URL stable. */
  slug: string;
  /** Définition courte (1 phrase) — cible DefinedTerm / featured snippet. */
  short: string;
  /** Précision (1-2 phrases). */
  body?: string;
  /** Lien interne utile (guide / outil). */
  related?: { to: string; label: string };
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Assujetti à la TVA",
    slug: "assujetti-tva",
    short:
      "Une entreprise qui réalise des opérations soumises à la TVA. Toutes les entreprises assujetties à la TVA établies en France sont concernées par la réforme de la facturation électronique.",
    body: "Y compris les micro-entreprises et les indépendants. C'est ce critère, et non la taille, qui détermine si vous êtes concerné.",
    related: { to: "/diagnostic", label: "Vérifier ma situation (diagnostic)" },
  },
  {
    term: "Annuaire",
    slug: "annuaire",
    short:
      "Le répertoire central qui recense les entreprises et leur plateforme de réception, pour savoir où adresser chaque facture électronique.",
    body: "C'est l'annuaire qui permet d'acheminer une facture vers la bonne plateforme du destinataire. Votre plateforme s'en occupe pour vous.",
  },
  {
    term: "B2B / B2C / B2G",
    slug: "b2b-b2c-b2g",
    short:
      "Les types de transactions : B2B entre entreprises, B2C vers un particulier, B2G vers le secteur public. L'obligation de facture électronique vise d'abord le B2B domestique.",
    body: "Le B2G (factures vers l'administration) est déjà dématérialisé via Chorus Pro. Le B2C relève de l'e-reporting, pas de la facture électronique entre entreprises.",
  },
  {
    term: "Chorus Pro",
    slug: "chorus-pro",
    short:
      "La plateforme publique par laquelle transitent depuis 2017 les factures à destination du secteur public (B2G). Elle préfigure le fonctionnement de la facturation électronique B2B.",
    body: "Chorus Pro reste le canal des factures vers l'administration. Pour le B2B, le circuit repose désormais sur les plateformes agréées privées.",
  },
  {
    term: "CII",
    acronym: "Cross Industry Invoice",
    slug: "cii",
    short:
      "Un format de facture électronique en XML, normalisé par les Nations Unies (UN/CEFACT). C'est le volet de données structurées intégré dans une facture Factur-X.",
    body: "Le CII est l'une des syntaxes admises par la réforme, avec l'UBL. OdocPilot génère le volet XML au format CII, profil EN 16931.",
    related: { to: "/guide/factur-x", label: "Le format Factur-X expliqué" },
  },
  {
    term: "Cycle de vie de la facture",
    slug: "cycle-de-vie",
    short:
      "La suite des statuts d'une facture électronique (déposée, reçue, approuvée, mise en paiement, rejetée…), remontés par les plateformes tout au long du parcours.",
    body: "Ces statuts donnent une traçabilité que l'email n'offre pas : vous savez où en est chaque facture, sans relancer à l'aveugle.",
  },
  {
    term: "e-facturation",
    acronym: "facturation électronique",
    slug: "e-facturation",
    short:
      "L'émission, la transmission et la réception de factures dans un format structuré, lisible automatiquement par les logiciels et l'administration — pas un simple PDF envoyé par email.",
    body: "Le format compte autant que le canal : une facture circule via une plateforme agréée, dans un format structuré (Factur-X, UBL, CII).",
    related: { to: "/guide/facturation-electronique-2026", label: "Le guide complet 2026" },
  },
  {
    term: "e-reporting",
    slug: "e-reporting",
    short:
      "La transmission à l'administration fiscale de certaines données de transactions (ventes à des particuliers, opérations internationales) qui n'entrent pas dans la facture électronique B2B domestique.",
    body: "L'e-reporting complète la facturation électronique pour donner à l'administration une vision de l'ensemble de l'activité. Il devient obligatoire au 1er septembre 2027 pour les TPE/PME.",
    related: { to: "/guide/obligations-2026-2027", label: "Obligations & calendrier" },
  },
  {
    term: "EN 16931",
    slug: "en-16931",
    short:
      "La norme européenne qui définit le socle de mentions obligatoires d'une facture électronique. C'est la référence de conformité exigée par la réforme française.",
    body: "Une facture est conforme si ses données structurées respectent la norme EN 16931. Le profil « EN 16931 » de Factur-X (aussi appelé COMFORT) couvre ce socle.",
    related: { to: "/verificateur", label: "Vérifier une facture (EN 16931)" },
  },
  {
    term: "Factur-X",
    slug: "factur-x",
    short:
      "Un format de facture « hybride » : un PDF lisible par un humain doublé d'un volet de données XML (CII) lisible par les machines, conforme à la norme EN 16931. Le format le plus pratique pour les TPE.",
    body: "Factur-X satisfait à la fois l'humain (le PDF) et la machine (le XML), sans ressaisie. C'est pour cela qu'il est privilégié par les petites entreprises.",
    related: { to: "/generateur-factur-x", label: "Générer une Factur-X gratuitement" },
  },
  {
    term: "FEC",
    acronym: "Fichier des Écritures Comptables",
    slug: "fec",
    short:
      "Le fichier normalisé des écritures comptables qu'une entreprise doit pouvoir présenter à l'administration fiscale. Il se génère à partir d'une comptabilité tenue proprement.",
    body: "Indépendant de la facturation électronique, mais lié : des factures bien classées facilitent l'export du FEC. OdocPilot exporte le FEC conforme en un clic.",
  },
  {
    term: "Mentions obligatoires",
    slug: "mentions-obligatoires",
    short:
      "Les informations qu'une facture doit contenir pour être valable : identité et identifiants du vendeur et du client (SIRET, n° de TVA), dates, lignes, ventilation et totaux de TVA.",
    body: "La réforme ajoute de nouvelles mentions (n° SIREN du client, type d'opération, option de paiement de la TVA…). Notre vérificateur les contrôle automatiquement.",
    related: { to: "/verificateur", label: "Contrôler mes mentions obligatoires" },
  },
  {
    term: "OD",
    acronym: "Opérateur de Dématérialisation",
    slug: "od",
    short:
      "Un prestataire qui prépare et met en forme les factures électroniques mais qui doit s'appuyer sur une plateforme agréée pour les transmettre dans le circuit officiel.",
    body: "Un OD n'est pas immatriculé par la DGFiP comme une plateforme agréée : il travaille en amont, en lien avec une PA pour la transmission réglementaire.",
  },
  {
    term: "PA",
    acronym: "Plateforme agréée",
    slug: "plateforme-agreee",
    short:
      "Un opérateur immatriculé par l'administration fiscale, chargé d'émettre, transmettre et recevoir les factures électroniques et de transmettre les données à la DGFiP. L'intermédiaire obligatoire de la réforme.",
    body: "« Plateforme agréée (PA) » est le terme officiel depuis 2025 ; il remplace « PDP ». On comptait plus de 130 plateformes agréées mi-2026.",
    related: { to: "/guide/plateforme-agreee", label: "Comprendre la plateforme agréée" },
  },
  {
    term: "PAF",
    acronym: "Piste d'audit fiable",
    slug: "paf",
    short:
      "L'ensemble des contrôles documentés qui relient une facture à la réalité de l'opération (commande, livraison, paiement), garantissant l'authenticité et l'intégrité de la facture.",
    body: "Exigée par l'administration, la piste d'audit fiable est largement simplifiée quand la facture est nativement électronique et tracée de bout en bout.",
  },
  {
    term: "PDF/A-3",
    slug: "pdf-a3",
    short:
      "La variante du format PDF qui autorise l'intégration de fichiers (ici le volet XML). C'est le contenant technique d'une facture Factur-X.",
    body: "Un Factur-X est concrètement un PDF/A-3 qui embarque le XML des données. Un PDF classique, lui, n'embarque rien et n'est pas conforme.",
  },
  {
    term: "PDP",
    acronym: "Plateforme de Dématérialisation Partenaire",
    slug: "pdp",
    short:
      "L'ancien nom de la plateforme agréée (PA). Le rôle est identique : opérateur immatriculé par la DGFiP pour transmettre les factures électroniques.",
    body: "Si vous lisez « PDP » dans une documentation, comprenez « plateforme agréée (PA) » : la terminologie officielle a changé en 2025.",
    related: { to: "/guide/plateforme-agreee", label: "PA (ex-PDP) : le guide" },
  },
  {
    term: "PPF",
    acronym: "Portail Public de Facturation",
    slug: "ppf",
    short:
      "Le portail public gratuit qu'avait prévu l'État pour la facturation électronique, dont le développement a été abandonné le 15 octobre 2024.",
    body: "Conséquence décisive : il n'existe plus de canal public gratuit par défaut. Chaque entreprise doit passer par une plateforme agréée privée.",
    related: { to: "/guide/obligations-2026-2027", label: "Pourquoi l'abandon du PPF change tout" },
  },
  {
    term: "Profil (Factur-X)",
    slug: "profil-factur-x",
    short:
      "Le niveau de détail des données structurées d'un Factur-X, de MINIMUM à EXTENDED. Le profil « EN 16931 » (COMFORT) couvre toutes les mentions exigées pour une facture B2B conforme.",
    body: "Pour une facture B2B standard, visez le profil EN 16931. C'est celui que génère OdocPilot.",
  },
  {
    term: "Réception (obligation de)",
    slug: "reception",
    short:
      "La capacité, obligatoire dès le 1er septembre 2026 pour toutes les entreprises assujetties à la TVA, de recevoir ses factures au format électronique via une plateforme agréée.",
    body: "C'est l'échéance la plus universelle de la réforme : avant même d'émettre, il faut pouvoir recevoir. Tout le monde est concerné en 2026.",
    related: { to: "/guide/obligations-2026-2027", label: "Le calendrier officiel" },
  },
  {
    term: "Émission (obligation d')",
    slug: "emission",
    short:
      "L'obligation d'émettre ses propres factures au format électronique structuré. Pour les TPE, PME et micro-entreprises, elle s'applique au 1er septembre 2027, en même temps que l'e-reporting.",
    body: "Les grandes entreprises et ETI émettent plus tôt ; les petites structures au 1er septembre 2027. La réception, elle, vaut pour tous dès 2026.",
  },
  {
    term: "SIREN / SIRET",
    slug: "siren-siret",
    short:
      "Les identifiants d'entreprise français : le SIREN (9 chiffres) identifie l'entité, le SIRET (14 chiffres) un établissement précis. Ils figurent dans les mentions d'une facture conforme.",
    body: "La réforme ajoute notamment l'obligation de mentionner le SIREN du client sur les factures B2B.",
  },
  {
    term: "TVA intracommunautaire",
    slug: "tva-intracommunautaire",
    short:
      "Le numéro d'identification à la TVA d'une entreprise dans l'Union européenne. C'est l'une des mentions obligatoires d'une facture électronique conforme.",
    body: "Pour la France, il est construit à partir du SIREN. Notre vérificateur contrôle sa présence dans les factures que vous déposez.",
  },
  {
    term: "UBL",
    acronym: "Universal Business Language",
    slug: "ubl",
    short:
      "Un format de facture électronique en XML, normalisé par OASIS, admis par la réforme française au même titre que le CII.",
    body: "UBL est très répandu à l'international. En France, Factur-X (qui embarque du CII) reste le plus simple à adopter pour une TPE.",
  },
];

export const GLOSSARY_BY_SLUG: Record<string, GlossaryTerm> = Object.fromEntries(
  GLOSSARY.map((t) => [t.slug, t]),
);
