# 🚀 DEVELOPMENT_GUIDE — Guide pratique pour développer sur Odoc

**Comment travailler efficacement sur le landing page, blog et SaaS Odoc**

---

## 🎯 **AVANT DE COMMENCER**

### Checklist pré-développement
```bash
# 1. Lire CLAUDE.md (contexte projet)
cat CLAUDE.md

# 2. Consulter WORK_LOG.md (historique & tâches)
cat WORK_LOG.md

# 3. Vérifier l'environnement local
node --version         # v18+ requis
npm --version          # v9+
git --version

# 4. Cloner et installer
git clone https://github.com/LogixSolutions94/odoc-insights-hub.git
cd odoc-insights-hub
npm install
npm run dev           # Démarrer sur http://localhost:5173
```

---

## 📱 **STRUCTURE FICHIERS CLÉS**

```
odoc-insights-hub/
├── CLAUDE.md                      ← TOUJOURS LIRE EN PREMIER
├── WORK_LOG.md                    ← Log de tous les travaux
├── DEVELOPMENT_GUIDE.md           ← Ce fichier
│
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx           ← Landing hero + modules
│   │   ├── PricingPage.tsx        ← Pricing 4 plans
│   │   ├── FonctionnalitesPage.tsx ← 11 modules détaillés
│   │   ├── BlogPage.tsx           ← Blog listing
│   │   ├── BlogPostPage.tsx       ← Article individuel
│   │   ├── ContactPage.tsx        ← Formulaire
│   │   ├── AProposPage.tsx        ← À propos
│   │   └── ...autres
│   │
│   ├── components/
│   │   ├── SiteHeader.tsx         ← Navigation (MODIFIER ICI pour CTA)
│   │   ├── SiteFooter.tsx
│   │   ├── MotionDiv.tsx          ← Animations Framer
│   │   ├── SEOHead.tsx            ← SEO/helmet
│   │   └── /ui/                   ← shadcn/ui buttons, cards, etc.
│   │
│   ├── integrations/
│   │   └── supabase/client.ts     ← Config Supabase
│   │
│   ├── App.tsx                    ← Routes principales
│   ├── index.css                  ← Thème + variables CSS
│   └── main.tsx
│
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
│
└── vite.config.ts                 ← NE PAS MODIFIER

```

---

## 🔥 **TÂCHES COURANTES & HOW-TO**

### 1. Modifier le hero de la landing page
```
Fichier: src/pages/HomePage.tsx (lignes 114-176)

Que modifier:
- Badge texte (ligne 135)
- H1 principal (ligne 138-141)
- Sous-titre (ligne 144-146)
- Bouton CTA (ligne 150)
- Seconde CTA (ligne 154)

Exemple:
<h1>Nouvel H1</h1>
<Button>Nouveau CTA</Button>
```

### 2. Ajouter un nouveau plan pricing
```
Fichier: src/pages/PricingPage.tsx (lignes 16-90)

Ajoute un objet au tableau plans[]:
{
  name: "Nouveau Plan",
  badge: "Label",
  monthlyPrice: 99,
  annualPrice: 79,
  features: [
    "Feature 1",
    "Feature 2",
  ],
  cta: "Texte du bouton",
  ctaLink: `${APP_URL}/signup`,
  external: true,
  highlight: false,  // true = highlight bleu
}

Redéploie:
npm run build
scp -i ~/.ssh/odoc_vps_rsa -r dist/* root@151.80.144.236:/var/www/odoc/
```

### 3. Écrire un article blog
```
Normalement les articles sont créés par le PIPELINE (odoc-pulse / n8n), pas à la main.
Pour un INSERT manuel de secours, utiliser les VRAIES colonnes du schéma live :
cover_image_url (PAS cover_image) ; status OBLIGATOIRE (sinon reste 'draft' = invisible,
RLS) ; silo pour le clustering ; seo_title / seo_description pour les metas servies.

INSERT INTO blog_posts (title, slug, content, excerpt, cover_image_url, silo,
                        seo_title, seo_description, status, published_at)
VALUES (
  'Titre Article',
  'titre-article',
  '# Markdown content...',
  'Courte description',
  'https://image.url',
  'facturation-electronique',
  'Titre SEO 55-60 car.',
  'Meta description 150-160 car.',
  'published',
  NOW()
);

Article apparaît auto sur:
- https://odocpilot.com/blog
- https://odocpilot.com/blog/titre-article (si slug = titre-article)
```

### 4. Ajouter un nouveau module
```
Fichier 1: src/pages/FonctionnalitesPage.tsx (tableau modules[])
{
  id: "mon-module",
  icon: MonIcon,  // De lucide-react
  title: "Mon Module",
  description: "Description...",
  benefits: ["Benefit 1", "Benefit 2"],
  screenshotLabel: "Aperçu — Mon Module"
}

Fichier 2: src/pages/HomePage.tsx (tableau tools[])
{ icon: MonIcon, emoji: "🆕", title: "Mon Module", description: "..." }

Import: src/pages/HomePage.tsx (ligne 9-34)
import { MonIcon } from "lucide-react";
```

### 5. Modifier le header/navigation
```
Fichier: src/components/SiteHeader.tsx

- Logo (ligne 23)
- Nav links (ligne 8-14)
- Login button (ligne 37)
- CTA "Essai gratuit" button (ligne 40-42) ← UPGRADE RÉCENT

Règle: Tous les liens externes pointent vers APP_URL
<a href={`${APP_URL}/signup`}>Essayer gratuitement</a>
```

### 6. Ajouter une nouvelle page
```
1. Créer /src/pages/MaPage.tsx

import { SEOHead } from "@/components/SEOHead";
import { MotionDiv } from "@/components/MotionDiv";

export default function MaPage() {
  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Titre de la page"
        description="Meta description"
        canonical="/ma-page"
      />
      
      <MotionDiv>
        Contenu...
      </MotionDiv>
    </div>
  );
}

2. Ajouter la route dans src/App.tsx
3. Ajouter le lien dans SiteHeader.tsx si navigation principale
4. Commit & redéployer
```

### 7. Modifier les couleurs/thème
```
Fichier: src/index.css (lignes 8-54)

Palette actuelle (Navy Premium):
--primary: hsl(214 80% 18%)         ← Navy profond
--primary-glow: hsl(217 75% 40%)    ← Navy lumineux
--accent: hsl(217 75% 42%)          ← Bleu électrique

Changement:
@layer base {
  :root {
    --primary: hsl(214 80% 18%);    ← Modifier la hue/sat/light
    ...
  }
}

Utilisation dans les composants:
className="bg-primary text-primary-foreground"
```

### 8. Ajouter une animation
```
TOUJOURS utiliser MotionDiv, JAMAIS motion.div

import { MotionDiv } from "@/components/MotionDiv";

<MotionDiv
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1, duration: 0.5 }}
  viewport={{ once: true }}
>
  Contenu animé
</MotionDiv>

Options courantes:
- initial: État initial
- whileInView: État quand visible
- transition: { delay: 0.1, duration: 0.5 }
- viewport: { once: true } (anime une seule fois)
```

### 9. Modifier SEO d'une page
```
Chaque page DOIT avoir SEOHead:

<SEOHead
  title="Titre unique (60 chars max)"
  description="Description (160 chars max)"
  canonical="/page-path"
  jsonLd={schemaObject}  // Optionnel
/>

Exemples bons titres:
- "Odoc — OS d'entreprise IA | Copilot pour TPE/PME"
- "Tarifs — Odoc | Pricing simplifié de l'OS d'entreprise IA"
- "Fonctionnalités — Odoc | Les 11 modules..."
```

---

## 🐛 **DEBUGGING & TROUBLESHOOTING**

### Build échoue
```bash
# 1. Vérifier les erreurs TypeScript
npm run build  # Lire le message d'erreur

# Erreur commune: Import dupliqué Lucide
❌ import { FileText } from "lucide-react";
❌ import { Calendar } from "lucide-react";

✅ import { FileText, Calendar } from "lucide-react";

# 2. Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run build
```

### motion.div error
```
❌ JAMAIS:
import { motion } from "framer-motion";
<motion.div>...</motion.div>

✅ TOUJOURS:
import { MotionDiv } from "@/components/MotionDiv";
<MotionDiv>...</MotionDiv>
```

### App.odocpilot.com ne redirige pas
```
Vérifier dans le code:
const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";

Si elle pointe vers app.odoc.fr:
❌ ANCIEN
const APP_URL = "https://app.odoc.fr";

✅ CORRECT
const APP_URL = "https://app.odocpilot.com";
```

### Page blanche après déploiement
```
1. Vérifier Nginx config
ssh -i ~/.ssh/odoc_vps_rsa root@151.80.144.236 "nginx -t"

2. Vérifier les fichiers sur VPS
ssh -i ~/.ssh/odoc_vps_rsa root@151.80.144.236 "ls -la /var/www/odoc/"

3. Vérifier les logs
ssh -i ~/.ssh/odoc_vps_rsa root@151.80.144.236 "tail -20 /var/log/nginx/error.log"

4. Si besoin, redéployer
npm run build
scp -i ~/.ssh/odoc_vps_rsa -r dist/* root@151.80.144.236:/var/www/odoc/
```

---

## ✅ **CHECKLIST AVANT DE COMMIT**

```
□ Lire CLAUDE.md (règles projet)
□ Code fonctionne localement : npm run dev
□ Build compile sans erreurs : npm run build
□ TypeScript strict validé
□ MotionDiv utilisé (jamais motion.div)
□ Import Lucide non dupliqué
□ APP_URL = app.odocpilot.com
□ SEOHead présent sur nouvelles pages
□ Responsive testé (mobile + desktop)
□ Pas de hardcoding URLs
□ Pas de CSS inline
□ Images optimisées (placeholders OK)
□ Git message clair & descriptif
□ Mettre à jour WORK_LOG.md

Exemple commit:
git add src/
git commit -m "FEATURE: Ajouter nouveau module Calendrier"
```

---

## 🚀 **DÉPLOIEMENT COMPLET**

```bash
# 1. Développer localement
npm run dev  # Tester

# 2. Vérifier le build
npm run build  # Doit compiler

# 3. Commit
git add .
git commit -m "TYPE: Description"
git log --oneline -1  # Vérifier

# 4. Déployer sur VPS
scp -i ~/.ssh/odoc_vps_rsa -r dist/* \
    root@151.80.144.236:/var/www/odoc/

# 5. Vérifier que c'est live
curl -I https://odocpilot.com  # Doit retourner 200

# 6. Logs Nginx
ssh -i ~/.ssh/odoc_vps_rsa root@151.80.144.236 \
    "tail -5 /var/log/nginx/access.log"
```

---

## 📚 **RESSOURCES**

| Resource | URL | Usage |
|----------|-----|-------|
| **React Docs** | https://react.dev | Composants React |
| **Tailwind CSS** | https://tailwindcss.com | Styling |
| **shadcn/ui** | https://ui.shadcn.com | Composants pré-faits |
| **Lucide Icons** | https://lucide.dev | Icons library |
| **Framer Motion** | https://www.framer.com/motion | Animations |
| **Vite Docs** | https://vitejs.dev | Build tool |
| **Supabase** | https://supabase.io | Backend (blog) |

---

## 💬 **QUESTIONS COURANTES**

**Q: Je dois ajouter une nouvelle librairie npm?**
A: Non, demande d'abord. Le stack est figé (React, Tailwind, shadcn, Framer).

**Q: Où les images vont?**
A: /public pour les statiques, ou URLs externes pour images dynamiques.

**Q: Comment mettre à jour le blog?**
A: Directement dans Supabase table blog_posts. Les articles apparaissent auto.

**Q: Comment tester le déploiement avant de pousser?**
A: `npm run build` compile le code. Puis test local avec `npm run preview`.

**Q: Qui a accès au VPS?**
A: Root avec clé SSH ~/.ssh/odoc_vps_rsa (LogixSolutions94).

**Q: Quand redéployer?**
A: Après chaque commit. `npm run build` puis `scp dist/* VPS:...`

---

## 🎓 **TRAINING MODULES**

Pour chaque nouveau dev sur Odoc:

1. **Jour 1:** Lire CLAUDE.md + ce guide
2. **Jour 2:** Modifier une petite chose (ex: badge text)
3. **Jour 3:** Ajouter un module ou article blog
4. **Jour 4:** Déployer un changement complet

---

**Document à jour: 2026-04-07**
**Version:** 1.0
**Maintainer:** Claude AI
**Questions?** Consulte CLAUDE.md section "Questions? Besoin d'aide?"
