# ✅ TODO — odoc-site-blog (site + blog odocpilot.com)

> Pour la prochaine IA / le prochain dev. Lis aussi **`CLAUDE.md`** (règles repo) et **`refonte/DEPLOY-WINDOWS.md`** (déploiement) + **`refonte/HANDOFF-CAPTURES.md`** (captures).
> Ce repo = le **SITE marketing public** (odocpilot.com), **SÉPARÉ** du SaaS odoc-pulse (app.odocpilot.com).
> Dernière mise à jour : **2026-06-08**.

---

## 🔴 P0 — BLOQUANT : la refonte est mergée mais **PAS déployée**

**État vérifié (2026-06-08)** : `main` contient bien la **refonte conversion** (design system v2 clair/sombre + 4 pages orientées bénéfice : Home structure A, Fonctionnalités en groupes-bénéfices, page `/artisans`, Tarifs « un seul prix ») **+** le SSG prerender blog.
**MAIS la production sert encore l'ANCIEN build** : titre serveur = « OdocPilot – Copilot IA… », `/artisans` → **404**, ancien `/pricing`, et surtout les **claims légaux retirés le 29/05 (NF Z42-013 / AES-256 / +200 équipes) TOUJOURS EN LIGNE** = risque DGCCRF.

**Cause** : le merge GitHub est fait, mais le **VPS n'a jamais été reconstruit**. Le site est une image Docker **baked-in** → `docker restart` ne suffit **JAMAIS**, il faut **rebuild**. (Le build mergé est sain : la refonte compile `tsc`+`vite build`, et `scripts/prerender-blog.ts` est résilient → `exit 0`. Donc le build ne plante pas, il n'a juste pas été lancé.)

**FIX — sur le VPS** (le Mac ne peut pas SSH : clé non autorisée ; **le PC Windows a la clé**) :
```bash
# Dans le dossier du repo "odoc-landing" sur le VPS 151.80.144.236
git pull origin main
docker build -t odoc-landing .
docker stop odoc-landing && docker rm odoc-landing
docker run -d --name odoc-landing --network coolify -p 3000:80 --restart unless-stopped odoc-landing
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000     # attendu : 200
```
⚠️ **NE JAMAIS toucher `odoc-frontend`** (le SaaS, port 3001). Détails pas-à-pas : `refonte/DEPLOY-WINDOWS.md`.
👉 **Déployer corrige d'un coup : la refonte EN LIGNE + les claims légaux encore exposés.**

**Vérif post-deploy (navigateur)** : home en **CLAIR** par défaut · hero « Toute la gestion de votre entreprise. Sans la paperasse. » · section « Vous êtes…? » · **`/artisans` s'ouvre** (plus de 404) · `/pricing` = « Un seul prix. Tout compris. » · **aucun** « SHA-256 / N8N / OS d'entreprise / NF Z42-013 / +200 équipes » visible.

---

## 🟠 P1 — contenu réel (après déploiement)
- [ ] **Vraies captures produit** → `public/images/features/{facturation,pilotage,documents,equipe}.webp` (+ `public/images/hero-dashboard.webp`). Voir `refonte/HANDOFF-CAPTURES.md`. Le composant `FeatureVisual` (`src/pages/FonctionnalitesPage.tsx`) les affiche dès qu'elles existent, sinon un placeholder propre (fallback `onError`).
- [ ] **OG image** `public/og-image.png` (1200×630) — référencée mais absente → previews sociales cassées.
- [ ] **QA navigateur** clair + sombre sur toutes les pages.

## 🟡 P2 — finitions refonte
- [ ] **Unifier la marque** : header/logo = « OdocPilot », corps/footer = « Odoc ». Choisir **UN** nom et harmoniser partout (pages + `SEOHead` + JSON-LD `index.html`).
- [ ] **Pages verticales restantes** sur le modèle de `src/pages/ArtisansPage.tsx` : Commerce & Services, Professions libérales, Cabinets comptables. Puis brancher les liens du **routeur ICP** (tableau `icp` dans `src/pages/HomePage.tsx`, aujourd'hui 3 cartes pointent vers `/fonctionnalites` faute de page) + ajouter les routes dans `src/App.tsx`.
- [ ] **Reskin du blog** (`src/pages/BlogPage.tsx`, `BlogPostPage.tsx`, `src/components/blog/*`) au design system (tokens + `bg-gradient-cta`). Le blog reste alimenté par l'agent blog (côté odoc-pulse) — **ne pas casser le rendu des `blog_posts`**.
- [ ] **Pages encore en ancienne copy/jargon** : `EFacturePage`, `AProposPage`, `RoadmapPage`, `ChangelogPage` → passer au ton bénéfice + tokens (zéro techno).

## 🟢 P3 — divers
- [ ] Liens footer morts à vérifier (anciens `docs.odoc.fr` / `status.odoc.fr` → `.odocpilot.com`).
- [ ] (Optionnel) régénérer les docs d'audit/maquettes de la refonte (`refonte/*.html` — effacés du disque pendant la session, non commités ; l'analyse est dans l'historique de chat).

---

## 🧭 Repères pour la prochaine IA (gagne du temps)
- **Stack** : React 18 + TS + Vite 5 + Tailwind 3 + shadcn/ui + Framer Motion **via `MotionDiv`** (jamais `motion.div`). SEO via `<SEOHead>`. CTAs → `APP_URL` (= app.odocpilot.com).
- **Design system** : `src/index.css` (tokens HSL `[data-theme="light"|"dark"]`, **défaut CLAIR**) + `tailwind.config.ts`. Pour CTA/accents, utiliser **`bg-gradient-cta` + `text-primary-foreground`** et **`text-primary`** → s'adaptent au thème (orange en clair, cyan/teal en sombre). **NE PAS hardcoder de couleurs** (sinon ça ne suit pas le thème).
- **Toolchain (PAS de node sur le Mac)** : `bun install` d'abord, puis `bun ./node_modules/typescript/bin/tsc --noEmit` et `bun ./node_modules/vite/bin/vite.js build`. Dev : `bun run dev` → **http://localhost:8080**. ❌ NE PAS `bunx tsc/vite` (tire Vite8/Tailwind4 → casse) ni `bun run build` (étape `npx tsx` sitemap échoue, pas de npx). Le **Docker** build, lui, tourne en **Node 18** (npm) → OK côté VPS.
- **Thème** : attribut `data-theme` sur `<html>` (script anti-flash dans `index.html`, défaut `light` ; bouton `ThemeToggle`).
- **Déploiement** : image Docker baked-in `odoc-landing` (port 3000) → **rebuild obligatoire** (cf. P0 / `refonte/DEPLOY-WINDOWS.md`). Jamais toucher `odoc-frontend` (3001).
- **⚠️ Travail parallèle** : une session « SEO Agent » bosse sur le **même repo** (SSR prerender blog, déjà mergé `0f931d9`). En cas de divergence git : `fetch` + rebase, **ne pas force-push**.
