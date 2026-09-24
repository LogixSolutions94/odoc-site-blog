# AGENTS.md — Odoc Insights Hub (Landing + Blog OdocPilot)

Document de référence unique pour tout agent travaillant sur ce repo (landing page + blog OdocPilot). Détails et références complètes : section « Documentation détaillée » en bas de ce fichier.

## Le projet

Vision à jour depuis 06/2026 — remplace l'ancien positionnement « OS d'entreprise » (encore visible par endroits dans la doc détaillée, périmé) :
```
OdocPilot = copilote IA français de facturation & conformité pour TPE/PME.
Wedge : facturation électronique obligatoire 2026/2027 (entrée par la douleur légale).
Promesse : l'IA prépare l'administratif (Factur-X, lecture/classement, relances) — vous validez en 1 clic.
Positionnement faisant foi : refonte/PLAN-REFONTE-CONVERSION-2026.md (+ ANALYSE-CONCURRENTS-2026.md).
```

Ce repo (`odoc-insights-hub`) = **uniquement** la landing page (odocpilot.com) **et** le blog. Le SaaS (`app.odocpilot.com`) est un **autre repo**, hors de ce périmètre.

3 visages : **odocpilot.com** (landing, ce repo — donne envie, rassure, dirige vers signup) · **app.odocpilot.com** (SaaS, dashboard/login, hors repo) · **blog** (articles Supabase-driven, pipeline Perplexity → agent → Supabase). Détail : `docs/agents/stack-conventions-pages.md`.

## État actuel (résumé)

- **Reprise : lire `docs/HANDOFF_NEXT_SESSION.md` (25/09/2026).** Refonte visuelle « Papeterie » en cours sur la branche `refonte/vitrine-2026-09` (non fusionnée) ; positionnement du plan de relance du 24/09 (`../odoc-pulse/docs/PLAN-ACQUISITION-ODOCPILOT.md`), qui prime sur la ligne « wedge conformité » ci-dessous.

- Refonte conversion (design v2 clair/sombre, `/artisans`, `/e-facture`, `/guide/*`, `/comparatif/*`, pages métiers) **déployée en prod** (vérifié 2026-06-28 : `/artisans` ne 404 plus, sitemap live = toutes les nouvelles pages).
- **Déploiement automatique** depuis le 2026-06-28 : chaque push sur `main` redéploie `odoc-landing` (`.github/workflows/deploy.yml`). Vérifier : `gh run list --workflow=deploy.yml`. Le rebuild manuel n'est qu'un fallback (détail : `docs/agents/architecture-et-deploiement.md`).
- Positionnement/produit/thème à jour depuis le 14/06 (wedge conformité, 49/89/149 €, « l'IA prépare, vous validez »).
- ⚠️ **Sections datées** dans la doc détaillée, à ne pas prendre pour la vérité actuelle : ancien déploiement `scp` manuel, « Pages clés » (anciens 11 modules / 79 €), palette « Navy Premium ». Vérifier `refonte/PLAN-REFONTE-CONVERSION-2026.md` en cas de doute.
- Design system : tokens dans `src/index.css` (défaut **CLAIR**) ; couleurs/CTA via `bg-gradient-cta` / `text-primary` / `text-primary-foreground` (adaptatifs clair↔sombre) — **jamais de couleur hardcodée**.

## ⚖️ Identité légale de l'éditeur — NE JAMAIS INVENTER (maj 2026-09-24)

⚠️ Le site a longtemps publié « **Logix Solutions SASU** ». **Cette société n'existe pas.** Toute réécriture qui réintroduit une SASU, un capital social ou un siège social est une **régression**.

| Champ | Valeur qui fait foi |
|---|---|
| Éditeur | **Monsieur Riad Brahimi** (personne physique) |
| Forme juridique | **Entreprise individuelle**, régime micro-entreprise. Pas de raison sociale, pas de capital, pas de siège social → on écrit « adresse de l'établissement » |
| Noms commerciaux / marques | **Logix Solutions, OdocPilot, Odoc** (les trois appartiennent à M. Brahimi) |
| SIREN | **842 920 084** |
| SIRET (établissement principal) | **842 920 084 00022** |
| Immatriculation | **RNE** (INPI). **Pas de RCS** : activité libérale non réglementée, hors du champ de l'obligation |
| Adresse publiée | 89-91 Avenue de la République, 75011 Paris (domiciliation) |
| Téléphone | +33 6 10 02 04 76 (**obligatoire** : art. 6, III, 1°, a) LCEN pour un éditeur personne physique) |
| Directeur de la publication | **M. Brahimi R.** (décision de Riad du 24/09/2026 ; remplace « Lucas Belloc », prénom fictif de l'agent mailing) |
| Nom affiché hors textes légaux | **« M. Brahimi R. »** (demande de Riad, 24/09/2026) : pied de page, accueil, llms.txt, signatures. Le nom complet ne figure que là où la loi l'exige (bloc éditeur des mentions légales, CGU, responsable du traitement) |

**Source unique de vérité** : `../freelance-profils/entreprise-identite.md` (synthèse guichet unique, formalité J00267689834 validée le 31/07/2026). Contexte et réserves ouvertes : `../plan-attaque-2026-09/MENTIONS-LEGALES-ETAT-2026-09-08.md`.

**Nom du produit** : le nom officiel du SaaS est **OdocPilot**. Écrire « OdocPilot », pas « Odoc » seul. Seule exception : les listes de noms commerciaux des mentions légales, où les deux figurent à dessein.

**Textes publiés (pages légales, emails)** : **aucun tiret cadratin**.

Pages concernées : `MentionsLegalesPage.tsx`, `CguPage.tsx`, `PolitiqueConfidentialitePage.tsx`, `public/llms.txt`.

## 🏗️ ARCHITECTURE 2 SITES — RÈGLE CRITIQUE (LIRE EN PREMIER)

Le VPS héberge DEUX applications DISTINCTES. Ne JAMAIS les confondre.

| Domaine | Rôle | Container | Port |
|---|---|---|---|
| odocpilot.com | Landing page (**ce repo**) | odoc-landing | 3000 |
| app.odocpilot.com | SaaS app (**autre repo**) | odoc-frontend | 3001 |

### Règles strictes — sans exception
1. **Ce repo (odoc-insights-hub) = UNIQUEMENT la landing page** (odocpilot.com / container odoc-landing port 3000)
2. **JAMAIS** toucher Dockerfile, nginx.conf, docker-compose.yml du SaaS (odoc-frontend)
3. **JAMAIS** faire `docker-compose up` sans préciser le service exact
4. Toute commande Docker/Nginx → DEMANDER CONFIRMATION avant d'appliquer si risque de toucher le SaaS
5. Le container SaaS (odoc-frontend / port 3001) ne doit JAMAIS être redémarré ou modifié depuis cette session

Par défaut, **ne rien déployer à la main** (voir « État actuel »). Domaines complets, dossiers, chemins VPS, workflow de déploiement (auto + fallback manuel + commandes interdites) : `docs/agents/architecture-et-deploiement.md`.

## Commandes

```bash
# Build local (pas de node sur ce poste)
bun ./node_modules/typescript/bin/tsc --noEmit
bun ./node_modules/vite/bin/vite.js build
bun run dev          # → http://localhost:8080
```
⚠️ D'autres parties de la doc détaillée (checklist, ancien processus de déploiement) référencent encore `npm run dev` / `npm run build` — non aligné avec la bascule vers `bun` ci-dessus ; à vérifier avant d'exécuter tel quel.

## Conventions essentielles

- Animations : toujours `MotionDiv` (`@/components/MotionDiv`), **jamais** `motion.div` ni import direct de `framer-motion`.
- Icônes : `lucide-react`, ajouter aux imports existants, ne **jamais** dupliquer un import.
- Styling : Tailwind uniquement — pas de CSS inline ni de balises `<style>`.
- URLs : toujours via `APP_URL` (`import.meta.env.VITE_APP_URL || "https://app.odocpilot.com"`), jamais d'URL hardcodée.
- Stack complète, exemples de code (✅/❌) et rôle de chaque page : `docs/agents/stack-conventions-pages.md`.

## Absolu : à faire / à ne jamais faire

✅ **Toujours** : lire un fichier avant de le modifier · vérifier que TypeScript compile · tester localement · `MotionDiv` pour les animations · SEO (title/description/canonical) sur toute nouvelle page · dark mode supporté · responsive mobile-first · images/placeholders vérifiés.

❌ **Jamais** : changer le stack technique sans permission · ajouter une lib npm sans validation · `motion.div` direct · imports Lucide dupliqués · URL hardcodée (hors `APP_URL`) · CSS inline / `<style>` · modifier les fichiers de config (`vite.config.ts`, etc.) · committer sans avoir testé le build.

## Blog — bible SEO

**RÈGLE ABSOLUE** : avant de générer ou modifier tout article de blog, lire et appliquer scrupuleusement la bible SEO complète.

@SEOBlog.md

Pipeline de génération (brief → rédaction → insertion Supabase), template frontmatter YAML, règles de ton/produit/CTA : `docs/agents/blog-seo.md`.

## Tâches courantes

Recettes (nouveau module, nouvelle page, mise à jour des tarifs), checklist avant commit, template de message de commit : `docs/agents/taches-courantes.md`.

## Documentation détaillée

- [docs/agents/architecture-et-deploiement.md](docs/agents/architecture-et-deploiement.md) — quand tu dois déployer, toucher Docker/Nginx, ou retrouver un domaine/chemin/dossier précis.
- [docs/agents/stack-conventions-pages.md](docs/agents/stack-conventions-pages.md) — quand tu écris ou modifies du code : stack complète, patterns (env vars, MotionDiv, Lucide, Tailwind, couleurs), rôle de chaque page clé.
- [docs/agents/blog-seo.md](docs/agents/blog-seo.md) — quand tu génères ou modifies un article de blog : workflow, frontmatter, règles de ton/produit/CTA.
- [docs/agents/taches-courantes.md](docs/agents/taches-courantes.md) — quand tu fais une modification fréquente (module, page, pricing) ou avant de committer.

---
**Historique** : v1.2 (Landing + Blog + intégration SaaS + pipeline SEO), mise à jour contenu 2026-05-04, statut prod 🟢. Restructuré (AGENTS.md/CLAUDE.md/docs/agents) le 2026-09-11 — voir `CLAUDE.md` pour les instructions propres à Claude Code.
