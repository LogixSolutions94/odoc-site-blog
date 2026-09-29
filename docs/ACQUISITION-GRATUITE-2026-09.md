# Acquisition gratuite : priorité à la facture électronique

Décision du 29 septembre 2026 : capter les entreprises qui cherchent comment se mettre en règle. L'OCR est une entrée complémentaire, pas un changement de positionnement.

## Ordre de travail

1. Concentrer les liens et la diffusion sur `/e-facture`, `/auto-entrepreneurs` et `/diagnostic`. Ces pages existent déjà : éviter de créer des variantes concurrentes sans besoin démontré.
2. Exploiter les impressions déjà obtenues : examiner dans Search Console les couples requête/page sur l'OCR, Chorus Pro et les rejets Factur-X. Améliorer titre, réponse utile et lien vers l'étape suivante sur la page pertinente. Ne pas fusionner des articles sur le seul constat de titres proches.
3. Diffuser une ressource pratique par semaine depuis les comptes du fondateur : une réponse concrète, un exemple et un lien utile. Commencer par le diagnostic, puis le guide auto-entrepreneurs, puis le vérificateur Factur-X. Publier uniquement dans les communautés qui acceptent ce type de ressource, en indiquant le lien avec OdocPilot.
4. Proposer individuellement aux réseaux d'entrepreneurs et aux cabinets comptables une ressource qu'ils peuvent recommander. Aucun achat de liens, aucune inscription massive dans des annuaires, aucun envoi automatique.

## Trois angles prêts à développer

- « Facture électronique : par où commencer ? » : diagnostic gratuit, puis étapes adaptées au profil.
- « Auto-entrepreneur : suis-je concerné ? » : guide dédié, avec sources officielles et distinctions de TVA.
- « Ma facture Factur-X est rejetée » : vérification du fichier et explication des erreurs, sans présenter le vérificateur comme une certification.

Toujours distinguer ce que le produit fait aujourd'hui et ce qui dépend du raccordement de production à la plateforme partenaire. Ne pas promettre qu'une inscription suffit à rendre une entreprise conforme. Revalider les faits réglementaires sur impots.gouv.fr avant toute publication.

## Mesure sans outil payant

Le relevé quotidien existe dans le dépôt privé `odoc-seo-data`. Y conserver les chiffres, plutôt que les copier dans ce dépôt public.

- Chaque semaine : clics et impressions hors marque, puis pages et requêtes liées à la conformité. Les anciens articles retirés peuvent encore contribuer à la période historique.
- Par page : impressions, clics, CTR et position. Comparer des périodes de même durée ; quelques impressions ne permettent pas de conclure sur un titre.
- Conversion : clics vers diagnostic, outils et inscription. Les événements `cta-fonctionnalites-hero`, `cta-fonctionnalites-ocr`, `cta-fonctionnalites-diagnostic-hero` et `cta-fonctionnalites-final` distinguent les nouveaux emplacements. Leur réception dans Umami reste à vérifier après publication.
- Un clic d'inscription ne prouve pas une inscription terminée. La mesure de cette dernière appartient au SaaS, hors de ce dépôt.
- Bilan à J+28 après publication : comparer le trafic qualifié et les clics vers l'action, en notant les changements de position et le faible volume. Aucun objectif chiffré présenté comme une prévision garantie.

## Lot local préparé

Page `/fonctionnalites` : titre et description plus précis, lecture OCR explicitée avec validation humaine, raccourci vers le diagnostic, appels à l'essai contextualisés et mesurables. Pas de nouvel abonnement, de dépendance ni de campagne payante.

Référence : https://developers.google.com/search/docs/fundamentals/seo-starter-guide

## Textes de diffusion prêts à relire et publier

Ces brouillons ne sont pas envoyés. Utiliser un seul lien par publication. Espacer les trois prises de parole d'une semaine et répondre aux questions reçues.

### 1. Comprendre ses obligations

Facture électronique : vous avez entendu parler de la réforme, mais quelle est votre prochaine étape ?

J'ai conçu OdocPilot pour aider les petites entreprises à préparer leur facturation et leur administratif. Nous proposons un diagnostic gratuit pour vous orienter, puis un guide avec les sources officielles.

OdocPilot prépare les factures au format Factur-X. L'envoi officiel via notre plateforme agréée partenaire n'est pas encore ouvert : le diagnostic aide à se repérer, il ne certifie pas votre conformité.

Votre point de départ : https://odocpilot.com/diagnostic?utm_source=linkedin&utm_medium=organic_social&utm_campaign=conformite_ocr&utm_content=diagnostic

### 2. Montrer le bénéfice OCR

Recopier le fournisseur, le numéro et les montants d'une facture prend du temps. Et une faute de saisie reste facile à faire.

Dans OdocPilot, importez une facture : l'IA prépare les données, vous les contrôlez et corrigez ce qui doit l'être avant de valider. Une photo floue ou une facture inhabituelle peut demander une correction manuelle.

Je développe OdocPilot pour rendre cet administratif plus simple. Vous pouvez essayer la lecture de vos factures pendant 14 jours, sans carte bancaire.

Le fonctionnement : https://odocpilot.com/fonctionnalites?utm_source=linkedin&utm_medium=organic_social&utm_campaign=conformite_ocr&utm_content=ocr#documents

### 3. Aider les auto-entrepreneurs

Auto-entrepreneur et facture électronique : commencer par comprendre ce qui vous concerne.

Nous avons réuni dans le guide OdocPilot le calendrier, les distinctions liées à la TVA et les étapes de préparation, avec les sources officielles. L'objectif : savoir quoi vérifier avant de choisir ses outils.

Je suis le créateur d'OdocPilot. Le guide est accessible librement : https://odocpilot.com/auto-entrepreneurs?utm_source=linkedin&utm_medium=organic_social&utm_campaign=conformite_ocr&utm_content=micro

Pour une autre communauté, adapter le texte à sa question et remplacer `utm_source=linkedin` par le canal réel. Ne pas poster le même texte en masse.

## Vérifications du lot

TypeScript applicatif, build Vite, 34 pages marketing prérendues et 93 tests réussis. Le HTML OCR et ses limites sont désormais vérifiés sans JavaScript. Les événements de clic restent soumis au consentement analytics : ils ne couvrent pas tous les visiteurs.
