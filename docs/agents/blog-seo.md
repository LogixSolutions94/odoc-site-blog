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
     - Maillage interne Section 10 (3-5 liens, ancres riches). NB : le site auto-lie
       en plus les termes wedge vers les piliers au rendu (autoLinkInternal), mais
       écrire les liens reste recommandé.
  3. Format : Markdown avec frontmatter YAML

ÉTAPE 3 — INSERTION SUPABASE (normalement via le pipeline odoc-pulse)
  Colonnes RÉELLES : title, slug, content, excerpt, cover_image_url, silo,
  seo_title, seo_description, status='published', published_at.
  (meta_title/meta_description tolérés en repli ; json_ld/schema_faq NON requis —
  le site les dérive du markdown.)
  ⚠️ Indexation : PAS de ping automatique (endpoint google.com/ping mort depuis 2023).
  Google recrawle le sitemap à son rythme ; soumettre l'URL dans GSC pour accélérer.
```

## Template frontmatter article blog

```yaml
---
# Colonnes blog_posts du schéma LIVE (cf. docs/seo/STRATEGIE-SEO-BLOG-2026-10.md).
title: "[TITRE H1 — 55-65 chars]"
slug: "[slug-url-article]"
excerpt: "[Chapeau 150-160 chars — sert aussi de repli meta description]"
silo: "[facturation-electronique | obligations-2026-2027 | plateforme-agreee | factur-x | tpe-sans-comptable | outils-gestion]"
seo_title: "[Title tag 55-60 chars]"
seo_description: "[Meta description 150-160 chars avec KW principal]"
seo_keywords: "[kw1, kw2, kw3]"
cover_image_url: "https://images.pexels.com/...  (ou URL .webp)"
og_image_url: "[optionnel — sinon cover_image_url sert d'image OG]"
author_name: "[nom crédible — éviter « OdocPilot » générique quand c'est possible]"
status: "published"      # OBLIGATOIRE — sinon reste 'draft' (invisible, RLS)
featured: false
published_at: "[AAAA-MM-JJ]"
updated_at: "[AAAA-MM-JJ]"
# ⚠️ Le JSON-LD (BlogPosting + FAQPage + BreadcrumbList) et la FAQ sont DÉRIVÉS du
# markdown par le site : pas de colonnes json_ld/schema_faq à remplir. La FAQ doit
# être un H2 « ## FAQ » / « ## Questions fréquentes » avec des questions en ### dans le corps.
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
4. Insérer dans Supabase table blog_posts (colonnes réelles) :
   - title, slug, content (markdown), excerpt
   - cover_image_url (PAS cover_image), silo, seo_title, seo_description
   - status: "published" (OBLIGATOIRE), published_at: NOW()
5. Déclencher un rebuild (push main, cron 17:00 UTC, ou workflow_dispatch) : le
   prerender génère dist/blog/<slug>/ et l'ajoute au sitemap. Sans rebuild, l'URL
   renvoie 404 aux crawlers jusqu'au prochain build.
6. Accessible sur /blog/titre-article
7. Indexation : soumettre l'URL dans Google Search Console (pas d'auto-ping).
```
