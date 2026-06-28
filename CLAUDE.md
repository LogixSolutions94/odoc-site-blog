# 🧠 CLAUDE.md — Odoc SaaS Landing Page & Blog

**Document de référence pour tous les travaux de développement sur Odoc (landing page + blog)**

> ## ⚡ ÉTAT 2026-06-28 — DÉPLOIEMENT AUTOMATISÉ & REFONTE EN LIGNE
> La **refonte conversion** (design system v2 clair/sombre + pages orientées bénéfice + `/artisans`, `/e-facture`, `/guide/*`, `/comparatif/*`, pages métiers) est **DÉPLOYÉE EN PROD** ✅ (vérifié 2026-06-28 : `/artisans` ne 404 plus, sitemap live = toutes les nouvelles pages).
> 👉 **Le déploiement est désormais AUTOMATIQUE** : `.github/workflows/deploy.yml` rebuild `odoc-landing` sur le VPS **à chaque push de code sur `main`** (secrets `VPS_*` posés et vérifiés OK). Donc **un merge sur `main` = déploiement auto** — plus besoin de rebuild manuel. Le rebuild manuel (bloc « Déploiement Landing » ci-dessous) ne sert plus que de **fallback** si le workflow échoue. Vérifier un déploiement : `gh run list --workflow=deploy.yml`.
> **Design system** : tokens dans `src/index.css` (défaut **CLAIR**) ; pour couleurs/CTA utiliser `bg-gradient-cta` / `text-primary` / `text-primary-foreground` (**adaptatifs clair↔sombre**), **jamais de couleur hardcodée**. Build local (pas de node) : `bun ./node_modules/typescript/bin/tsc --noEmit` + `bun ./node_modules/vite/bin/vite.js build` ; dev `bun run dev` → **:8080**.
> ⚠️ Positionnement / produit / vision / thème **rafraîchis le 14/06** (wedge conformité, 49/89/149, « l'IA prépare, vous validez »). Restent datées plus bas : déploiement `scp`, section « PAGES CLÉS » (anciennes pages 11 modules / 79€), palette « Navy Premium ». **Source de positionnement faisant foi : `refonte/PLAN-REFONTE-CONVERSION-2026.md`** (+ `refonte/ANALYSE-CONCURRENTS-2026.md`).

---

## 🏗️ ARCHITECTURE 2 SITES — RÈGLE CRITIQUE (LIRE EN PREMIER)

Ce VPS héberge DEUX applications DISTINCTES. Ne JAMAIS les confondre.

| Domaine               | Rôle          | Container       | Port |
|-----------------------|---------------|-----------------|------|
| odocpilot.com         | Landing page  | odoc-landing    | 3000 |
| app.odocpilot.com     | SaaS app      | odoc-frontend   | 3001 |

### Règles strictes — sans exception
1. **Ce repo (odoc-insights-hub) = UNIQUEMENT la landing page** (odocpilot.com / container odoc-landing port 3000)
2. **JAMAIS** toucher Dockerfile, nginx.conf, docker-compose.yml du SaaS (odoc-frontend)
3. **JAMAIS** faire `docker-compose up` sans préciser le service exact
4. Toute commande Docker/Nginx → DEMANDER CONFIRMATION avant d'appliquer si risque de toucher le SaaS
5. Le container SaaS (odoc-frontend / port 3001) ne doit JAMAIS être redémarré ou modifié depuis cette session

### Déploiement Landing — Workflow CORRECT

✅ **PAR DÉFAUT, NE RIEN FAIRE À LA MAIN** : depuis le 2026-06-28, `.github/workflows/deploy.yml`
déploie tout seul `odoc-landing` à chaque push de code sur `main` (git pull + docker build + stop/rm/run + check HTTP 200).
Le bloc manuel ci-dessous n'est qu'un **fallback** (workflow KO, ou test hors `main`).

⚠️ **RÈGLE ABSOLUE** (fallback manuel) : Ce repo utilise une image Docker **baked-in** (pas de volume mount).
`docker restart odoc-landing` seul **NE rebuild PAS l'image** → les changements ne sont **PAS** déployés !

```bash
# ✅ WORKFLOW CORRECT à chaque déploiement
git pull origin main                      # Récupérer les changements VPS
docker build -t odoc-landing .            # Reconstruire l'image
docker stop odoc-landing && docker rm odoc-landing  # Arrêter & supprimer
docker run -d \
  --name odoc-landing \
  --network coolify \
  -p 3000:80 \
  --restart unless-stopped \
  odoc-landing                            # Relancer avec nouvelle image

curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000  # Vérifier 200

# ❌ JAMAIS SEUL (ancien build reste actif)
docker restart odoc-landing

# ❌ JAMAIS SCP sans rebuild (fichiers sur VPS mais pas dans image)
scp -i ~/.ssh/odoc_vps_rsa -r dist/* root@151.80.144.236:/var/www/odoc/

# ❌ INTERDIT — ne jamais faire depuis ce repo
docker restart odoc-frontend  # Jamais toucher le SaaS
```

---

## 📝 BIBLE SEO — GÉNÉRATION D'ARTICLES BLOG

> **RÈGLE ABSOLUE** : Avant de générer ou modifier tout article de blog, lire et appliquer scrupuleusement la bible SEO complète.

@SEOBlog.md

### Workflow de génération d'article (Pipeline Perplexity → Claude Code)

```
ÉTAPE 1 — BRIEF (fourni par le demandeur via Perplexity)
  Le brief suit EXACTEMENT le template Section 3 de SEOBlog.md
  Il contient : KW principal, intent, angle unique, outline H2/H3, sources

ÉTAPE 2 — GÉNÉRATION (Claude Code = toi)
  1. Lire SEOBlog.md en entier (via @SEOBlog.md ci-dessus)
  2. Générer l'article en respectant :
     - Structure Section 4 (H1/H2/H3, intro, Atomic Answers, FAQ, CTA)
     - Checklist 32 points Section 5 (valider chaque point)
     - Schema JSON-LD Section 8 (BlogPosting + FAQPage + BreadcrumbList)
     - Maillage interne Section 10 (3-5 liens, ancres riches)
  3. Format : Markdown avec frontmatter YAML

ÉTAPE 3 — INSERTION SUPABASE
  Insérer dans table blog_posts (title, slug, content, excerpt, cover_image, published_at)
  L'indexation Google Search Console est automatique ✅
```

### Template frontmatter article blog

```yaml
---
title: "[TITRE H1 — 55-65 chars]"
slug: "[slug-url-article]"
excerpt: "[Meta description 150-160 chars avec KW principal]"
category: "[Nom du silo]"
tags: ["tag1", "tag2", "tag3"]
author: "OdocPilot"
published_at: "[AAAA-MM-JJ]"
updated_at: "[AAAA-MM-JJ]"
cover_image: "/images/blog/[slug].webp"
featured: false
seo:
  canonical: "https://odocpilot.com/blog/[slug]"
  og_title: "[Titre OG]"
  og_description: "[Description OG 150-160 chars]"
schema:
  type: "BlogPosting"
  faq: true
---
```

### Règles spécifiques au blog OdocPilot

- **Ton** : Direct, concret, terrain. Voix d'un fondateur qui connaît les PME françaises.
- **Audience** : Dirigeants TPE/PME France, 35-55 ans, secteur BTP/artisans en priorité.
- **Produit** : OdocPilot = copilote IA français de **facturation & conformité** pour TPE/PME et indépendants. Wedge = **e-facturation 2026/2027** (Factur-X EN 16931, lecture IA des factures, GED, export FEC, copilote Brain). Données ET IA en France (Mistral). Tarifs **49/89/149 €** + palier Conformité gratuit, essai 14 j sans CB. ⚠️ PÉRIMÉ : « tout-en-un CRM/N8N/79€/self-hosted ».
- **Différenciation** : « **l'IA prépare l'admin du dirigeant de TPE, vous validez en 1 clic** » (jamais « l'IA exécute seule »). Créneau vide vs Pennylane (cabinet) / Qonto (banque) / Indy (compta TNS).
- **CTA principal** : `<a href="https://app.odocpilot.com/signup">Essayer OdocPilot 14 jours — gratuit, sans CB</a>`
- **Ne JAMAIS** utiliser le langage GPT générique (voir liste Section 14.3 de SEOBlog.md)
- **Toujours** inclure au moins 1 stat/chiffre sourcé récent (< 12 mois)
- **Toujours** inclure la section FAQ avec 4-6 questions + schema FAQPage JSON-LD

---

## 📍 **CONTEXTE PROJET**

### Vision OdocPilot (À JOUR 06/2026 — remplace l'ancien « OS d'entreprise »)
```
OdocPilot = copilote IA français de facturation & conformité pour TPE/PME.
Wedge : la facturation électronique obligatoire 2026/2027 (entrée par la douleur légale).
Promesse : l'IA prépare l'administratif (Factur-X, lecture/classement, relances) — vous validez en 1 clic.
Positionnement faisant foi : refonte/PLAN-REFONTE-CONVERSION-2026.md.
```

### Stack technique (NE PAS CHANGER)
```
Frontend : React 18 + TypeScript strict + Vite
Styling  : Tailwind CSS + shadcn/ui (composants)
Animations : Framer Motion via MotionDiv (JAMAIS motion.div)
SEO      : react-helmet-async
Backend  : Supabase (blog_posts, newsletter_subscribers)
Deploy   : Nginx reverse proxy + SSL Let's Encrypt
Font     : Cabinet Grotesk (display) + Satoshi (body), chargés via fontshare (cf index.html/index.css). NB : tailwind.config.ts dit encore « Plus Jakarta Sans » → incohérence à aligner.
Theme    : défaut CLAIR ; thème sombre = noir + ORANGE (#F97316). « Navy Premium » = PÉRIMÉ.
```

---

## 🌐 **ARCHITECTURE & DOMAINES**

### Domaines en production
```
┌─ https://odocpilot.com         → Landing page + Blog (React SPA)
├─ https://app.odocpilot.com     → SaaS Frontend (Docker, port 3001)
├─ https://api.odocpilot.com     → API REST (port 4000)
├─ https://blog.odocpilot.com    → Blog (port 3100)
├─ https://docs.odocpilot.com    → Docs (port 3200)
└─ https://status.odocpilot.com  → Status page (port 3300)
```

### Répertoires locaux
```
/src/pages/
  ├── HomePage.tsx               → Landing page hero + modules
  ├── PricingPage.tsx            → Pricing 4 plans + comparatif
  ├── FonctionnalitesPage.tsx    → 11 modules détaillés
  ├── BlogPage.tsx               → Blog listing
  ├── BlogPostPage.tsx           → Article individuel
  ├── ContactPage.tsx            → Formulaire contact
  ├── AProposPage.tsx            → À propos
  └── ...autres pages

/src/components/
  ├── SiteHeader.tsx             → Navigation principale
  ├── SiteFooter.tsx             → Footer
  ├── MotionDiv.tsx              → Wrapper Framer Motion
  ├── SEOHead.tsx                → Composant SEO/helmet
  ├── MarketingLayout.tsx        → Layout pages marketing
  └── /ui/                       → shadcn/ui components

/src/integrations/supabase/
  └── client.ts                  → Client Supabase config

/public/
  └── ...assets, favicon, etc.
```

### Déploiement VPS
```
VPS : 151.80.144.236 (OVH)
SSH : ssh -i ~/.ssh/odoc_vps_rsa root@151.80.144.236

Landing page : /var/www/odoc/               (fichiers statiques)
Nginx config : /etc/nginx/sites-available/odocpilot.conf
SSL certs    : /etc/letsencrypt/live/odocpilot.com/
```

---

## 🎨 **CONVENTIONS & PATTERNS**

### 1. Variables d'environnement
```typescript
// TOUJOURS utiliser cette approche pour APP_URL
const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";

// Utilisation dans les CTAs
<a href={`${APP_URL}/signup`}>Essayer gratuitement</a>
<a href={`${APP_URL}/login`}>Se connecter</a>
```

### 2. Composants Framer Motion
```typescript
// ✅ CORRECT - Utiliser MotionDiv
import { MotionDiv } from "@/components/MotionDiv";

<MotionDiv
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1, duration: 0.5 }}
  viewport={{ once: true }}
>
  Contenu animé
</MotionDiv>

// ❌ JAMAIS : motion.div
import { motion } from "framer-motion";  // NE PAS IMPORTER
<motion.div>...</motion.div>  // NE PAS UTILISER
```

### 3. Import Lucide Icons
```typescript
// ✅ CORRECT - Ajouter aux imports existants
import { FileText, Receipt, Brain, Calendar, Plus } from "lucide-react";

// ❌ JAMAIS dupliquer les imports
// import { FileText } from "lucide-react";
// import { Calendar } from "lucide-react";  // ← Fusion!
```

### 4. Styling avec Tailwind
```typescript
// ✅ Tailwind uniquement
className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"

// ❌ Pas de CSS inline ou style={}
style={{ color: "red" }}  // Ne pas faire ça
<style>{`...`}</style>    // Ne pas faire ça
```

### 5. Couleurs (palette Navy Premium)
```css
--primary: hsl(214 80% 18%)         /* Navy profond */
--primary-glow: hsl(217 75% 40%)    /* Navy lumineux */
--accent: hsl(217 75% 42%)          /* Bleu électrique */
--background: hsl(210 20% 98%)      /* Très clair */
--foreground: hsl(215 30% 10%)      /* Très foncé */
```

---

## 📝 **FICHIERS CRITIQUES & RÈGLES**

### ✅ TOUJOURS faire
```
1. Lire le fichier avant de le modifier
2. Vérifier que TypeScript compile : npm run build
3. Tester les changements localement
4. Utiliser MotionDiv pour animations
5. Optimiser SEO (title, description, canonical)
6. Supporter le mode sombre (dark class)
7. Responsive design (mobile-first)
8. Vérifier les images/placeholders
```

### ❌ JAMAIS faire
```
1. Changer le stack technique sans permission
2. Ajouter des librairies npm sans validation
3. Utiliser motion.div directement
4. Dupliquer les imports Lucide
5. Hardcoder des URLs (sauf APP_URL)
6. CSS inline ou <style> tags
7. Modifier les fichiers de config (vite.config.ts, etc.)
8. Commit sans tester le build
```

---

## 🚀 **PROCESSUS DE DÉPLOIEMENT**

### Local → VPS (4 étapes)

**1. Développer & tester**
```bash
npm run dev                    # Démarrer le dev server
npm run build                  # Vérifier le build
git add .
git commit -m "DESCRIPTION"
```

**2. Vérifier avant de pousser**
```bash
npm run build                  # ✅ Doit compiler sans erreurs
git log --oneline -5           # Vérifier les commits
```

**3. Déployer sur VPS**
```bash
scp -i ~/.ssh/odoc_vps_rsa -r dist/* root@151.80.144.236:/var/www/odoc/
```

**4. Vérifier que c'est live**
```bash
curl -I https://odocpilot.com  # Doit retourner HTTP/2 200
```

### Commandes utiles
```bash
# Voir les logs Nginx
ssh -i ~/.ssh/odoc_vps_rsa root@151.80.144.236 "tail -f /var/log/nginx/access.log"

# Redémarrer Nginx
ssh -i ~/.ssh/odoc_vps_rsa root@151.80.144.236 "systemctl restart nginx"

# Vérifier certificats SSL
ssh -i ~/.ssh/odoc_vps_rsa root@151.80.144.236 "certbot certificates"
```

---

## 📱 **PAGES CLÉS & LEURS RESPONSABILITÉS**

### HomePage.tsx
```
✅ Hero section : Tagline + CTA "Essayer gratuitement"
✅ Badge animé : "● Nouveau — OS d'entreprise IA"
✅ Section problème : 3 douleurs TPE/PME
✅ Section modules : 11 modules (grille 5 colonnes)
✅ Section "Pour qui" : 4 audiences (TPE, Comptables, Juridique, RH)
✅ Social proof : Trustpilot (placeholder pour maintenant)
✅ Pricing teaser : 4 plans
✅ CTA final : "Votre employé IA vous attend"
✅ Newsletter : Formulaire Supabase

Paramètre critique : APP_URL (pointe vers app.odocpilot.com)
```

### PricingPage.tsx
```
✅ Toggle mensuel/annuel
✅ 4 plans : Starter (gratuit), Essentiel (29€), Pro (79€), Entreprise (sur mesure)
✅ Tableau "Odoc vs les autres" (5 lignes + total)
✅ Garantie "Satisfait ou remboursé 30 jours"
✅ FAQ (6 questions)
✅ Trust badges

Règle : Pro plan = highlight (border + ring)
```

### FonctionnalitesPage.tsx
```
✅ 11 modules listés avec détails
✅ Navigation sticky (desktop)
✅ Alternance image/texte (grid 2 colonnes)
✅ Benefits points pour chaque module
✅ CTA final : "Essayer gratuitement"

Modules : Documents, Factures, Brain, Analytics, Équipe, RH, Projets,
          Messagerie, Portail Fournisseur, Smart Connectors, Calendrier
```

### BlogPage.tsx & BlogPostPage.tsx
```
✅ Récupère posts depuis Supabase (blog_posts table)
✅ Listing avec cards (image, titre, excerpt, date)
✅ Page article : Markdown rendu, SEO optimisé
✅ Navigation prev/next

Supabase table: blog_posts (id, title, slug, content, excerpt, published_at, cover_image)
```

---

## 🔧 **TÂCHES COURANTES**

### Ajouter un nouveau module
```typescript
// 1. Importer l'icône Lucide
import { NewIcon } from "lucide-react";

// 2. Ajouter au tableau modules[] dans FonctionnalitesPage.tsx
{
  id: "id-unique",
  icon: NewIcon,
  title: "Titre Module",
  description: "Description...",
  benefits: ["Benefit 1", "Benefit 2", ...],
  screenshotLabel: "Aperçu — Module"
}

// 3. Ajouter aussi dans HomePage.tsx tools[] avec emoji
{ icon: NewIcon, emoji: "🆕", title: "Titre", description: "..." }

// 4. Commit & redéployer
```

### Mettre à jour les pricing
```typescript
// Dans PricingPage.tsx, modifie le tableau plans[]
{
  name: "Plan Name",
  badge: "Badge text",
  monthlyPrice: 99,
  annualPrice: 79,  // 20% moins cher
  features: [...],
  ...
}
```

### Ajouter un article blog
```
1. Générer le brief via Perplexity (template Section 3 de SEOBlog.md)
2. Donner le brief à Claude Code — il lit SEOBlog.md automatiquement via @SEOBlog.md
3. Claude génère le contenu Markdown complet avec frontmatter + JSON-LD
4. Insérer dans Supabase table blog_posts :
   - title: "Titre Article"
   - slug: "titre-article"
   - content: "Markdown content..."
   - excerpt: "Courte description"
   - cover_image: "https://..."
   - published_at: NOW()
5. Article apparaît auto sur BlogPage
6. Accessible sur /blog/titre-article
7. Indexation automatique Google Search Console déjà configurée ✅
```

### Ajouter une nouvelle page
```
1. Créer /src/pages/NewPage.tsx
2. Importer dans App.tsx routes
3. Ajouter SEOHead avec title + description
4. Ajouter lien dans SiteHeader navLinks (si navigation principale)
5. Commit & redéployer
```

---

## 🎯 **CHECKLIST AVANT CHAQUE COMMIT**

```
□ Code lu avant modification
□ npm run build réussi sans erreurs
□ TypeScript strictement validé
□ MotionDiv utilisé (jamais motion.div)
□ APP_URL = app.odocpilot.com
□ SEO Head présent sur nouvelles pages
□ Responsive testée (mobile/desktop)
□ CTAs pointent vers app.odocpilot.com
□ Pas de hardcoding d'URLs
□ Pas d'import Lucide dupliqué
□ Images optimisées (placeholders OK pour MVP)
□ Git message clair & descriptif
□ [BLOG] Checklist 32 points SEOBlog.md validée si article publié
□ [BLOG] Schema JSON-LD présent (BlogPosting + FAQPage)
□ [BLOG] Maillage interne vérifié (3-5 liens, ancres riches)
```

---

## 📊 **COMMIT MESSAGE TEMPLATE**

```
TYPE: Courte description (max 60 chars)

Description détaillée (optionnel) :
- Point 1
- Point 2
- Impact/Raison

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

**Types acceptés :**
- `FEATURE:` Nouvelle fonctionnalité
- `FIX:` Correction de bug
- `UPGRADE:` Amélioration/refactor majeur
- `DOCS:` Documentation
- `STYLE:` Changements esthétiques/design
- `BLOG:` Nouvel article ou mise à jour article blog

---

## 💡 **RAPPELS IMPORTANTS**

### Le site marketing (odocpilot.com)
- ✅ Donne envie d'essayer
- ✅ Explique la valeur (OS d'entreprise)
- ✅ Rassure sur la sécurité (France, RGPD, etc.)
- ✅ Dirige vers le SaaS pour signup/login
- ✅ Premium, moderne, next-gen

### Le SaaS (app.odocpilot.com)
- ✅ Dashboard & modules
- ✅ Signup/Login
- ✅ Gestion utilisateurs
- ⚠️ À développer selon roadmap

### Le Blog (dans la landing)
- ✅ Articles Supabase-driven
- ✅ Conseils IA, études de cas
- ✅ SEO + newsletter
- ✅ Renforce l'autorité
- ✅ Générés via pipeline Perplexity → Claude Code → Supabase
- ✅ Bible SEO dans SEOBlog.md (lue automatiquement via @SEOBlog.md)

---

## 🤝 **QUESTIONS? BESOIN D'AIDE?**

**Avant de coder :**
1. Lire ce CLAUDE.md
2. Lire SEOBlog.md (pour tout travail lié au blog)
3. Vérifier le code existant dans les pages similaires
4. Tester localement : `npm run dev`

**En cas de doute :**
- ✅ Utiliser MotionDiv pour animations
- ✅ Importer icônes Lucide correctement
- ✅ Vérifier APP_URL = app.odocpilot.com
- ✅ Toujours inclure SEOHead sur les pages
- ✅ Toujours appliquer SEOBlog.md pour les articles

**Déploiement :**
```bash
npm run build && \
scp -i ~/.ssh/odoc_vps_rsa -r dist/* root@151.80.144.236:/var/www/odoc/
```

---

**Dernière mise à jour :** 2026-05-04  
**Version :** 1.2 (Landing + Blog + SaaS intégration + Pipeline SEO)  
**Status :** 🟢 En production
