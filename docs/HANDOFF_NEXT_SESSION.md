# Handoff : vitrine odocpilot.com, refonte en ligne, suivi Google quotidien

**Mis à jour :** 05/10/2026 · **`main`** du site : PR #41, #42, #43 fusionnées (déblocage SEO silos/metas/maillage, corrections docs/bible, /editeurs sans prix).
Côté SaaS `odoc-pulse` : **PR #82 fusionnée** (page d'inscription réalignée). Pas de branche ouverte côté site.

> Lire d'abord `AGENTS.md` (identité légale, conventions), puis ce fichier. Avant de toucher une page :
> `docs/design/REFONTE-2026-09.md` (système visuel, classes, affirmations autorisées et interdites).

> **🎯 Cap stratégique (audit + plan du 29/09, dossier privé `../plan-attaque-2026-09/`) :** le site
> est bon (note **82/100**) et convertit quand on y arrive ; **le goulot n'est plus le design mais le
> trafic** (hors marque : ~5 clics / 28 j). Prochaine bataille = distribution (SEO de contenu sur les
> requêtes qui montent + un canal d'acquisition licite). Détail : `AUDIT-SITE-2026-09-29.md` et
> `PLAN-FINAL-2026-09-29.md`. **La métrique à suivre = clics hors marque** (`odoc-seo-data/RAPPORT.md`).

## 🚀 Session 04-05/10/2026 — chantier SEO & blog (déblocage technique + stratégie)

**Diagnostic complet** : `docs/seo/STRATEGIE-SEO-BLOG-2026-10.md`. **Briefs éditoriaux** : `docs/seo/BRIEFS-ARTICLES-WEDGE-2026-10.md`.

Constat clé : **deux systèmes ont divergé**. Le pipeline (`odoc-pulse`, n8n) écrit un schéma riche dans `blog_posts` (`silo`, `meta_title`, `meta_description`, `json_ld`…), mais le site lisait des colonnes plus anciennes (`category` **vide sur 39/39**, `seo_*` sur 16/39) → silos/clustering morts, 23 metas = excerpt. **Corrigé en code, sans écrire en base** (PR #41) : le site lit maintenant `silo`/`meta_*` en repli. L'alarme « prerender invisible » (`HANDOFF-DEPLOY.md:102`) était **périmée** (select=* + dérivation markdown + build fail-closed). `src/integrations/supabase/types.ts` reste périmé vs le schéma live (voir memory `blog-schema-two-systems-drift`).

**Ce qui reste (hors de ce repo — à relayer à l'agent SEO `odoc-pulse`)** :
1. **Aligner le vocabulaire des silos du pipeline** sur les 6 du site (facturation-electronique, obligations-2026-2027, plateforme-agreee, factur-x, tpe-sans-comptable, outils-gestion), sinon les nouveaux articles retombent en « Outils & gestion ». Mapping côté site : `src/lib/blogTaxonomy.ts` (`SILO_SOURCE_MAP` + `SLUG_SILO_OVERRIDE`).
2. **Fiabiliser le pipeline** : alerting fraîcheur (count publié vs prérendu vs sitemap), rebuild à la publication (repo_dispatch), validation des champs SEO avant publi, remplacer le ping Google mort. Détail : stratégie §6-D.
3. **Produire les articles wedge** (briefs prêts), priorité **auto-entrepreneur** (pos 83-90 pour une forte demande) et **franchise de TVA** (gap que personne ne traite).

**État de l'art corrigé dans `SEOBlog.md`** : les rich results **FAQ (07/05/2026) et HowTo (2023) sont supprimés** → la FAQ ne sert plus qu'au **GEO** (citation IA), plus au Featured Snippet.

---

## ✅ En ligne

| PR | Contenu |
|---|---|
| #21 | Relance SEO (autre session) : www → apex en 301, articles retirés en 301/410, vraies 404 sous `/blog`, prérendu des pages marketing (`scripts/prerender-pages.ts`), page `/editeurs` |
| #22 | Légal : mentions, CGU, confidentialité, `llms.txt` à l'identité EI. Directeur de la publication **« M. Brahimi R. »** (remplace « Lucas Belloc », prénom fictif). Fin de « Logix Solutions SASU » |
| #24 | Déploiement fiable : `scripts/deploy-vps.sh` exécuté d'un bloc, avec retour arrière si le nouveau conteneur est KO |
| #25 à #27 | Article retiré (410), témoignages non vérifiés et promesses fausses retirés, plafonds réels sur les tarifs |
| #28 | Thème : script externe `public/theme-init.js` (le script inline était bloqué par la CSP de prod) |
| #30 | **Refonte « Papeterie »** (25/09) : accueil « Facture électronique : soyez en règle, simplement. », tarifs, À propos (limites écrites), contact, facture électronique, guides, lexique, blog, 404, en-tête, pied de page, cookies |
| #31 | Accessibilité : `MotionDiv` lit `prefers-reduced-motion` dès le premier rendu (animations coupées en plein vol, 4 px de débordement sur `/diagnostic` en mobile) |
| #33 | **Page `/auto-entrepreneurs`** : facture électronique en franchise de TVA, exemple de facture annotée, 4 étapes, 7 questions (FAQPage), prérendu complet (1 244 mots), liens depuis l'accueil, le pied de page et /e-facture |
| #34 | Confidentialité : tous les sous-traitants affichés (Supabase, Resend, Stripe remis à côté d'OVH, Mistral, Lemon Squeezy, Google/Dropbox), décision de Riad |
| `d3f19a2` | **SEO technique + blog** : accueil inclus dans `prerender-pages`, H1/intro/liens internes en HTML brut, header/footer renforcés vers outils/guides/comparatifs/`llm-info`, nettoyage de 9 articles blog hors positionnement via 301/410 |
| #39 | **Demandes du 29/09** : logo noir et blanc qui tourne (`Logo.tsx`, icônes, `og-image.png`), mot-symbole « OdocPilot® », un mot clé surligné par titre (`<KeyMark>`), pied de page « … par Redsun Studio® Paris. », **SuperPDP nommé** comme plateforme agréée partenaire (raccordement de production toujours « pas encore ouvert »), images des articles dans le blog, articles lisibles en mode sombre (`html .prose`), 9 articles retirés masqués de /blog (`src/lib/retiredPosts.ts`) |
| #40 | **Accueil mobile raccourci** (~20 000 → ~17 900 px) : sur mobile, la section produit garde la fenêtre animée + tout le texte mais masque les 4 illustrations secondaires (`hidden lg:block`) ; padding vertical des sections réduit sur mobile (`py-14 sm:py-20 lg:py-28`). Desktop inchangé. |
| #41 | **Déblocage SEO** (04/10) : le site lit `silo`/`meta_*` du pipeline (silos enfin actifs : 6 filtres sur /blog, metas optimisées sur 23 articles), **maillage interne auto** vers les piliers au rendu (19 orphelins corrigés), « à lire aussi » par silo. 100 % code, zéro écriture en base (`resolveSiloSlug`/`pickSeo*`/`autoLinkInternal`). |
| #42 | **Docs/bible** : `SEOBlog.md` corrigé (rich results FAQ/HowTo morts → GEO), alarme `HANDOFF-DEPLOY.md:102` périmée corrigée, templates d'INSERT alignés sur le schéma live, briefs éditoriaux wedge. |
| #43 | **Page `/editeurs` sans prix** : les 2 formules chiffrées (490/1 500) remplacées par un **catalogue de 12 modules/offres sans tarif** (marque blanche, raccordement PA, lecture IA, agents, modules sur mesure), hero + SEO élargis à l'intégration éditeur, test de non-régression « sans prix ». |
| `odoc-pulse` #82 | **Page d'inscription du SaaS réalignée** sur le message du site : fini « back-office / compta-tréso-RH / 52 actions » ; désormais « L'IA prépare votre facturation. Vous validez. », Factur-X, IA française (Mistral). Fusionnée le 29/09, redéployée par Coolify. |

**Base de données du blog (29/09)** : les 9 articles hors positionnement (redirigés 301/410) ont été
passés en `status='archived'` dans Supabase de prod (via SSH VPS → `docker exec supabase-db-… psql`).
Il reste **34 articles publiés**, cohérent avec `/blog` et le sitemap. La liste des slugs retirés fait
foi dans `seo/blog-redirects.json` (lue au runtime par `src/lib/retiredPosts.ts`).

**Système « Papeterie »** : papier blanc, encre pétrole. L'orange est le *surligneur* (ce que l'IA
prépare), l'encre et le *tampon* sont ce que VOUS décidez. Police Switzer (Fontshare, autorisée par
la CSP). Scène de l'accueil : `src/components/home/InvoiceScene.tsx` et `Stamp.tsx`. Sources uniques
des liens, prix, essai et éditeur : `src/lib/marketing.ts`. Typographie française : `fr()` dans
`src/lib/typo.ts`.

## 📈 Suivi Google (Search Console)

- **Dépôt privé [`LogixSolutions94/odoc-seo-data`](https://github.com/LogixSolutions94/odoc-seo-data)** : chaque jour à 05:30 UTC, une tâche GitHub interroge Search Console et enregistre l'historique jour par jour (`data/daily.csv`, 16 mois), les requêtes et pages sur 28 jours comparées aux 28 précédents, le trafic hors marque, les pages clés, et le rapport **`RAPPORT.md`**. Privé car le dépôt du site est public.
- **En service depuis le 25/09** : secret `GSC_SERVICE_ACCOUNT_JSON` posé (clé du compte de service `odocpilot1@odoc-copilot`, copiée du serveur avec l'accord de Riad). Premier relevé : 170 jours d'historique, 114 requêtes, 125 pages. Sur 28 jours : 31 clics (contre 11), 2 054 impressions (-15 % après le retrait de 94 articles le 24/09), position moyenne 11,2 (contre 25,2). Hors marque : 4 clics, 477 impressions.
- Indexation demandée le 25/09 dans Search Console pour `/auto-entrepreneurs`, `/`, `/e-facture` et `/pricing`.
- **Indexation suivie chaque jour depuis le 29/09** : le relevé inspecte chaque URL du sitemap (API d'inspection d'URL) ; `RAPPORT.md` affiche « X pages indexées sur Y », la colonne « Indexée » des pages clés et les pages non indexées par motif (`data/index.csv`). Le 29/09 : **67 sur 68**, seule `/guide/facturation-electronique-2026` est « explorée, actuellement non indexée ».
- Côté SaaS, `seo-insights` (`gsc_sync`, lundi 07:00 UTC) continue de suivre les articles du blog dans `seo_page_metrics`.

## 🧾 État SEO/blog vérifié le 29/09

- **Live** : `https://odocpilot.com/`, `/blog`, `/e-facture`, `/auto-entrepreneurs`, `/pricing`, `/llm-info`,
  `/guide/plateforme-agreee`, `/generateur-factur-x`, `/verificateur` répondent 200 ; `www.odocpilot.com`
  redirige en 301 vers l'apex.
- **Sitemap live après déploiement** : 68 URL, dont 34 articles blog, 5 guides, 6 comparatifs, 5 pages métiers, 4 outils/ressources.
- **Blog live** : articles prérendus actifs en 200 ; exemple vérifié :
  `/blog/factur-x-rejetee-9-erreurs-plateforme-agreee` sert un HTML d'environ 30 ko avec title article.
- **Redirections blog live** : les anciens slugs majeurs répondent correctement, par exemple
  `/blog/odocpilot-vs-pennylane-2026` → 301 `/comparatif/pennylane`.
- **Nettoyage déployé** : 103 entrées dans `seo/blog-redirects.json` (76 × 301, 27 × 410). Les 9 articles
  hors positionnement ont disparu du sitemap live : Tunisie, agricole, RH, congés payés, procuration bancaire,
  onboarding salarié, webhooks/API, vieux « Odoc Pulse tout-en-un », ERP vs SaaS généraliste.
  Vérifications live : `/blog/copilot-ia-gestion-entreprise-tpe-pme` → 301 `/fonctionnalites`,
  `/blog/facture-electronique-pme-tunisie-obligations-2026` → 410.
- **Accueil** : l'ancien point faible est corrigé. `prerender-pages` couvre maintenant `/` et injecte un H1,
  l'introduction et une carte de liens vers `/e-facture`, les guides, outils gratuits, pages métiers et comparatifs.

## 🔴 Ta liste (actions fondateur) — pour la reprise

1. **Choisir le(s) canal(aux) d'acquisition** (le vrai levier, cf. plan final) : annuaires (France Num,
   Appvizer, Capterra), LinkedIn du fondateur, partenariats experts-comptables, ou prospection
   **conforme**. Le démarchage à froid actuel reste bloqué juridiquement.
2. **Marques / société** : déposer OdocPilot + Redsun à l'INPI ; donner les infos Kbis Redsun quand la
   société est ouverte → bascule d'un coup des mentions légales, CGU, confidentialité, `llms.txt`
   (et retrait du nom personnel là où la loi ne l'exige plus). Aujourd'hui « ® » affiché sans dépôt.
3. **SuperPDP production** (KYC + paiement, côté odoc-pulse) : dès que la transmission est réelle, on
   retire les « raccordement pas encore ouvert »/« bientôt » du site.
4. **Relances opt-in du SaaS** (`reminders_enabled` DEFAULT true) : toujours à trancher côté odoc-pulse.

**⚠️ Dette CI du SaaS `odoc-pulse` (repérée le 29/09, à corriger séparément)** : sur les PR, les checks
`verify` et `gitleaks` échouent pour des raisons **préexistantes, sans lien avec l'inscription** —
`supabase/functions/_shared/aiUsage.ts` importe depuis `https://esm.sh/…` (erreur TS2307 du gate
type-check), et `scripts/smtp_service_test.py:84` contient un token que gitleaks signale. La #82 a été
fusionnée malgré ce rouge (Coolify build via `vite build`, non bloqué par ces gates). À nettoyer.

**Consigne ferme (29/09)** : ne **jamais** remettre le pied d'email de prospection proposé (nom
personnel + identité EI en clair) — cf. mémoire `dossier-conformite-legale-ouvert`.

## 🧭 Pistes ouvertes pour la suite

| Piste | Détail |
|---|---|
| Lire les premiers relevés | Vers le 10/10 : impressions hors marque, apparition de `/auto-entrepreneurs` sur « facture électronique auto-entrepreneur », position de `/guide/plateforme-agreee` |
| Pages sœurs de `/auto-entrepreneurs` | Même gabarit (contenu dans `src/content/`, prérendu complet, FAQ en JSON-LD) pour d'autres requêtes à volume : « facture électronique artisan », « professions libérales »… Seulement si les relevés confirment l'intérêt |
| Blog à réduire encore | Après les prochains relevés GSC, envisager 410/301 supplémentaires sur les articles « logiciel gestion/compta » trop généralistes s'ils attirent peu ou cannibalisent les pages guides/comparatifs |
| Longueur de l'accueil | ~12 500 px en 1440, **~17 900 px en 375** (après #40, contre ~20 000 avant). Pour aller plus court sur mobile il faudrait fusionner/retirer des sections de contenu (décision de Riad), pas seulement du padding. |
| Vérifier les 2 méta-descriptions trop longues | `/fonctionnalites` (237) et `/comparatif/pennylane` (236) dépassent ~160 car. → tronquées dans Google. À raccourcir (dans `src/pages/FonctionnalitesPage.tsx` et `src/content/comparisons.ts`). |

**Ne pas toucher sans Riad** : `MentionsLegalesPage`, `CguPage`, `PolitiqueConfidentialitePage`
(versions validées, en ligne ; sous-traitants : tout afficher, décision du 25/09).

## ⚙️ Pièges connus (poste Windows)

- **Worktree + Vite** : Tailwind lit ses chemins `content` depuis le *cwd*. Lancer Vite depuis le
  worktree, sinon les nouvelles classes disparaissent sans erreur. Lanceur minimal :
  `process.chdir(worktree); process.argv = [node, vite.js, "--port", "8093"]; await import(vite.js)`.
- **Captures** : le panneau de prévisualisation expire. Utiliser `playwright-core` (node_modules) avec
  `chromium.launch({ channel: "chrome" })`, car les navigateurs Playwright installés ont une autre
  version que celle attendue.
- **Commit depuis PowerShell** : passer le message par fichier (`git commit -F fichier`). Un
  here-string envoyé sur `-F -` est pris pour un chemin.
- **Supprimer un worktree dont `node_modules` est une jonction** : d'abord
  `[System.IO.Directory]::Delete("<wt>\node_modules", $false)` (retire le lien seul), puis
  `git worktree remove`.
- **Rejouer le build de prod sans bun** : Node 24 exécute les scripts avec un petit résolveur d'imports sans extension (`node --import <resolveur.mjs> scripts/…`) et `--experimental-transform-types` pour `prerender-pages`. Sans clé Supabase locale, `generate-sitemap` réécrit `public/sitemap.xml` avec 0 article : **ne pas le commiter** (`git checkout -- public/sitemap.xml`).
- **Build local 29/09** : Bun est installé dans `C:\Users\KOOBA\.bun\bin\bun.exe`. Commandes validées :
  `bun ./node_modules/typescript/bin/tsc --noEmit`, `bun ./node_modules/vite/bin/vite.js build`,
  `node ./node_modules/vitest/vitest.mjs run src/test/blog-redirects.test.ts src/test/prerender-pages.test.ts`.
  Sans `.env` Supabase locale, `generate-nginx-redirects --check-dist` alerte sur des cibles blog non prérendues
  dans `dist`, mais ces cibles ont été vérifiées en 200 sur la production.
- **Deux sessions dans le même worktree** (cas du fork du 24/09) : elles s'écrasent. Une seule écrit,
  l'autre passe la main par message.

## 🗄️ Archives locales (non poussées)

- `archive/wip-checkout-principal-2026-09-24` (`591bf84`) : ce qui traînait non commité dans le
  checkout principal. Prototype « copilote » de Codex du 19/09 (remplacé par la refonte), son audit et
  ses captures, des renommages « Odoc → OdocPilot » (Contact, 404, `publish-blog-post`). À relire
  si besoin, sinon à supprimer.

## 📉 Point de départ (relevé manuel du 25/09, avant les effets de la refonte)

- 28 jours, données arrêtées au 22/09 : **34 clics, 2 200 impressions**, surtout sur la marque
  (« odoc », « logix »). Trois mois avant : 50 clics pour 5 890 impressions.
- Dernières 24 h (23 au 24/09) : 0 clic, 50 impressions.
- **Aucun effet mesurable encore** : les changements datent du 24/09, et Google met des jours, voire
  des semaines, à recrawler. La refonte n'est pas en ligne. Point de contrôle conseillé autour du
  10/10 : impressions hors marque et position de `/guide/plateforme-agreee` (objectifs du plan de
  relance, `../odoc-pulse/docs/PLAN-ACQUISITION-ODOCPILOT.md`).
