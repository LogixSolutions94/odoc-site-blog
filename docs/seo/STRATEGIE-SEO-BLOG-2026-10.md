# Stratégie SEO & Blog — Acquisition organique conformité e-facture

> **Date** : 2026-10-04 · **Auteur** : session Claude Code (chef de projet SEO) · **Statut** : diagnostic + plan d'action
> **Données** : Search Console (dépôt `odoc-seo-data`, relevé au ~28/09) · base Supabase `blog_posts` (live) · audit code `odoc-insights-hub` · état de l'art web (oct. 2026).
> **Objectif** : capter l'acquisition naturelle des TPE/PME qui cherchent à se mettre en conformité **avant 1er sept. 2026 (réception) / 1er sept. 2027 (émission + e-reporting)**. Fenêtre courte → il faut être impactant maintenant.

---

## 0. Verdict en une page

**La fondation technique est bonne, bien meilleure que ce que la doc interne laissait craindre.** L'alarme de `refonte/HANDOFF-DEPLOY.md:102` (« colonnes json_ld/schema_faq manquantes → articles invisibles ») est **périmée** : le prerender dérive tout du markdown (`select=*`, immunisé au drift) et le build est **fail-closed** (`STRICT_SEO_BUILD=1` → un prerender cassé fait échouer le déploiement, l'ancien site reste en ligne). Les articles publiés **ne sont pas invisibles**. Indexation : 67/68, sitemap propre, crawlers IA autorisés, JSON-LD Article+FAQPage+Breadcrumb servi.

**Mais trois problèmes brident tout le reste**, et ils sont corrigeables :

1. **Silos 100 % cassés par un décalage de colonne.** Le pipeline écrit `silo` (39/39), le site lit `category` (0/39). Résultat : aucune autorité thématique (hub & spoke), navigation par silo absente, maillage « à lire aussi » réduit à de la récence. *C'est le levier technique n°1.*
2. **Désalignement stratégique du contenu.** Le trafic actuel vient du **hors-wedge** (`mistral-ai-vs-openai` 325 impr, un article **Tunisie** 187 impr/8 clics — mauvais pays, aujourd'hui en 410, `gestion de stock TPE`…). Les requêtes **wedge conformité** où l'on est pourtant **bien placé** (« obligation pme facturation electronique » pos **1**, « facture electronique 2026 » pos **9,6**) ont **très peu d'impressions** : la vague arrive, on n'occupe pas encore le terrain.
3. **Maillage interne famélique.** **19/39 articles n'ont AUCUN lien interne.** Les pages de conversion (`/e-facture`, `/comparatif/*`) ne reçoivent quasi aucun jus du blog.

**CTR global 1,5 %** (hors-marque : 5 clics / 530 impr sur 28 j). Ce n'est pas une anomalie : en 2026, **48 % des requêtes** (et **82 % en B2B/tech**) déclenchent un **AI Overview** qui mange le clic. La parade n'est pas de mieux ranker, c'est d'**être cité dans l'AIO** (+35 % de CTR quand on l'est). On y est déjà sur des requêtes conversationnelles (pos 2-8) → c'est amplifiable.

**Priorités (détail §6)** : (A) réparer silos + metas via mapping de colonnes, (B) maillage interne vers piliers, (C) pivoter la production vers les clusters conformité où l'on rank déjà fin + angle auto-entrepreneur (aujourd'hui pos 83-90 !), (D) fiabiliser le pipeline (alerting fraîcheur, validation champs SEO), (E) corriger la bible SEO périmée (FAQ/HowTo).

---

## 1. Est-ce que nos blogs fonctionnent ? (état des lieux chiffré)

### 1.1 Trafic (Search Console, 28 j au 28/09)

| Indicateur | 28 j | 28 j préc. | Lecture |
|---|---:|---:|---|
| Clics | 34 | 13 | +162 %, mais volume faible |
| Impressions | 2 202 | 2 375 | stable |
| CTR | 1,5 % | 0,5 % | en hausse mais **très bas** |
| Position moyenne | 10,9 | 24,0 | **forte amélioration** |
| **Hors-marque** | **5 clics / 530 impr / pos 23,3** | — | le vrai signal « contenu » est faible |

Tendance 7 j inquiétante : **impressions +26 % mais clics −33 %** → on gagne en visibilité et on perd en clics = problème d'AI Overviews + titres/metas pas assez cliquables sur les bonnes requêtes.

### 1.2 Inventaire base `blog_posts`

- **39 publiés**, 103 **archivés**, 2 `pending_review` (144 lignes). Les archivés incluent d'anciennes pages encore indexées — **bien gérées** (ex. Tunisie → **410 Gone**, OCR fournisseur → **301**).
- Longueur : médiane **2 364 mots** (min 1 125, max 3 416) → conforme à la bible.
- **FAQ : 38/39** · **CTA : 32/39** (⚠️ 7-8 sans CTA, dont 2 des plus récents on-wedge : `e-reporting-2027-tpe-editeurs`, `mentions-obligatoires-facture-2026`).
- **Lien interne : 19/39 à ZÉRO.** Source d'autorité (gouv/INSEE/Bpi) absente sur 9/39.
- `cover_image_url` : 36/39 (3 sans visuel).
- `score_seo` auto-attribué par le pipeline : **moy. 88,6/100** — trop optimiste, il ignore les cassures ci-dessous.

### 1.3 Top pages (28 j) — le désalignement saute aux yeux

| Page | Impr | Clics | Pos | Aligné wedge ? |
|---|---:|---:|---:|---|
| `/blog/mistral-ai-vs-openai-entreprise-france` | 325 | 5 | 6,2 | ❌ IA générique |
| `/blog/facture-electronique-pme-tunisie…` | 187 | 8 | 6,2 | ❌ **mauvais pays** (archivé 410) |
| `/blog/ocr-facture-fournisseur…` | 151 | 0 | 21,4 | 🟡 OCR générique (archivé 301) |
| `/blog/chorus-pro-artisan-guide-complet-2026` | 66 | 0 | 8,2 | ✅ mais **0 clic** → titre/meta à retravailler |
| `/blog/facturation-electronique-obligatoire-2026-auto-entrepreneur` | — | — | voir §2 | ✅ mais mal classé sur les requêtes auto-ent |

**Conclusion** : le blog *fonctionne techniquement* (indexé, servi, bien structuré) mais *travaille pour le mauvais objectif*. Les meilleures pages ne servent pas le wedge conformité.

---

## 2. Analyse Google : ce que les gens tapent (et où l'on est)

Source : `odoc-seo-data/data/queries.csv` (28 j). On est **connecté à l'API GSC** via `gsc-sync.mjs` + GitHub Action quotidienne (`gsc-daily.yml`, runs **verts jusqu'au 04/10**). ✅ L'automatisation de mesure est fiable. *(Le clone local du dépôt data est à J-5 ; le remote est à jour.)*

### 2.1 Requêtes WEDGE où l'on est déjà bien placé mais peu visible (= à amplifier d'urgence)

| Requête | Impr | Pos | Opportunité |
|---|---:|---:|---|
| obligation pme facturation electronique | 1 | **1,0** | on est n°1, quasi 0 volume → la demande arrive |
| quelles obligations légales et dates clés… facturation électronique en france | 1 | **2,0** | requête conversationnelle (IA) |
| facture electronique 2026 | 7 | 9,6 | **cœur du wedge**, nouvelle, à pousser |
| facture electronique obligation 2026 | 1 | 8,0 | — |
| calendrier facturation électronique pme 2026 2027 | 4 | 38,2 | position à gagner |
| logiciel sécurisé d'envoi de factures électroniques | 7 | 8,6 | intention transactionnelle |
| validateur factur-x | 1 | 16 | on a l'outil `/verificateur` |

### 2.2 L'angle AUTO-ENTREPRENEUR : demande réelle, on est INVISIBLE (pos 83-90)

| Requête | Impr | Pos |
|---|---:|---:|
| facturation électronique auto entrepreneur | 5 | **84** |
| facture electronique auto entrepreneur | 1 | 84 |
| autoentrepreneur facturation électronique | 1 | 90 |
| facture électronique 2026 gratuit | 1 | 84 |

On a *un* article + une page `/auto-entrepreneurs` (indexée) mais on plafonne page 9. **C'est le plus gros gisement court terme** : segment qui panique, échéance émission 1er sept. 2027, concurrence (Qonto, Portail Auto-Entrepreneur, Pennylane) non imbattable sur la longue traîne.

### 2.3 On est déjà cité par les IA (GEO fonctionne) — à industrialiser

Beaucoup de requêtes conversationnelles longues nous placent **pos 2-8** :
- « quelle solution de facturation électronique recommandez-vous avec api + webhooks… (émis/reçu/rejeté/accepté) ? » pos 4,3
- « quelle plateforme agréée choisir pour une eti… doit être sérieuse » pos 6
- « besoin d'un outil automatisé pour gérer mes factures électroniques avant la fin du mois » pos 8

Ce sont des sorties d'assistants IA (ChatGPT/Perplexity/Gemini) : **notre contenu est déjà matière à citation**. C'est exactement ce qu'il faut renforcer (§3, §5).

### 2.4 Trafic hors-wedge (à ne pas cultiver, éventuellement à rediriger)

`mistral/openai` (plusieurs variantes, pos 3-8), `gestion stocks tpe` (pos 7-11), `webhook logiciel métier sur mesure` (41 impr, pos 4,6), OCR générique. **Décision à prendre** : laisser mourir, consolider, ou rediriger le jus vers les piliers wedge (§6-C).

### 2.5 Indexation — un point à traiter

`/guide/facturation-electronique-2026` = **« Explorée, actuellement non indexée »** : signal de contenu jugé redondant/fin par Google (chevauche `/guide/obligations-2026-2027` et `/e-facture`). → différencier ou consolider (canonical/redirect).

---

## 3. État de l'art SEO 2026 — ce qui marche vraiment

### 3.1 AI Overviews & GEO (le changement de paradigme)
- **48 % des requêtes** déclenchent une AIO ; **82 % en B2B/tech**. Une AIO fait **chuter le CTR de la pos 1 d'environ 58 %**. *(sources en annexe)*
- **Être cité dans l'AIO = +35 % de CTR** → l'objectif n'est plus seulement le rang, c'est la **citation**.
- Tactiques GEO qui marchent : **réponse dans les 200 premiers mots**, phrases courtes déclaratives « citables », **chiffres précis + dates**, tableaux et listes numérotées, entrer dans les **listicles canoniques**, **fraîcheur** (« Dernière mise à jour » + stats 2026), crawlers IA autorisés (✅ déjà fait dans `robots.txt`).

### 3.2 ⚠️ Corrections à apporter à notre bible `SEOBlog.md` (devenue partiellement fausse)
- **Google a supprimé les rich results FAQ le 7 mai 2026** (réservés gouv/santé). `SEOBlog.md` qui promet un « lift Featured Snippets 3,1× via FAQPage » est **périmé**. Le schema FAQPage reste utile — mais pour la **compréhension + citation IA (GEO)**, pas pour un encadré Google.
- **HowTo** : plus aucun rich result depuis 2023. Ne plus le présenter comme un levier d'affichage.
- Restent utiles (rich results réels) : **Article/BlogPosting, BreadcrumbList, Organization, Review, Product**.
- → Garder notre FAQ et nos atomic answers (valeur GEO réelle), mais **réécrire §8-9 de la bible** pour ne plus sur-vendre FAQ/HowTo.

### 3.3 E-E-A-T & core updates (mars + mai 2026)
Google repondère : **originalité de l'information**, **expertise de l'auteur**, **cohérence thématique**. L'**Experience** (vécu de première main) est le signal le plus dur à simuler. **L'IA n'est pas pénalisée** si le contenu est édité par un humain nommé et crédible, avec angle original. → notre article `factur-x-rejetee-9-erreurs-plateforme-agreee` (test réel en bac à sable, dates, sources gouv) est **le modèle à suivre**.

### 3.4 Concurrence « facturation électronique 2026/2027 »
- **Pennylane** domine l'informationnel (cluster dense `/fiches-pratiques/facture-electronique/`, autorité de domaine énorme). Imbattable en force brute.
- **impots.gouv / economie.gouv** trustent le réglementaire pur + **liste officielle des PA**.
- **Sellsy** domine les **listicles BOFU** (« 11 meilleurs logiciels », « 10 meilleures plateformes agréées »).
- **Qonto** (auto-entrepreneur), **Indy** (indépendant/gratuit), microsites comparateurs (« X vs Y », « PA IA »).
- **Gaps exploitables (personne ne les traite bien)** :
  1. **Micro en franchise de TVA** : exonéré de TVA **mais** concerné (réception 2026 / émission+e-reporting 2027) — confusion persistante.
  2. **E-reporting pratique** : quoi transmettre, quand, B2C + international — technique, peu vulgarisé.
  3. **Coût-bénéfice réel + transition pas-à-pas pour TPE sans comptable**.
  4. **L'angle « l'IA prépare, vous validez »** : possédé par **personne**. Les concurrents vendent une PA ou un logiciel, pas le **copilote qui prépare l'admin du dirigeant sans expert-comptable**. **C'est notre niche GEO.**

---

## 4. Calendrier légal officiel (vérifié oct. 2026 — à utiliser tel quel dans les articles)

Textes : **loi de finances 2026 (loi n° 2026-103 du 19/02/2026)**, **décret n° 2026-677 et arrêté du 27/07/2026**. **Aucun report** ; seule tolérance 2026 = sur l'application des **amendes**, pas sur les dates.

| Obligation | Grandes / ETI | **PME / TPE / micro (notre cible)** |
|---|---|---|
| **Réception** e-facture | 1er sept. 2026 | **1er sept. 2026** (toutes, sans exception) |
| **Émission** (e-invoicing) | 1er sept. 2026 | **1er sept. 2027** |
| **E-reporting** | 1er sept. 2026 | **1er sept. 2027** |

- Émission B2B + e-reporting **via une Plateforme Agréée (PA, ex-PDP)** ; le PPF (Chorus Pro) n'est plus concentrateur d'émission. **~150-166 PA** immatriculées.
- Sanctions e-reporting : **500 €/transmission, plafond 15 000 €/an**.
- Terminologie : **« plateforme agréée (PA) »**, plus « PDP ». Formats **Factur-X / UBL / CII** (EN 16931).
- ⚠️ **Garde-fous vitrine** (rappel) : OdocPilot **n'est pas** une PA (SuperPDP nommé, raccordement pas encore ouvert) ; **pas de client/témoignage inventé** ; « l'IA prépare, vous validez », jamais « l'IA exécute seule ».

---

## 5. La production de blogs est-elle fiable, robuste, performante ?

**Oui pour le déploiement, fragile pour le contenu.** Deux systèmes ont divergé : un **pipeline externe** (n8n + agent, côté `odoc-pulse`) écrit directement en base ; le **site** (ce repo) lit/prerende.

### 5.1 Ce qui est robuste ✅
- Build **fail-closed** (`Dockerfile STRICT_SEO_BUILD=1`) : prerender/sitemap cassé → build échoue → **ancien site préservé**. Swap bleu/vert avec health-check + rollback (`deploy-vps.sh`).
- Prerender défensif : `select=*` (immunisé au drift de colonnes), allowlist de slug, JSON-LD échappé (anti-XSS), parité JSON-LD/FAQ entre HTML crawler et SPA.
- Source unique de vérité pour les redirections (`seo/blog-redirects.json`) + test unitaire.
- **Cron quotidien 17:00 UTC** (`deploy.yml`) qui reprerende les articles publiés en base → ferme le trou « publié mais pas rebuildé » sous ~24 h.
- Mesure GSC automatisée et verte.

### 5.2 Fragilités (classées par gravité)

| # | Fragilité | Impact | Fichier/preuve |
|---|---|---|---|
| F1 | **Décalage colonnes pipeline↔site** : `silo`(39)→`category`(0), `meta_*`→`seo_*`(16/39) | **Élevé** — silos morts, 23 metas = excerpt | base live vs `src/lib/blogTaxonomy.ts`, `BlogPostPage.tsx` |
| F2 | **Vocabulaire de silos obsolète** côté pipeline (`logiciel-gestion-tpe-pme`, `crm-…`) ≠ wedge | Élevé | `silo` distinct de la taxo site & bible |
| F3 | **Cron de rebuild = SPOF de fraîcheur, sans alerting** (incident 31/07 : 84 publiés, 37 prerendus pendant 1 mois) | Élevé | `deploy.yml:29-45` |
| F4 | **Latence crawler ≤24 h + 404 dur** sur article frais (nginx `try_files … =404`, pas de fallback SPA) | Moyen | `nginx.conf:76-86` |
| F5 | **Ping Google mort** (`google.com/ping` retiré en 2023) → « indexation automatique » = mythe | Moyen | `publish-blog-post/index.ts:134` |
| F6 | **Aucune validation des champs SEO avant publication** (seo_description, OG image, FAQ, ≥3 liens internes) | Moyen | `publish-blog-post` create |
| F7 | **Doubles balises `<head>`** (prerender + react-helmet) → 2 canonical possibles pour crawler JS | Moyen | `prerender-blog.ts:205` vs `SEOHead.tsx` |
| F8 | **Templates d'INSERT faux dans la doc** (`cover_image` inexistant, `status` omis) | Moyen | `docs/DEVELOPMENT_GUIDE.md:122`, `docs/agents/blog-seo.md:28-50` |
| F9 | **Images in-body non rendues en `<img>`** dans le HTML crawler | Faible-moy | `prerender-blog.ts:87-96` |
| F10 | `sitemap.xml` committé **périmé** (8 routes + 15 slugs morts) ; health-check ne teste jamais un article ; tests non gated en CI | Faible-moy | `public/sitemap.xml`, `deploy-vps.sh:71` |

---

## 6. Plan d'action priorisé

Légende : **Impact** (🔴 fort / 🟠 moyen) · **Effort** (S/M/L) · **Repo** (L = ce repo landing, P = pipeline `odoc-pulse`, D = data, ⚖️ = décision/prod).

### A. Débloquer l'existant (quick wins techniques) — *semaine 1*
| Action | Impact | Effort | Repo |
|---|---|---|---|
| A1. **Réparer les silos** : faire lire `silo` par le site (fallback `category`) **+** standardiser un vocabulaire de silos aligné wedge | 🔴 | M | L (+⚖️ taxo) |
| A2. **Metas** : lire `meta_title`/`meta_description` en fallback de `seo_title`/`seo_description` (23 articles gagnent une meta optimisée) | 🔴 | S | L |
| A3. **Corriger `SEOBlog.md`** (FAQ/HowTo rich results morts ; recadrer sur GEO) + **corriger l'alarme périmée** `HANDOFF-DEPLOY.md:102` + **templates d'INSERT** faux | 🟠 | S | L |
| A4. Régénérer/commiter `sitemap.xml` ; ajouter un probe `/blog/<slug>` au health-check ; gater `vitest` en CI | 🟠 | S | L |
| A5. Corriger doubles `<head>` (F7) + images in-body prerender (F9) | 🟠 | M | L |

### B. Maillage interne & conversion — *semaine 1-2*
| Action | Impact | Effort | Repo |
|---|---|---|---|
| B1. **Injecter liens vers piliers** (`/e-facture`, `/guide/*`, `/comparatif/*`) dans les 19 articles orphelins (prioriser on-wedge) | 🔴 | M | ⚖️ prod |
| B2. **Liens horizontaux** intra-silo (hub & spoke) une fois A1 fait | 🔴 | M | ⚖️ prod |
| B3. Ajouter CTA aux 7-8 articles sans CTA | 🟠 | S | ⚖️ prod |
| B4. **Auto-lien d'entités** (règle : « plateforme agréée », « Factur-X », « e-reporting » → pilier) dans le pipeline | 🟠 | M | P |

### C. Pivot éditorial vers le wedge — *continu, à lancer tout de suite*
Construire **5 clusters conformité** (pilier + satellites), en exploitant les positions déjà tenues + les gaps concurrents. Modèle de qualité = `factur-x-rejetee…` (vécu + chiffres + sources gouv).

1. **Obligations & calendrier 2026/2027** (pilier `/e-facture` ou `/guide/obligations-2026-2027`) → satellites par segment : **auto-entrepreneur** (priorité absolue, on est pos 84 !), **micro en franchise de TVA** (gap), PME, BTP, commerce, profession libérale.
2. **Plateforme agréée (PA)** : « comment choisir », « se raccorder », « PA pour TPE sans comptable » — **honnête** (on n'est pas PA, SuperPDP partenaire). Créer **notre listicle** (format que Sellsy/LLM citent).
3. **Factur-X & formats** : doubler sur le vécu technique (on y est fort).
4. **E-reporting pratique** (gap) : quoi/quand transmettre, B2C, international.
5. **TPE sans comptable** : coût-bénéfice, transition pas-à-pas, l'angle **« l'IA prépare, vous validez »** (niche GEO non possédée).

Transverse : **BOFU comparatifs** (`/comparatif/*` existent et sont indexés — les lier depuis le blog + créer « alternative à … pour la facture électronique »). Appliquer partout : atomic answer <60 mots sous chaque H2-question, « Dernière mise à jour », chiffres/dates, auteur crédible nommé, 1 capture produit réelle.

**Cadence** : viser la qualité `factur-x-rejetee` plutôt que le volume. 3-5 articles wedge/semaine valent mieux que 15 articles larges. Réorienter la production du pipeline vers ces 5 clusters (aujourd'hui `silo` montre encore 7 `logiciel-gestion-tpe-pme`, 4 `automatisation-ia-pme`, 1 `crm` = hors sujet).

### D. Fiabiliser le pipeline — *semaine 2-3*
- D1. **Alerting fraîcheur** : comparer `count(status=published)` en base vs fichiers `dist/blog/*` vs URLs sitemap ; alerte si drift (prévient l'incident 31/07). (D/L)
- D2. **Rebuild à la publication** : le pipeline déclenche un `repo_dispatch` GitHub après publication → supprime la latence ≤24 h (F4). (P)
- D3. **Validation pré-publication** dans `publish-blog-post` : refuser si pas de meta description, pas d'OG image, pas de `## FAQ`, < 3 liens internes. (P)
- D4. Remplacer le ping Google mort par soumission GSC/sitemap recrawl + ne plus prétendre « indexation auto ». (P)

### E. Décisions attendues du dirigeant (⚖️)
1. **Taxonomie des silos** : adopte-t-on les 5 silos wedge de la bible, ou on garde le vocabulaire actuel du pipeline ? (Je recommande : **5 silos wedge** + un silo « Outils & gestion » pour le reste.) *Décision transverse aux 2 repos.*
2. **Back-catalogue hors-wedge** (stocks, CRM, Mistral/OpenAI…) : garder tel quel / consolider / noindex / rediriger vers piliers ?
3. **Backfill production** (category/silo, metas, liens internes sur les 39) : autorisation de modifier la base live (par script relu) ?

---

## 7. Ce que je peux exécuter immédiatement (ce repo, réversible via PR)
- A2 (metas fallback), A3 (corriger `SEOBlog.md` + alarme + templates), A4 (sitemap/health-check/CI), A5 (head/images) : **self-contained, additifs, sans risque**.
- A1 (silos) : implémentable dès que la taxo (E1) est tranchée.
- B1-B3 et backfill : touchent la **base de production** → nécessitent ton feu vert (script relu).
- D2-D4 : côté pipeline `odoc-pulse` (hors de ce repo) → à relayer à l'agent SEO.

---

## Annexe — sources état de l'art
Calendrier/juridique : economie.gouv.fr, impots.gouv.fr (guide pratique), compta-online (maj 24/09/2026), ebp, comparatif-facture-electronique. · SEO 2026 : stackmatix & thestacc & anymorph (AI Overviews/CTR), enrichlabs & mentionagent (GEO), evertune & willshall & semihuman (core updates), searchenginejournal & alevdigital (suppression FAQ rich results 07/05/2026), seotest.app (HowTo), relevantaudience (types retirés). · Concurrence : pennylane (fiches-pratiques), go.sellsy.com (listicles), qonto, decodeur-ia.
