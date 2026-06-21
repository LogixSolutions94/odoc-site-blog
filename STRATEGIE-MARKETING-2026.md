# Stratégie marketing & conversion OdocPilot — 2026

> Rédigé le 21/06/2026. Basé sur : audit du site (ce repo), teardown des 8 concurrents FR,
> et état de l'art conversion/AEO 2026. **Ce fichier est la source de vérité du backlog
> marketing.** Ce qui est ✅ a été livré sur la branche `fix/no-trial-seo-prerender` (non
> déployé tant que non mergé + rebuild Docker `odoc-landing`).

---

## 0. Verdict

Le site est **objectivement bon** (design, honnêteté, pricing, et 3 outils gratuits que peu de
concurrents ont). Le problème n'est pas la qualité — c'est que le site **vendait la commodité
(la conformité)** et **sous-exploitait le vrai moteur** : les outils gratuits, la souveraineté
(IA française Mistral), et « l'IA prépare, vous validez ».

**Constat marché décisif** : la conformité e-facture est devenue **gratuite partout**. ~151
plateformes agréées au registre DGFiP (juin 2026) ; Pennylane, Qonto, Indy, Tiime, Abby, Dougs
la bundlent gratuitement (4 titrent « 100 % gratuit »). Donc « OdocPilot vous met en conformité »
= **ticket d'entrée, pas argument de vente**. Le wedge = **IA qui prépare (vous gardez la main) +
souveraineté FR + verticale BTP**. Aucun des 8 ne peut copier ça facilement.

---

## 1. ✅ Livré cette session (branche `fix/no-trial-seo-prerender`)

| # | Changement | Fichier | Pourquoi |
|---|---|---|---|
| P0-1 | **Capture email sur le vérificateur** (soft-gate du rapport, l'outil reste 100 % ouvert) | `src/pages/VerificateurPage.tsx` | L'outil le plus chaud ne captait aucun lead ; générateur + diagnostic le faisaient déjà |
| P0-2 | **Témoignages fabriqués retirés** → voix honnête « membre fondateur » | `src/pages/ArtisansPage.tsx`, `src/pages/MetierPage.tsx` | « Karim B. · bêta-testeur » semblait inventé = pratique trompeuse (risque L121-2) |
| P0-3 | **Hero réécrit** : lead sur « facturation 2026 préparée par l'IA / vous validez », badge souveraineté (Mistral) + 0€, lien direct vers les outils gratuits | `src/pages/HomePage.tsx` | Ne plus vendre la commodité ; surfacer le différenciateur + les armes dès le hero |
| P0/AEO | **Section « Outils gratuits, sans compte »** sur la home (générateur / vérificateur / diagnostic) | `src/pages/HomePage.tsx` | Les gens ne savaient pas qu'ils pouvaient faire/vérifier une facture gratuitement |
| P1-8 | **Plafond d'amende ajouté** (« 50€/facture, 500€/e-reporting, plafond 15 000€/an ») | `src/pages/PricingPage.tsx` | Précision + honnêteté (chiffres 2026 vérifiés exacts, cf. loi de finances 19/02/2026) |

> ⚠️ **Témoignages** : remplacés par une voix première-personne honnête (« — L'équipe OdocPilot »).
> Dès que tu as un **vrai** retour client consenti (bêta CCI, etc.), remplace par une citation
> attribuée réelle (prénom + métier + ville) — c'est plus fort, et c'est honnête.

---

## 2. 🔴 P0 restant — action fondateur (le plus rentable)

1. **Amorcer 5–10 avis Capterra / Trustpilot** auprès des premiers utilisateurs (bêta CCI).
   Un « ⭐ 4,8/5 » indépendant est la seule preuve sociale crédible à ce stade et débloque le
   taux de conversion + (à terme) les sitelinks. Ne jamais inventer d'avis.
2. **Brancher Google Search Console** : soumettre `sitemap.xml`, demander l'indexation de
   l'accueil + /pricing + /e-facture + /fonctionnalites (le prérendu par route est en place,
   cf. `scripts/prerender-marketing.ts`). C'est le levier n°1 de visibilité de marque.
3. **Vraie capture d'écran produit** dans le hero (aujourd'hui : aperçu stylisé). « Show, don't tell ».

---

## 3. 🟠 P1 restant — à construire (specs prêtes)

### 3.1 Séquence email post-outil (5 mails) — *infra back-end requise (Stalwart + automatisation)*
Déclenchée quand un visiteur laisse son email sur un outil (générateur / vérificateur / diagnostic).
1. **Immédiat** : livrer le rapport/fichier demandé. 1 CTA doux : « Voir comment OdocPilot l'automatise (gratuit) ».
2. **J+2** : « Êtes-vous concerné par le 1ᵉʳ septembre 2026 ? » (pédagogie, réduit l'anxiété).
3. **J+4** : preuve — histoire du fondateur + souveraineté (Mistral/RGPD/AI Act) + (à terme) avis.
4. **J+7** : la démo « l'IA prépare, vous validez » (vidéo) + cadrage ROI (temps gagné vs saisie manuelle).
5. **J+10** : nudge vers le palier 0€ Conformité + reply-to direct du fondateur (« une question ? répondez »).
> Table `newsletter_subscribers` déjà alimentée par les outils (colonne `source` = generateur/verificateur/diagnostic).

### 3.2 Kit expert-comptable (canal prescripteur — le plus haut levier)
Un cabinet = des dizaines de clients. Créer un lead magnet « **Kit cabinet : préparez vos clients à 2026** »
(checklist + modèle d'email aux clients + récap réforme). Page dédiée `/cabinets-comptables` déjà existante
→ y ajouter le téléchargement (soft-gate email). Étudier le modèle **Axo-Néo** d'Axonaut (portail agréé en
marque blanche gratuit pour cabinets).

### 3.3 Démo « sur votre propre document » + vidéo
- Les outils gratuits SONT déjà la démo (« testez l'IA sur VOTRE facture ») — désormais surfacés au hero.
- Manque : une **vidéo 60–90s** de la boucle réelle « l'IA prépare → vous validez → facture conforme »
  (vraie UI). Sert aussi de top-of-funnel social/ads. À tourner par le fondateur.
- Optionnel : tour interactif (Storylane/Arcade) embarqué sur la home.

### 3.4 AEO/GEO — déjà bien couvert, reste 2 leviers
- ✅ FAQPage schema présent sur toutes les pages clés ; prérendu par route en place.
- ⏳ **Auteur nommé** sur les guides/blog (fondateur ou comptable partenaire + bio + LinkedIn) — pas « équipe éditoriale ».
- ⏳ **« Baromètre OdocPilot 2026 »** : petite étude originale (même 100–150 répondants TPE/PME) sur la
  préparation à la réforme. Les IA citent les données originales → meilleur levier GEO + matière « vu dans ».
  Version légère d'abord (sondage LinkedIn + form).

---

## 4. 🟡 P2 — plus tard
- Portail agréé en **marque blanche** pour cabinets (modèle Axo-Néo).
- **Tarif « membre fondateur »** garanti pour les inscrits avant le 01/09/2026 (vrai, daté, honoré).
- Cadence de contenu régulière sur les clusters (concerné ? / dates / mentions / PA vs OD / Factur-X) —
  **ne pas** viser 20 articles/mois (guerre de volume ingagnable contre les incumbents).
- `theme-color` HTML / favicon app à harmoniser (cf. mémoire brand).

---

## 5. ❌ À NE PAS faire (aussi important)
- ❌ **Titrer sur « conformité » / « gratuit »** : commodité donnée par 8 acteurs financés (Pennylane a levé 175 M€). Invisible.
- ❌ **Gonfler / inventer la preuve sociale** (faux avis, « +100k clients ») : les acheteurs cross-checkent. Mortel.
- ❌ **Passer en « réserver une démo » / vente assistée / gros budget pub** : ni l'équipe ni le budget. Rester product-led + SEO/AEO jusqu'à ~20 clients référents.
- ❌ **Faux compte à rebours / amendes exagérées** : la date 01/09/2026 est réelle, suffit. Le FUD tue la confiance des prescripteurs.
- ❌ **Sur-claim** (NF Z42-013, AES-256, SSO non implémenté, « #1 ») — déjà purgé, ne pas réintroduire.

---

## 6. Teardown concurrents (résumé, juin 2026)

| | Promesse hero | Offre | Preuve sociale forte | Reform play |
|---|---|---|---|---|
| **Pennylane** | « Réunit finances, compta & compte pro » | Essai 15j + plan 0€ | 350k entreprises, 3,5 Md€, ISO 27001 | Bannière « obligatoire 01/09/2026 » |
| **Qonto** | « Compte pro. Facturation. » | Essai 1 mois, pas de plan gratuit | 600k clients, **Trustpilot 4,8 / ~50k avis** | Lourd + PA propre |
| **Indy** | « Simplifiez bien plus que votre compta » | **0€ permanent** | 300k indés, **Trustpilot 4,8 / 13,5k** | « Passez gratuitement » |
| **Tiime** | « La facturation électronique 100% gratuite » | 0€ + essai 60j | 300k, profitable | Hero « PDF ≠ facture conforme » |
| **Sellsy** | « Tout-en-un pour piloter » | Démo + essai 15j, min 2 users | ISO 27001 + Scaleway FR | Remise an 1 |
| **Axonaut** | « Votre allié gestion simplifiée » | Essai 15j, 1 user | Trustpilot 4,6 / 1000+ | **Axo-Néo** (PA marque blanche cabinets) |
| **Abby** | « Facturation & compta indés » | 0€ + essai 14j | partenaire URSSAF | « gratuite + conforme 2026 » |
| **Dougs** | « L'expert-comptable en ligne » | Essai 30j, pas de 0€ | inscrit à l'Ordre | PA propre |

**Patterns gagnants** : free-tier comme aimant à leads · badges confiance (PA + ISO + France + étoiles) ·
échelle 3 dates (maintenant → 01/09/2026 réception → 01/09/2027 émission TPE/PME) · outils gratuits +
SEO programmatique · **canal expert-comptable** comme multiplicateur.

---

## 7. Sources clés
- 151 PA DGFiP juin 2026 : comparatif-facture-electronique.fr · liste off. impots.gouv.fr
- Sanctions loi de finances 2026 (50€/facture, 500€/e-reporting, plafond 15 000€/an) : infos-pa.com, fiducial.fr, l-expert-comptable.com
- Conversion/AEO 2026 : genesysgrowth.com, abstraktmg.com (gated vs ungated), enrichlabs.ai (GEO), firstpagesage.com (freemium)
- Concurrents : trustpilot.com (Qonto/Indy/Axonaut), maddyness (Pennylane 175M€), Axo-Néo (informatiquenews.fr)

---

## 8. Déploiement (rien n'est en ligne)
Branche `fix/no-trial-seo-prerender` (ce repo) → merger sur `main` puis **rebuild Docker `odoc-landing`**
sur le VPS (`git pull && docker build -t odoc-landing . && stop/rm/run` ; le `docker restart` seul ne
suffit pas — image figée). Cf. CLAUDE.md § Déploiement Landing.
