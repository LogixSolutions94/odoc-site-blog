# Refonte vitrine 09/2026 : système « Papeterie »

Guide de référence pour toute page de odocpilot.com. À lire avant de toucher une page.

## Le message

1. **Le principal, compris en 5 secondes** : « Facture électronique : soyez en règle, simplement. » OdocPilot crée des factures au format légal (Factur-X), lit celles que vous recevez, et vous dit ce qui vous concerne, date par date. Pour toute entreprise : auto-entrepreneur, indépendant, artisan, commerce, PME.
2. **Au quotidien** : du temps gagné (factures reçues lues et rangées, documents retrouvés en une phrase, relances préparées, export comptable).
3. **Le contrôle** : « L'IA prépare. Vous décidez. » Vous validez chaque facture ; vous choisissez qui est relancé (les relances automatiques se coupent facture par facture).
4. **La confiance** : un éditeur réel et nommé, des limites écrites noir sur blanc.

## Le système visuel

Papier blanc, encre pétrole. **Une couleur = un acteur** :
- **Orange surligneur** (`.marker`) = ce que l'IA a préparé. Jamais décoratif.
- **Encre** (`.btn-ink`, texte) = ce que VOUS décidez. Tous les boutons d'action sont à l'encre.
- **Tampon** (`<Stamp />`, `src/components/home/Stamp.tsx`) = la validation.
- L'orange de la marque (#F97316) n'apparaît que dans le logo.
- **Logo** (`<Logo />`, `src/components/Logo.tsx`) = le BrandLogo animé du SaaS (halo toutes les 6 s, sphère qui tourne en 24 s, coupé en mouvement réduit ; classes `.odoc-mark`, `.odoc-orb`). Demande de Riad du 25/09/2026. Pas de « ® » : la marque n'est pas déposée.

### Classes disponibles (src/index.css)

| Classe | Usage |
|---|---|
| `btn-ink` / `btn-ink btn-ink-sm` | Bouton d'action principal (encre, pression 0.97) |
| `link-underline` | Lien texte souligné discret |
| `marker` + `data-on` / `marker marker-static` | Trait de surligneur (animé / fixe) |
| `font-display` | Titres (Switzer 700/800) |
| `font-body` | Texte courant (Switzer) |
| `font-data` | Chiffres, numéros, SIRET (monospace système, chiffres tabulaires) |
| `display-tight` | Grands titres resserrés |
| `bg-desk` / `bg-paper` / `bg-sheet` | Fond « bureau » (sections alternées) / page / feuille |
| `text-ink-soft`, `text-petrole`, `text-orange-ink` | Encre diluée, pétrole (liens), orange lisible (rare) |
| `shadow-sheet` / `shadow-lift` | Papier posé / papier soulevé |
| `ledger-head` | Double filet des livres de comptes |

Tokens Tailwind existants toujours valables : `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-muted`, `bg-card`, `bg-primary text-primary-foreground` (= encre).

### Échelle

- Conteneur : `mx-auto max-w-[1240px] px-5 sm:px-8` (texte long : `max-w-3xl`).
- Sections : `py-20 sm:py-28`, séparées par des filets (`border-t border-border`) ou un fond `bg-desk`.
- H1 de page : `font-display display-tight text-[clamp(2.4rem,5.2vw,4.25rem)] font-bold leading-[1.02]`.
- H2 : `font-display text-3xl sm:text-[2.6rem] font-bold leading-[1.08] tracking-[-0.03em]`.
- H3 : `font-display text-xl font-bold`.
- Surtitre (optionnel, pas sur chaque section) : `text-sm font-bold text-muted-foreground`, en casse normale.
- Rayons : 8 px max pour l'interface (`rounded-lg`), 3 px pour le papier. Pas de `rounded-2xl/3xl`.
- Cartes : seulement pour ce qui est un OBJET (document, écran du produit, formulaire). Le reste = texte + filets.

## Interdit : les motifs qui font « généré par IA »

- Icônes Sparkles, Wand, Bot, Brain, Zap, Rocket, Stars ; icônes décoratives dans les titres.
- Icône dans un carré/rond coloré (« tuile d'icône ») au-dessus de chaque bloc.
- Texte en dégradé (`bg-clip-text`), `bg-gradient-*` décoratifs, halos, lueurs (`shadow-glow`), taches floues.
- Pastilles/pills avec icône (« ✨ Nouveau »), badges empilés, murs de badges (RGPD / AI Act / Numérique responsable / Sécurité maximale).
- Émojis (🇫🇷, ✅, 🚀…).
- Surtitre en MAJUSCULES espacées sur chaque section.
- `hover:scale-*` sur des cartes, `animate-float`, particules (`HeroParticles`), apparitions en cascade sur chaque bloc. `MotionDiv` reste permis avec parcimonie, jamais sur le contenu visible au chargement.
- Tirets cadratins (—) et demi-cadratins (–) dans le texte : remplacer par une virgule, deux-points, un point ou des parenthèses.
- Tournures creuses : « Soyons transparents », « révolutionner », « Plongeons », « Dans un monde où », « en toute sérénité », « sans zone d'ombre », « notre parti pris ».
- Grilles de 3 ou 4 cartes identiques icône + titre + phrase.

Icônes permises (lucide-react, `strokeWidth={1.75}`, 14 à 20 px) : seulement fonctionnelles (flèches, check, téléchargement, recherche, lien externe, menu, chevrons).

## Ce qu'on a le droit d'affirmer (vérifié)

Source : `odoc-pulse/docs/dataroom/CE_QUE_NOUS_NE_REVENDIQUONS_PAS.md` et les preuves du 18/09/2026.

- Factures au format **Factur-X, profil EN 16931**. Le 18/09/2026, la chaîne a été **validée de bout en bout sur l'environnement de test** d'une plateforme agréée (dépôt accepté après correction de 9 règles).
- **OdocPilot n'est pas une plateforme agréée.** L'envoi officiel passera par une plateforme agréée partenaire ; **il n'est pas encore ouvert**.
- Lecture automatique des factures reçues (fournisseur, numéro, dates, montants, TVA), validation par l'utilisateur.
- Recherche de documents en français courant, classement automatique.
- Relances d'impayés **automatiques** (J-7, J-3, puis en retard), activées par défaut, **désactivables facture par facture** (odoc-pulse `check-overdue-invoices`). Ne jamais écrire « rien ne part sans votre clic ».
- Export comptable **FEC**.
- Données stockées **en France, chez OVHcloud**. IA : **Mistral AI, entreprise française**, seul fournisseur d'IA appelé.
- Essai **14 jours de l'offre Pro, sans carte bancaire**. Prix : Conformité 0 €, Essential 49,99 €, Pro 89,99 €, Manager 149,99 € par mois (voir `src/lib/marketing.ts`).
- Fondateur : hors textes légaux, il s'affiche **« M. Brahimi R. »** (demande de Riad du 24/09/2026, AGENTS.md), ou « le fondateur ». Jamais le nom complet ni le prénom seul hors des pages légales. Pas de SIREN ni de forme juridique hors des pages légales.

## Interdit d'affirmer

« certifié », « plateforme agréée » ou « PDP » pour nous-mêmes, « sécurité maximale », « aligné sur l'AI Act », « IA hébergée en France » (dire « Mistral AI, entreprise française »), « archivage probant / à valeur légale », rapprochement bancaire ou transmission comme disponibles, « des milliers de », « clients satisfaits », « le plus choisi », tout témoignage, avis, note ou logo client (nous n'avons pas encore de clients payants), « Logix Solutions SASU » (n'existe pas).

## Réforme : les faits (impots.gouv.fr)

- **Depuis le 1er septembre 2026** : toutes les entreprises assujetties à la TVA (micro-entrepreneurs compris) doivent pouvoir **recevoir** des factures électroniques. Les grandes entreprises et ETI **émettent** déjà.
- **1er septembre 2027** : les PME, TPE et micro-entreprises doivent **émettre** leurs factures en électronique et transmettre certaines données (**e-reporting**).
- Une facture électronique n'est pas un PDF envoyé par e-mail : c'est un format structuré (Factur-X, UBL, CII), transmis par une **plateforme agréée**.
- Nouvelles mentions : SIREN du client, nature de l'opération (biens, services ou mixte), adresse de livraison si elle diffère, option pour la TVA sur les débits.

## SEO (ne rien casser)

- Garder `SEOHead` (title ≤ 60 car., description ≤ 160, canonical, jsonLd) sur chaque page. Un seul H1.
- Ne pas renommer les routes, slugs, exports ni la structure des données de `src/content/*` (le prérendu les lit).
- Mots-clés dans les H2 quand c'est naturel : facture électronique, facturation électronique, Factur-X, obligatoire, 2026, 2027, auto-entrepreneur, logiciel de facturation.
- Liens internes vers `/e-facture`, `/diagnostic`, `/generateur-factur-x`, `/verificateur`, `/pricing`.

## Liens et CTA

`import { SIGNUP_URL, LOGIN_URL, TRIAL, PLANS, formatEur, CONTACT_EMAIL, PUBLISHER } from "@/lib/marketing"`.
CTA principal : `<a href={SIGNUP_URL} className="btn-ink">Commencer gratuitement</a>` (même onglet). Secondaire : lien texte + `ArrowRight`.

## Typographie française

`import { fr } from "@/lib/typo"` puis `{fr("Suis-je concerné ?")}` : pose les espaces insécables avant ? ! : ; % €, dans les guillemets et entre les milliers.
