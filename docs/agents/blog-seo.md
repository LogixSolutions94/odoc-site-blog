# Blog — pipeline de génération d'article & règles SEO

> Détail opérationnel du blog OdocPilot. La bible SEO complète (philosophie, silos, checklist 32 points, schema, AEO/GEO, maillage...) vit dans `SEOBlog.md` à la racine du repo et doit être lue en entier avant de générer ou modifier un article (règle absolue rappelée dans `AGENTS.md`).

---

## Workflow de génération d'article (Pipeline Perplexity → agent → Supabase)

```
ÉTAPE 1 — BRIEF (fourni par le demandeur via Perplexity)
  Le brief suit EXACTEMENT le template Section 3 de SEOBlog.md
  Il contient : KW principal, intent, angle unique, outline H2/H3, sources

ÉTAPE 2 — GÉNÉRATION (l'agent)
  1. Lire SEOBlog.md en entier (via @SEOBlog.md dans AGENTS.md)
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

## Template frontmatter article blog

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

## Règles spécifiques au blog OdocPilot

- **Ton** : Direct, concret, terrain. Voix d'un fondateur qui connaît les PME françaises.
- **Audience** : Dirigeants TPE/PME France, 35-55 ans, secteur BTP/artisans en priorité.
- **Produit** : OdocPilot = copilote IA français de **facturation & conformité** pour TPE/PME et indépendants. Wedge = **e-facturation 2026/2027** (Factur-X EN 16931, lecture IA des factures, GED, export FEC, copilote Brain). Données ET IA en France (Mistral). Tarifs **49/89/149 €** + palier Conformité gratuit, essai 14 j sans CB. ⚠️ PÉRIMÉ : « tout-en-un CRM/N8N/79€/self-hosted ».
- **Différenciation** : « **l'IA prépare l'admin du dirigeant de TPE, vous validez en 1 clic** » (jamais « l'IA exécute seule »). Créneau vide vs Pennylane (cabinet) / Qonto (banque) / Indy (compta TNS).
- **CTA principal** : `<a href="https://app.odocpilot.com/signup">Essayer OdocPilot 14 jours — gratuit, sans CB</a>`
- **Ne JAMAIS** utiliser le langage GPT générique (voir liste Section 14.3 de SEOBlog.md)
- **Toujours** inclure au moins 1 stat/chiffre sourcé récent (< 12 mois)
- **Toujours** inclure la section FAQ avec 4-6 questions + schema FAQPage JSON-LD

## Tâche : ajouter un article blog

```
1. Générer le brief via Perplexity (template Section 3 de SEOBlog.md)
2. Donner le brief à l'agent — il lit SEOBlog.md automatiquement via @SEOBlog.md
3. L'agent génère le contenu Markdown complet avec frontmatter + JSON-LD
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
