# Stack, conventions de code & pages clés — détail

> À lire avant d'écrire ou modifier du code sur ce repo : stack imposée, patterns obligatoires (avec exemples ✅/❌), et ce que fait chaque page principale.

---

## Stack technique (NE PAS CHANGER)

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

## Conventions & patterns

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

### 5. Couleurs (palette Navy Premium — ⚠️ PÉRIMÉE, voir bannière État actuel dans AGENTS.md : le thème par défaut est CLAIR avec tokens `src/index.css` / `bg-gradient-cta` etc., pas cette palette)
```css
--primary: hsl(214 80% 18%)         /* Navy profond */
--primary-glow: hsl(217 75% 40%)    /* Navy lumineux */
--accent: hsl(217 75% 42%)          /* Bleu électrique */
--background: hsl(210 20% 98%)      /* Très clair */
--foreground: hsl(215 30% 10%)      /* Très foncé */
```

---

## Pages clés & leurs responsabilités

> ⚠️ Section datée (pré-refonte) : mentionne encore 11 modules et des prix (79€) périmés depuis le passage à 49/89/149€. Source de vérité actuelle : `refonte/PLAN-REFONTE-CONVERSION-2026.md`. Conservée telle quelle pour référence de la structure des pages.

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

## Rappels — les 3 visages du projet

### Le site marketing (odocpilot.com)
- ✅ Donne envie d'essayer
- ✅ Explique la valeur (OS d'entreprise)
- ✅ Rassure sur la sécurité (France, RGPD, etc.)
- ✅ Dirige vers le SaaS pour signup/login
- ✅ Premium, moderne, next-gen

### Le SaaS (app.odocpilot.com — hors de ce repo)
- ✅ Dashboard & modules
- ✅ Signup/Login
- ✅ Gestion utilisateurs
- ⚠️ À développer selon roadmap

### Le Blog (dans la landing)
- ✅ Articles Supabase-driven
- ✅ Conseils IA, études de cas
- ✅ SEO + newsletter
- ✅ Renforce l'autorité
- ✅ Générés via pipeline Perplexity → agent → Supabase
- ✅ Bible SEO dans SEOBlog.md (voir `docs/agents/blog-seo.md`)
