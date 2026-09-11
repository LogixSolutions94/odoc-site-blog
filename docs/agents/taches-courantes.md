# Tâches courantes, checklist & commit — détail

> Recettes pas à pas pour les modifications fréquentes, et ce qu'il faut vérifier avant de committer.

---

## Ajouter un nouveau module

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

## Mettre à jour les pricing

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

## Ajouter une nouvelle page

```
1. Créer /src/pages/NewPage.tsx
2. Importer dans App.tsx routes
3. Ajouter SEOHead avec title + description
4. Ajouter lien dans SiteHeader navLinks (si navigation principale)
5. Commit & redéployer
```

## Avant de coder / en cas de doute

**Avant de coder :**
1. Lire `AGENTS.md`
2. Lire `SEOBlog.md` (pour tout travail lié au blog)
3. Vérifier le code existant dans les pages similaires
4. Tester localement (voir commandes dans `AGENTS.md`)

**En cas de doute :**
- ✅ Utiliser MotionDiv pour animations
- ✅ Importer icônes Lucide correctement
- ✅ Vérifier APP_URL = app.odocpilot.com
- ✅ Toujours inclure SEOHead sur les pages
- ✅ Toujours appliquer SEOBlog.md pour les articles

---

## Checklist avant chaque commit

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

> ⚠️ `npm run build` : la bannière « État actuel » de `AGENTS.md` documente un build local via `bun` (pas de node sur le poste). Cette checklist, plus ancienne, est restée en `npm run build` — vérifier quel outil est réellement disponible avant d'exécuter.

## Template de message de commit

```
TYPE: Courte description (max 60 chars)

Description détaillée (optionnel) :
- Point 1
- Point 2
- Impact/Raison

Co-Authored-By: <agent> <email>
```
> La ligne `Co-Authored-By` exacte dépend de l'agent qui committe — voir `CLAUDE.md` (section « Spécifique à Claude Code ») pour la valeur à utiliser avec Claude Code.

**Types acceptés :**
- `FEATURE:` Nouvelle fonctionnalité
- `FIX:` Correction de bug
- `UPGRADE:` Amélioration/refactor majeur
- `DOCS:` Documentation
- `STYLE:` Changements esthétiques/design
- `BLOG:` Nouvel article ou mise à jour article blog
