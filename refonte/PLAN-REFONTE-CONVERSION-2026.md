# 🎯 PLAN DE REFONTE CONVERSION — odocpilot.com (tunnel de vente)

> **Statut** : plan validé (chef de projet IA), prêt à exécuter — **2026-06-13**
> **Méthode** : analyse multi-agents (16 agents) — vérité produit `odoc-pulse` + audit site `odoc-site-blog` + état de l'art mondial des landing/funnels SaaS + teardown concurrents FR + fact-check réglementaire + critique adversariale.
> **Objectif fondateur** : faire du site une **machine de vente** alignée sur le produit réel et sur le wedge conformité e-facture, agréable, simple, qui mène vite à l'inscription / au paiement. Être **le meilleur de France avant le lancement**.
> **À lire avant tout dev** : ce plan **remplace** le positionnement de `CLAUDE.md` (« OS d'entreprise / employé IA / 11 modules / 79€ ») qui est **périmé**.

---

## 0. TL;DR — le verdict en 10 lignes

1. **Repositionner tout le site sur le wedge conformité e-facture 2026/2027** (porte d'entrée par la douleur légale), pas sur « OS d'entreprise tout-en-un ».
2. **Différenciateur unique à marteler** : *l'IA qui FAIT l'admin pour le dirigeant de TPE* (créneau vide vs Pennylane=cabinet, Qonto=banque, Indy=compta TNS).
3. **Tunnel mono-CTA** vers un **lead magnet qui marche aujourd'hui** : le **générateur Factur-X gratuit sans compte** (n°1) + le **diagnostic conformité 3 min** (n°2). Ils **contournent les 3 bloqueurs produit** (email d'inscription cassé, billing inerte, transmission PA non branchée).
4. **Purger d'urgence les claims illégaux** (risque DGCCRF) : « conforme aujourd'hui », NF Z42-013, « opposable devant un tribunal », « Excel = risque pénal », chiffres inventés.
5. **Brancher la mesure** (Umami est en HTTP → **zéro donnée** remonte) — sinon toute la refonte est aveugle.
6. **Grille tarifaire honnête et unique** : Conformité 0€ / Pro 35€ / Business 69€ (4 grilles contradictoires aujourd'hui).
7. **Frontière de promesse IA** : « l'IA **prépare/suggère, vous validez en 1 clic** » — **jamais** « exécute seule » (le mode agentique est `BRAIN_AGENTIC=false` en prod).
8. **Preuve sans clients** : remplacer le vide social par textes officiels + hébergement France + **vraies captures produit** + bio fondateur + garantie.
9. **Capter l'intention d'achat malgré le billing mort** : offre **« Tarif fondateur bloqué à vie — réservez votre place »** (sans CB), au lieu de renvoyer un prospect chaud vers un quiz gratuit.
10. **Honnêteté stratégique** : tant que email + billing + transmission ne sont pas réparés, ce site est une **machine à leads qualifiés pré-revenu** (+ capture d'intention), pas encore un tunnel jusqu'au paiement. Le plan le dit et le prépare (plan de bascule).

---

## 1. Vérité produit (ce qu'on a le droit de vendre)

Source : lecture du code `odoc-pulse` + tests `marketing-promises`.

### ✅ Réel, fonctionnel, démontrable — **à mettre en avant**
- **Lecture / extraction IA de factures** (vision LLM, sans auto-approbation).
- **GED IA** : OCR, embeddings, **recherche sémantique en langage naturel** (vérifiée en prod), chat par document.
- **Génération Factur-X** (PDF/A-3 + XML CII, profils BASIC/EN16931/EXTENDED) — **câblée à un bouton de téléchargement**.
- **Export FEC** conforme DGFiP (18 colonnes, balance, nommage `<SIREN>FECyyyymmdd.txt`).
- **Brain** = copilote conversationnel **souverain** (Mistral, hébergé France) qui **répond sur vos données et suggère l'action**.
- **Agent Factures** (backend, en prod) : facture reçue par email → extraction → brouillon fournisseur + compte PCG proposé → **validation humaine** (jamais d'auto-approbation). Front dédié dormant, **QA à faire**.

### 🚫 Inerte / mock / non tenu — **interdit de vendre** (formuler « bientôt » ou retirer)
- **Transmission e-facture** via plateforme agréée → bouton « Configurer PDP » **mort** (sandbox).
- **Agrégation bancaire** (Powens) → l'API renvoie **501**. ⇒ pas de « rapprochement bancaire automatique ».
- **Onboarding email** → **emails de confirmation non délivrés** ⇒ un prospect **ne peut pas activer** son compte.
- **Mode agentique** « l'IA exécute seule » → `BRAIN_AGENTIC=false` par défaut en prod (Brain = réponse mono-passe, pas d'exécution autonome).
- **Billing** (Lemon Squeezy) → non câblé (503 si clés absentes), `BILLING_ENFORCED=false`.
- Modules à **données mortes/mock** : Budget (« 0% » à vie), SupplierDashboard (« Acme Corp »).
- Claims **FAKE** marqués par les tests : « 98% de précision », « NF Z42-013 / valeur probante », « SSO SAML », « API ouverte ».

> **Conséquence n°1 du plan** : le tunnel doit s'appuyer **uniquement** sur ce qui marche (générateur Factur-X, diagnostic, captures réelles) et **pré-cadrer honnêtement** ce qui arrive (transmission).

---

## 2. Positionnement (le nouveau message)

- **H1 (hero)** : « **Conformité facture électronique 2026, sans expert-comptable et sans prise de tête — vérifiez votre situation en 3 minutes, gratuitement.** »
- **Sous-titre** : « Dès le **1er septembre 2026**, toute entreprise devra **recevoir** ses factures au format électronique via une **plateforme agréée**. OdocPilot vous y prépare gratuitement, puis prend en charge votre administratif — lecture de factures, classement, relances — pendant que vous gérez votre activité. **Données hébergées en France.** »
- **Proposition de valeur** : le seul outil qui combine le **ticket d'entrée obligatoire** (conformité) ET le bénéfice que **personne ne vend au dirigeant de TPE** : une IA qui **prépare l'admin à sa place** — pas un logiciel de plus à apprendre, pas un comptable de plus à payer.
- **Cible (ICP)** : dirigeant de TPE / indépendant **sans expert-comptable au quotidien** (artisan/BTP, commerce & services, profession libérale). Débordé, non-technicien, inquiet de la réforme, veut que « ce soit géré ».
- **Différenciateurs** :
  1. L'IA **prépare l'admin pour le dirigeant**, pas pour son comptable *(créneau vide)*.
  2. Conformité e-facture **offerte à l'entrée**, sans CB, sans engagement.
  3. **Souveraineté réelle** : données **ET** IA (Mistral) en France/UE *(moat vs QuickBooks USA, Qonto/OpenAI)*.
  4. Prix **tout compris, sans coût par utilisateur** *(contre-pied au per-seat de Pennylane)*.
  5. **Pas de compteur de crédits IA surprise** *(contre-pied Sellsy/Mindee)*.
- **Ton** : bienveillant, anti-anxiogène, direct, concret. Langage de patron de TPE, zéro jargon. Urgence légale **authentique et datée**, jamais de fausse rareté.

### 🚫 Mots / claims BANNIS (jargon, façade, illégal, surpromesse)
`N8N` · `Ollama` · `Groq` · `OCR` · `self-hosted` · `OS d'entreprise` · `employé IA 24h/24` · `copilot` · `RAG/embeddings/pgvector` · `Smart Connectors / multi-agents autonomes` · `PDP` (→ dire **« plateforme agréée (PA) »**) · `UBL/CII/EN16931` (en façade) · `SHA-256/AES-256/PDF-A3` (en façade) · `X modules / 11 modules` · **`NF Z42-013 / valeur probante / opposable devant un tribunal`** · **`98% de précision`** · **`rapprochement bancaire automatique`** · **`transmission e-facture en 1 clic`** · `SSO SAML` · `99.9% uptime garanti` · chiffres non sourcés (`-5h`, `2x`, `-75%`, `8h/sem`, `1000 entreprises`) · **`Excel = risque pénal`** (comparatif dénigrant illicite) · **`l'IA exécute seule / autonome`** (non live).

---

## 3. Le nouveau tunnel de vente

**Points d'entrée** : SEO conformité (pages + blog en silos) · générateur Factur-X gratuit · diagnostic · cold email B2B légal (deadline) · co-marketing experts-comptables solos · home (bandeau d'urgence daté).

**Parcours cible** :
```
Trafic conformité
   │
   ▼
Page wedge /e-facture  ou  Home (bandeau urgence daté)
   │   CTA UNIQUE répété : « Vérifier ma conformité (3 min) » (in-place, jamais _blank)
   ▼
LEAD MAGNET N°1 — Générateur Factur-X gratuit SANS compte  ← aha-moment LIVE (60 s, prouve la techno)
   │  (+ LEAD MAGNET N°2 — Diagnostic conformité 3 questions → score + feuille de route datée)
   ▼
Capture email APRÈS la valeur (« recevez votre feuille de route / checklist »)
   │
   ▼
┌─ AUJOURD'HUI (bloqueurs non levés) ─────────────────────────────┐
│  • Compte freemium impossible (email cassé) → on NE pousse PAS   │
│    /auth. On capture le lead + on propose :                      │
│    « Réserver mon tarif fondateur (bloqué à vie, sans CB) »      │
│    → capture d'INTENTION D'ACHAT horodatée                       │
└─────────────────────────────────────────────────────────────────┘
        │  (quand email + billing réparés → bascule)
        ▼
Compte Conformité 0€ → reverse trial premium 14-30 j → upsell piloté usage → Pro 35€ / Business 69€
```

**Stratégie CTA** : **UN seul CTA primaire**, répété à l'identique (hero + mi-page + fin de sections + final). *(mono-CTA ≈ 13,5% vs ≈ 10,5% pour 5+ liens, Unbounce.)* CTA first-person bénéfice (« Vérifier ma conformité » > « S'inscrire ») + micro-copy anti-friction : **« Gratuit · Sans carte bancaire · Données en France »**. Supprimer les 3 CTA secondaires concurrents (`/pricing` ×2, `/e-facture`). Distinguer enfin `LOGIN_URL` (`/auth`) et `SIGNUP_URL`.

**Lead magnets** (par ordre de priorité) :
1. **Générateur Factur-X gratuit sans inscription** — *la seule démo produit live, indépendante de tous les bloqueurs.* C'est l'aimant n°1.
2. **Diagnostic conformité 3 min** (statut / secteur / comptable oui-non → score + feuille de route datée).
3. Checklist « 6 étapes pour être conforme avant sept. 2026 » (PDF + version cochable).
4. Vérificateur de mentions obligatoires.

**Capter l'intention d'achat malgré le billing mort** (correctif critique de la critique) :
→ Sur `/pricing`, sous les prix : **« Tarif fondateur bloqué à vie — réservez votre place (sans CB, sans engagement, facturé au lancement) »**. CTA « Réserver mon tarif » → email + plan choisi + horodatage. Transforme le mur du paiement en **signal de pricing réel** au lieu d'un cul-de-sac.

---

## 4. Instrumentation (P0 — aujourd'hui on est aveugles)

> Sans ça, **impossible de prouver le ROI ni d'A/B tester**. C'est le préalable à toute optimisation.

1. **Servir Umami en HTTPS** (`analytics.odocpilot.com`) — aujourd'hui `http://151.80.144.236:3002` → **mixed-content bloqué en prod → ZÉRO donnée**.
2. **Consentement cookies opérant** : ne charger Umami **qu'après acceptation** (RGPD + funnel). Aujourd'hui **décoratif** (non conforme CNIL).
3. **Plan d'événements funnel** : `view_efacture`, `view_pricing`, `facturx_generated`, `diagnostic_start/complete/email`, `reservation_submit`, `pricing_cta_pay_intent`, **`dead_end`** (clic payer sans pouvoir = mesurer le revenu perdu par le billing mort), `click_signup`, `newsletter_submit`, `contact_submit`, `scroll_50/90`.
4. **UTM cross-domain** propagés vers `app.odocpilot.com` (rattacher les conversions SaaS).
5. Objectif chiffré : sortir de la médiane SaaS **3,8%** vers le quartile **>11%** via A/B (titre, longueur formulaire, ordre sections).

---

## 5. Plan de site (sitemap) — créer / refondre / fusionner / supprimer

| Page | Étage | Action | Rôle |
|---|---|---|---|
| `/` | TOFU | **refondre** | Hero conformité + différenciateur exécution → diagnostic/générateur |
| `/e-facture` | MOFU | **refondre (urgence)** | **PAGE PILIER** du wedge. Pédagogie honnête + lead magnets. Aujourd'hui hors sitemap/footer + claims illégaux |
| `/generateur-factur-x` | conversion | **créer** | Lead magnet **n°1**, aha-moment live sans compte |
| `/diagnostic` | conversion | **créer** | Lead magnet n°2, quiz 3 questions (convertit 15-25%) |
| `/fonctionnalites` | MOFU | **refondre** | Recentrer sur le RÉEL ; marquer « bientôt » le bancaire/transmission |
| `/pricing` | BOFU | **refondre** | Conformité 0€ / Pro 35€ / Business 69€ + offre fondateur |
| `/artisans` `/commerce` `/professions-liberales` | MOFU | **refondre + indexer** | Verticales → reconvertir vers `/diagnostic`. Orphelines aujourd'hui |
| `/cabinets-comptables` | TOFU | **refondre** | **Canal de co-marketing** (EC solos), pas ICP de 1er rang. Retirer du routeur home |
| `/blog` `/blog/:slug` `/blog/categorie/:silo` | TOFU | **refondre + créer** | Silos SEO conformité. **Bug bloquant à corriger** (0 article prerendu) |
| `/a-propos` | MOFU | **refondre** | Confiance fondateur (preuve n°1 en pré-lancement). Retirer KPI gonflés |
| `/contact` | BOFU | **refondre** | + « Demander une démo / Être prévenu au lancement » (CTA de secours) |
| `/roadmap` `/changelog` | MOFU | **refondre/nettoyer** | Build-in-public (atout confiance). Retirer jargon |
| `/mentions-legales` `/cgu` `/politique-confidentialite` | légal | **garder + corriger** | Documenter garantie 30j + limites du gratuit + consentement réel |
| `/recrutement` | TOFU | garder | Retirer « futur OS des entreprises ». Faible priorité |

---

## 6. Plans page par page (essentiels)

### `/` Home
Bandeau urgence daté (style Pennylane) → **Hero** (H1 résultat + sous-titre qui/quoi/pourquoi + CTA unique + micro-copy + **vraie capture WebP**, pas le faux dashboard `12 480€/Camille`) → barre de réassurance souveraineté France/RGPD → **Problème** (ce que la réforme change pour une TPE sans comptable + PPF abandonné → PA obligatoire) → **Solution 3 étapes** (diagnostic → conformité → l'IA prépare : lecture/classement/relances) → **Différenciateur** (« l'IA prépare l'admin à votre place », ciblage explicite, contraste cabinet/banque/compta-TNS) → **CTA répété à mi-page** (manquant aujourd'hui) → **Preuve honnête** (captures + fondateur, retirer le disclaimer qui sabote + chiffres bidon) → Teaser tarif (« Conformité gratuite, puis à partir de 35€/mois, sans coût par utilisateur ») → **FAQ objections** → **CTA final** + capture email diagnostic.
> Corriger en priorité : tous les CTA pointent vers `/auth` en `_blank` → `/diagnostic` in-place. Retirer « Toute la gestion de votre entreprise. Sans la paperasse. ». Unifier marque OdocPilot.

### `/e-facture` — PILIER WEDGE (refonte d'urgence)
Hero question directe + **double compte à rebours** (réception 01/09/2026 · émission TPE 01/09/2027) + « Mettez-vous en conformité en 10 min, gratuitement » → CTA `/diagnostic` → **Pourquoi maintenant** (PPF abandonné le 15/10/2024 → plateforme agréée privée obligatoire, calendrier exact) → **Qui est concerné** (toutes, même micro) → **Sanctions** en ton factuel non-anxiogène (**50€/facture non conforme, 500€/manquement e-reporting** — *une seule source à jour, ne pas mélanger plafonds entreprise/plateforme*) → **Lead magnets empilés** → **Réassurance** (« basé sur les textes officiels » + liens impots.gouv.fr/France Num + données France + **encart transmission honnête**, voir §7) → Différenciateur → FAQ pédagogique → CTA final.
> **RETIRER** : « conforme aujourd'hui/dès le 1er jour », NF Z42-013, « opposable devant un tribunal », « -75%/2h/jour », « élimine la fraude », « Excel = risque pénal ». Refondre techniquement (MotionDiv + tokens, retirer les 29 `style` inline + couleurs hardcodées). Ajouter au sitemap + footer.

### `/generateur-factur-x` — LEAD MAGNET N°1
Formulaire facture minimal → génération PDF + XML conforme (profil BASIC, **existe réellement**) → contrôle des mentions obligatoires → capture email **après** téléchargement → bascule freemium. **Ne JAMAIS** proposer la transmission (bouton « Configurer PA » mort).

### `/diagnostic` — LEAD MAGNET N°2
Barre de progression → Q1 statut · Q2 secteur · Q3 expert-comptable oui/non → **Résultat** (score prêt/pas-prêt + ce qui s'applique + plan daté 3 étapes) → capture email **après** la valeur → bascule freemium. Instrumenter chaque étape.

### `/pricing`
Toggle mensuel/annuel (-20%, « 2 mois offerts », annuel présélectionné) → **Conformité 0€** (appât) / **Pro 35€** (28€ annuel, badge « Le plus choisi », centre) / **Business 69€** (55€ annuel, ancrage haut) → « Besoin de plus ? Nous contacter » (pas un 4e plan) → **Ancrage douleur** (coût non-conformité à côté du « Gratuit ») → réassurance (« 14j sans CB », garantie 30j **si réellement opérante**, « sans coût par utilisateur », « pas de compteur de crédits IA ») → **Offre fondateur** (réservation tarif bloqué) → FAQ pricing.
> Supprimer 49/89/149 et « Manager ». **Synchroniser** HomePage teaser + JSON-LD + index.html (3-4 grilles contradictoires). Tier gratuit = **uniquement du réel**. Tant que billing/email cassés : afficher la grille mais router le CTA vers diagnostic + réservation.

*(Détail des autres pages : verticales, cabinets, blog, à-propos — voir §5 et le résultat workflow.)*

---

## 7. Honnêteté = arme de conversion (correctifs de la critique adversariale)

La cible est **inquiète**, pas cynique : l'honnêteté **rassure** et nous différencie. Trois garde-fous transversaux :

1. **Frontière de promesse IA** — partout : « L'IA **lit vos factures, les classe, prépare le travail — vous validez en 1 clic** ». Jamais « exécute seule / autonome » (`BRAIN_AGENTIC=false`). C'est **vrai** (Agent Factures backend + GED + Brain) **et** ça reste un créneau vide.

2. **Encart « transmission » réutilisable** — wording unique, répété à l'identique sur `/e-facture`, résultat `/diagnostic`, `/pricing`, FAQ :
   > « **Aujourd'hui** : générez vos factures au format légal Factur-X + diagnostic + checklist. **Transmission via plateforme agréée partenaire : raccordement en cours, vous serez prêt le jour J.** »
   Supprime le risque déceptif **et** DGCCRF, transforme la limite en preuve d'honnêteté.

3. **Pile de réassurance non-sociale** (on n'a ni clients ni avis) : (1) « basé sur les textes officiels » + liens impots.gouv.fr/France Num ; (2) données **et** IA hébergées en France ; (3) **4-6 captures produit irréprochables** (extraction facture, GED IA, Brain sourcé, Factur-X, FEC) — la preuve par la démo remplace la preuve sociale absente ; (4) garantie 30j si opérante ; (5) photo + bio fondateur. Le « build-in-public » reste sur `/a-propos` + `/roadmap`, **pas** comme preuve du hero.

**FAQ objections qui tuent la vente** (à couvrir explicitement) : « Et si j'ai déjà un logiciel ? » (migration), « Ça transmet vraiment mes factures à l'administration ? » (→ encart transmission), « Combien de temps pour être opérationnel ? », « Que se passe-t-il à la fin du gratuit ? » (→ **reverse trial honnête** : « vous repassez en Conformité gratuit, sans blocage, sans perte de données »), « Compatible avec mon expert-comptable ? » (→ export FEC réel).

---

## 8. Faits réglementaires (fact-checkés — utilisables publiquement)

| Fait | Statut | Usage |
|---|---|---|
| **Réception** obligatoire **01/09/2026** (toutes entreprises assujetties TVA, même micro) + émission GE/ETI | ✅ confirmé (sources .gouv.fr) | **Socle du wedge** |
| **Émission + e-reporting** TPE/PME/micro **01/09/2027** | ✅ confirmé | Wedge |
| **PPF abandonné le 15/10/2024** → plateforme privée agréée **obligatoire** | ✅ confirmé | **Meilleur argument d'incontournabilité** |
| Sanctions loi de finances 2026 : **50€/facture**, **500€/e-reporting** (clémence 30j) | ✅ montants unitaires confirmés | Utiliser avec prudence, **ne pas mélanger** plafonds entreprise (15 000€) et plateforme (100 000€) |
| **~130+ plateformes agréées** (134-136 mi-2026) | ✅ corrigé | Écrire « +130 plateformes agréées (DGFiP, 2026) » — **pas** « 70+ » (périmé) |
| Terminologie **« Plateforme Agréée (PA) »** (depuis juillet 2025) | ✅ | Remplacer « PDP » partout, « (ex-PDP) » une fois |

> ❌ **NE PAS utiliser** : 15€/250€ (anciens montants), plafond 45 000€ (régime plateforme périmé). **Chiffres concurrents** (Pennylane 3,5 Md€, Indy 4.8/13000 avis, etc.) = **benchmark interne uniquement**, jamais sur le site. **Stats de conversion** (Unbounce 3,8%, mono-CTA 13,5%) = justification de design, pas affichage public.

---

## 9. Roadmap par lots

### 🔴 LOT 0 — Quick wins « hygiène » (jours, à faire en premier)
- CTA → `/diagnostic` **in-place** (retirer `_blank`) au lieu de `/auth` nouvel onglet — *fuite n°1*.
- **Umami en HTTPS** (sinon zéro donnée).
- Purger les claims **DGCCRF** les plus à risque (« conforme aujourd'hui », NF Z42-013, « opposable », « Excel = risque pénal »).
- `/e-facture` au **footer + sitemap** (pilier orphelin).
- **Unifier la marque** OdocPilot (corriger « Odoc » sur EFacture/APropos/Roadmap/Changelog/Contact/Recrutement + JSON-LD).
- Synchroniser les prix (retirer 3 grilles contradictoires) → afficher « Conformité gratuit + à partir de 35€ ».
- Remplacer le faux dashboard hero par une vraie capture / visuel honnête.
- Micro-copy réassurance sous CTA + retirer le disclaimer qui sabote + chiffres non sourcés.
- **OG image PNG** 1200×630 (le SVG casse tous les partages).
- CTA répété à mi-page de la home.
- Corriger le **calendrier réglementaire** partout (01/09/2026 / 01/09/2027 + PPF abandonné).

### 🟠 LOT 1 — Débloquer le funnel + mesure + landing wedge (le cœur)
- Construire **`/generateur-factur-x`** (lead magnet n°1, aha live).
- Construire **`/diagnostic`** (lead magnet n°2).
- **Refonte d'urgence `/e-facture`** (claims + technique + encart transmission).
- **Brancher la mesure** complète (consentement opérant + plan d'événements + UTM cross-domain + **instrumentation du mur de paiement**).
- Corriger le **bug prerender blog** (SELECT colonnes inexistantes → 0 article prerendu, invisibles Google/IA).
- Repositionner le **hero Home** sur la conformité + différenciateur « prépare, vous validez ».
- Ajouter les **4 verticales au sitemap** + reconversion vers `/diagnostic`.

### 🟡 LOT 2 — Grille tarifaire + offre fondateur + preuve produit
- Refondre **`/pricing`** (Conformité/Pro/Business + ancrage douleur + garantie si opérante).
- **Offre « Tarif fondateur »** (réservation, capture d'intention d'achat).
- **4-6 vraies captures produit** WebP (jamais Budget/SupplierDashboard/panneaux non montés).
- Pile de réassurance non-sociale + FAQ objections complète + frontière de promesse IA partout.
- Synchroniser la grille (HomePage + JSON-LD + index.html + **aligner le SaaS in-app**, masquer le bandeau « prix 0€ Stripe non configuré »).
- Retirer « Cabinets comptables » des ICP de 1er rang → page partenaire.
- **Écrire le « plan de bascule bloqueurs levés »** (voir §10) comme livrable.

### 🟢 LOT 3 — SEO silos, design system, perf/CWV, A11y, mobile, A/B
- Réécrire **`CLAUDE.md` + `SEOBlog.md`** autour du wedge (avant toute nouvelle génération d'articles).
- **5 silos SEO** alignés + pages catégorie indexables + maillage pilier-cluster auto → `/e-facture` + `/pricing`.
- robots.txt **bots IA** (GPTBot/ClaudeBot/Google-Extended) + IndexNow + GSC + sitemap dynamique + pagination serveur blog.
- Harmoniser JSON-LD (BlogPosting + auteur unique + BreadcrumbList + FAQPage 1er niveau `/e-facture`).
- **Unifier le design system** : supprimer les couleurs hardcodées (CTA SiteHeader, Logo, HeroParticles, ORANGE/PETRIOL EFacture) + 29 `style` inline → tokens.
- Theming (prefers-color-scheme, CSS mort, theme-color par media, fix saut ThemeToggle), fonts (Satoshi/Inter, preload woff2).
- **A11y** (focus-visible, `useReducedMotion`, piège focus + Échap menu mobile).
- **Mobile** (barre CTA sticky bas, vrai mobile-first).
- **Perf/CWV** (manualChunks, rehype-highlight dynamique, retirer libs UI inutilisées, passer LCP/INP/CLS).
- **A/B tests** séquentiels (titre, CTA, micro-copy, ordre sections) → quartile >11%.

---

## 10. Plan de bascule « bloqueurs levés » (à écrire en LOT 2)

Le site tourne en **mode contournement** tant que email + billing + transmission sont cassés. Documenter le switch :
- **Jour où l'email d'inscription est réparé** → les CTA repassent de `/diagnostic` à **signup direct** (un seul flag à flipper — `LOGIN_URL`/`SIGNUP_URL` déjà distingués).
- **Séquence de nurturing** vers les leads diagnostic déjà collectés : J0 feuille de route · J3 générateur · J7 offre fondateur.
- **Jour où Lemon Squeezy est branché** → activer l'offre fondateur réservée + page payante.
- **Aligner le SaaS in-app** : supprimer le bandeau « prix 0€ Stripe non configuré », afficher Conformité/Pro/Business (sinon contradiction frontale avec le site).

> ⚠️ **Dépendance externe** : ce site est la moitié « GTM machine ». L'autre moitié = la session **« Sellability »** côté `odoc-pulse` (réparer onboarding email, activer billing, brancher la transmission via PA partenaire). Le site peut **lancer l'acquisition sans elle** (diagnostic + générateur + réservation), mais le **revenu** attend la réparation des bloqueurs.

---

## 11. Risques à garder en tête
- **Légal/DGCCRF (élevé)** : purger les claims trompeurs **avant tout trafic**.
- **Funnel** : ne pas pousser `/auth` (signup) tant que l'email est cassé → brûle le prospect.
- **Promesses inertes** : transmission / bancaire / archivage probant = « bientôt », jamais « disponible ».
- **Mesure aveugle** : Umami HTTP + consentement décoratif = refonte non mesurable (P0).
- **Parité SEO** : Tiime / FacturConform / mafactureconforme occupent déjà « conformité » → notre delta défendable = **« sans expert-comptable » + IA qui prépare**, à mettre en **première ligne**, pas en second bloc.
- **Produit en retard sur la promesse** : si le site promet « premium », l'UX SaaS (MVP) doit suivre, sinon déception à l'activation.

---

## 12. Sources
- Résultat workflow complet (16 agents) : `tasks/wa7e4esqy.output` (transcript session).
- Mémoire stratégique : `[[odoc-strategie-gtm-2026]]`, `[[odoc-site-blog-repo]]`, `[[odoc-uxui-nextgen-refonte]]`.
- Faits réglementaires : economie.gouv.fr, impots.gouv.fr, data.gouv.fr (liste PA), daf-mag.fr (sanctions PLF 2026).

*Document généré le 2026-06-13 — chef de projet IA. À mettre à jour à chaque lot livré.*
