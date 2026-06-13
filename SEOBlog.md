# 📖 SEOBlog.md — La Bible SEO d'OdocPilot
> **Version** : 1.0.0 — Mai 2026  
> **Auteur** : OdocPilot / LogixSolutions94  
> **Objectif** : Méthodologie complète et reproductible pour chaque article de blog publié sur OdocPilot.  
> **Principe directeur** : Chaque article doit être **utile aux humains d'abord**, indexable ensuite.  
> **Mise à jour** : À réviser tous les trimestres ou après chaque Core Update Google.

---

## SOMMAIRE

1. [Philosophie SEO 2026](#1-philosophie-seo-2026)
2. [Architecture du contenu — Silos & Clusters](#2-architecture-du-contenu--silos--clusters)
3. [Brief SEO — Template obligatoire avant toute rédaction](#3-brief-seo--template-obligatoire-avant-toute-rédaction)
4. [Structure d'un article parfait](#4-structure-dun-article-parfait)
5. [On-Page SEO — Checklist 32 points](#5-on-page-seo--checklist-32-points)
6. [E-E-A-T — Signaux de confiance et d'expérience](#6-e-e-a-t--signaux-de-confiance-et-dexpérience)
7. [IA & Rédaction assistée — Règles d'or](#7-ia--rédaction-assistée--règles-dor)
8. [Schema Markup — JSON-LD obligatoire par type de page](#8-schema-markup--json-ld-obligatoire-par-type-de-page)
9. [AEO / GEO — Optimisation pour les IA (AI Overviews, Perplexity, Gemini)](#9-aeo--geo--optimisation-pour-les-ia)
10. [Maillage interne — Règles et automatisation](#10-maillage-interne--règles-et-automatisation)
11. [Workflow de publication — Du brief à la mise en ligne](#11-workflow-de-publication--du-brief-à-la-mise-en-ligne)
12. [KPIs & Révision du contenu](#12-kpis--révision-du-contenu)
13. [Calendrier éditorial — Priorités 2026](#13-calendrier-éditorial--priorités-2026)
14. [Annexes — Outils, ressources, exemples](#14-annexes--outils-ressources-exemples)

---

## 1. Philosophie SEO 2026

### 1.1 Le principe fondateur

> **Google récompense le contenu utile aux humains, pas le contenu écrit pour les robots.**

Depuis le Google Helpful Content System (intégré au core ranking en mars 2024) et les mises à jour 2025–2026, les règles sont claires :

- ✅ Contenu **people-first** : répond à une vraie question d'un vrai dirigeant de PME
- ✅ Contenu avec **E-E-A-T fort** : expérience terrain, expertise réelle, autorité, confiance
- ✅ Contenu **unique** : données propres, captures OdocPilot, cas client réels, formules originales
- ❌ Contenu **thin** : article < 800 mots sans substance, copié-collé de concurrents
- ❌ Contenu **scaled sans éditorial** : 100 articles IA générés sans relecture humaine
- ❌ Contenu **hors-niche** : articles sans rapport avec la gestion PME / facturation / IA

### 1.2 Nos 3 types d'articles stratégiques

| Type | Objectif | Funnel | Exemples |
|------|----------|--------|---------|
| **BOFU** (Bottom of Funnel) | Convertir | Décision | "OdocPilot vs Axonaut", "prix logiciel facturation PME 2026", "essai gratuit ERP TPE" |
| **MOFU** (Middle of Funnel) | Éduquer + qualifier | Considération | "Comment automatiser ses devis avec l'IA", "Facture X : guide complet 2026 pour artisans" |
| **TOFU** (Top of Funnel) | Attirer + créer autorité | Découverte | "Qu'est-ce qu'un OS d'entreprise IA ?", "Digitalisation PME : par où commencer ?" |

> **Règle des 80/20 :** 40 % BOFU, 40 % MOFU, 20 % TOFU. Les articles BOFU génèrent 40–60 % des conversions organiques SaaS.

### 1.3 Positionnement OdocPilot dans la SERP

Notre avantage différentiel à ancrer dans chaque article (À JOUR 06/2026 — wedge conformité) :

- **L'IA prépare, vous validez** : l'IA lit/classe/prépare l'admin du dirigeant de TPE, qui valide en 1 clic — jamais « l'IA exécute seule ». Créneau vide vs Pennylane (cabinet) / Qonto (banque) / Indy (compta TNS).
- **Wedge conformité e-facture 2026/2027** : génération Factur-X (EN 16931), lecture IA des factures, export FEC, copilote Brain. Porte d'entrée par la douleur légale, pas « OS d'entreprise ».
- **Souveraineté réelle** : données **ET** IA (Mistral) hébergées en France, RGPD, AI Act, démarche Numérique Responsable / IA frugale.
- **Cible** : dirigeant de TPE/PME et indépendant **sans expert-comptable au quotidien** (artisan/BTP, commerce/services, profession libérale). Tarifs 49/89/149 € + palier Conformité gratuit.
- ⚠️ **Termes à BANNIR (périmés)** : « OS d'entreprise », « employé IA 24h/24 », N8N/Ollama/Groq en façade, « tout-en-un 79€ », « self-hosted ». Dire « plateforme agréée (PA) », plus « PDP ».

---

## 2. Architecture du contenu — Silos & Clusters

### 2.1 Le modèle Pilier-Cluster (Hub & Spoke)

C'est le **gold standard SEO 2026** pour les SaaS B2B. L'idée : créer un réseau thématique dense qui signale à Google "ce site est une autorité sur ce sujet".

```
                    [PAGE PILIER]
               "Facturation électronique PME"
                    (5 000+ mots)
                         |
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
  [CLUSTER 1]      [CLUSTER 2]      [CLUSTER 3]
 "Facture X BTP"   "Mentions légales  "Logiciel facturation
  artisans 2026"    facture 2026"      artisan comparatif"
  (2 000 mots)      (1 500 mots)       (2 500 mots)
```

**Règles du modèle :**
- Chaque cluster pointe vers la page pilier (lien interne avec ancre riche)
- La page pilier pointe vers tous ses clusters
- Les clusters peuvent se lier entre eux horizontalement si logique
- Un silo = 1 thème central + 10 à 20 clusters

### 2.2 Nos 5 silos thématiques OdocPilot 2026 (alignés sur le wedge conformité)

> ⚠️ Les `slug` ci-dessous sont les valeurs de la colonne `category` des `blog_posts` **ET** les filtres de `src/pages/BlogPage.tsx`. **Garder les deux strictement synchronisés** (sinon un filtre ne matche aucun article).

| # | Silo (Page Pilier) | slug `category` | Priorité |
|---|-------------------|-----------------|---------|
| 1 | **Facturation électronique PME France 2026/2027** (pilier → /e-facture) | `facturation-electronique` | P0 — Urgent |
| 2 | **Obligations & calendrier** (réception 01/09/2026, émission + e-reporting 01/09/2027) | `obligations-2026-2027` | P0 |
| 3 | **Plateforme agréée (PA, ex-PDP)** — choisir, se raccorder, abandon du PPF | `plateforme-agreee` | P0 |
| 4 | **Factur-X & formats** (PDF/A-3, UBL, CII, EN 16931) | `factur-x` | P1 |
| 5 | **TPE / indépendant sans expert-comptable** (BTP, commerce, libéral) | `tpe-sans-comptable` | P0 — Verticale |

> Ancien découpage (ERP/OS d'entreprise, automatisation N8N, CRM) **abandonné** : positionnement périmé. Le wedge est la **conformité**, pas le « tout-en-un ». Différenciateur à ancrer dans chaque article : *l'IA prépare l'admin du dirigeant de TPE, vous validez* (jamais « exécute seule »). Terme officiel **« plateforme agréée (PA) »**, plus « PDP ».

### 2.3 Structure URL recommandée

```
/blog/[silo-slug]/[article-slug]
Exemple : /blog/facturation-electronique/facture-x-artisan-btp-2026
```

> Ne jamais publier un article sans avoir identifié à quel silo il appartient et quelle page pilier il doit linker.

---

## 3. Brief SEO — Template obligatoire avant toute rédaction

> **RÈGLE : Aucun article ne démarre sans ce brief complété à 100 %.**

```markdown
# BRIEF SEO — [TITRE PROVISOIRE]

## MÉTADONNÉES
- Date de création : [JJ/MM/AAAA]
- Auteur/Rédacteur : [Nom ou "IA + revue humaine"]
- Silo cible : [ex: Facturation électronique]
- Type d'article : [BOFU / MOFU / TOFU]
- URL cible : /blog/[slug]
- Deadline : [date]

## MOTS-CLÉS
- Mot-clé principal (KW1) : [ex: "facture électronique artisan 2026"]
  - Volume mensuel estimé : [ex: 880/mois]
  - Difficulté KD : [ex: 28/100]
  - Intent : [Informationnelle / Commerciale / Transactionnelle]
- Mots-clés secondaires (KW2–KW5) :
  - [kw2] | [vol] | [intent]
  - [kw3] | [vol] | [intent]
  - [kw4] | [vol] | [intent]
  - [kw5] | [vol] | [intent]
- Entités sémantiques (LSI) à inclure naturellement :
  - [terme 1], [terme 2], [terme 3], [terme 4]

## SEARCH INTENT
- Que cherche l'utilisateur ? [ex: comprendre comment se conformer à Facture X en tant qu'artisan BTP avant janvier 2026]
- Quelle action veut-il faire ensuite ? [ex: trouver un logiciel compatible ou télécharger un guide]
- Quel est son niveau de maturité ? [ex: débutant, a entendu parler de la réforme mais ne sait pas par où commencer]

## ANALYSE CONCURRENTS (TOP 3 SERP)
| URL | Points forts | Points faibles / manques |
|-----|-------------|------------------------|
| [url1] | ... | ... |
| [url2] | ... | ... |
| [url3] | ... | ... |

## ANGLE UNIQUE
> Ce que notre article fait mieux / différemment de tous ceux-là :
[ex: Nous seuls avons un cas client réel BTP + captures OdocPilot + calculateur ROI interactif]

## STRUCTURE RECOMMANDÉE (OUTLINE)
- H1 : [Titre final optimisé]
- Intro : [Accroche + problème + promesse + plan]
- H2 : [Section 1]
  - H3 : [Sous-section 1.1]
  - H3 : [Sous-section 1.2]
- H2 : [Section 2]
  ...
- H2 : FAQ — [Question 1 ? / Question 2 ? / ...]
- CTA final

## MAILLAGE INTERNE
- Lien vers pilier : [URL] — Ancre : "[texte ancre]"
- Lien vers cluster associé 1 : [URL] — Ancre : "[texte ancre]"
- Lien vers cluster associé 2 : [URL] — Ancre : "[texte ancre]"
- Lien vers page produit ou démo : [URL] — Ancre : "[texte ancre]"

## ÉLÉMENTS OBLIGATOIRES
- [ ] Capture écran OdocPilot (fonctionnalité liée au sujet)
- [ ] Donnée chiffrée originale ou stats récentes (< 12 mois)
- [ ] Témoignage / cas client OU anecdote terrain
- [ ] CTA principal : [ex: "Essai gratuit 14 jours — sans CB"]
- [ ] CTA secondaire : [ex: "Télécharger notre guide Facture X artisans"]

## SCHEMA MARKUP CIBLE
- [ ] Article / BlogPosting
- [ ] FAQPage (si section FAQ)
- [ ] HowTo (si guide étapes)
- [ ] BreadcrumbList
- [ ] SoftwareApplication (si page produit liée)

## NOMBRE DE MOTS CIBLE
- [ex: 2 200–2 800 mots]
```

---

## 4. Structure d'un article parfait

### 4.1 Anatomie complète

```
┌─────────────────────────────────────────────────────┐
│  TITRE (H1) — 55–65 caractères                     │
│  KW principal en position naturelle, < 3 premiers mots│
├─────────────────────────────────────────────────────┤
│  INTRODUCTION (150–250 mots)                        │
│  • Accroche : stat choc ou question directe         │
│  • Problème identifié (pain point PME réel)         │
│  • Promesse de l'article                            │
│  • KW principal dans les 100 premiers mots          │
├─────────────────────────────────────────────────────┤
│  CORPS — H2/H3 (2 000–3 500 mots total)            │
│  • 4–8 sections H2, chacune avec 2–4 H3            │
│  • Paragraphes courts (3–5 lignes max)              │
│  • 1 bullet list ou tableau par section si possible │
│  • 1 image (capture OdocPilot, schéma, infographie) │
│  • Données chiffrées sourcées par section           │
├─────────────────────────────────────────────────────┤
│  ATOMIC ANSWER (sous chaque H2 question)            │
│  Résumé 40–60 mots sous le titre de section         │
│  → Optimise les Featured Snippets & AI Overviews   │
├─────────────────────────────────────────────────────┤
│  SECTION FAQ (H2 : "Questions fréquentes")         │
│  • 4–6 questions réelles (Google PAA, Reddit, etc.) │
│  • Réponses 60–100 mots chacune                    │
│  • Schema FAQPage en JSON-LD                        │
├─────────────────────────────────────────────────────┤
│  CTA FINAL                                          │
│  • Bouton : "Essayer OdocPilot 14 jours — gratuit" │
│  • Ou : Télécharger [ressource liée au sujet]       │
└─────────────────────────────────────────────────────┘
```

### 4.2 Règles de rédaction

**Titre (H1) :**
- 1 seul H1 par page — jamais deux
- KW principal inclus, de préférence en début de titre
- 55–65 caractères (pour que le title tag ne soit pas tronqué)
- Format gagnant : `[Bénéfice / Problème] : [KW + contexte] (Année)`
- Exemple : `Facture électronique artisan BTP 2026 : guide complet Facture X`

**Introduction :**
- Ne jamais commencer par "Bienvenue" ou "Dans cet article"
- Commencer par le problème ou une statistique frappante
- KW principal dans les 100 premiers mots
- Promettre explicitement ce que l'article apporte

**Corps :**
- H2 = section majeure (5–10 par article)
- H3 = sous-section (2–4 par H2)
- Ne jamais sauter de niveau (H2 → H4 interdit)
- Paragraphes : 3–5 lignes, une idée par paragraphe
- Varier : texte, listes, tableaux, encadrés, images

**Longueur optimale par type :**
| Type | Longueur cible |
|------|---------------|
| Article BOFU comparatif | 2 500 – 3 500 mots |
| Guide MOFU complet | 2 000 – 3 000 mots |
| Article TOFU informatif | 1 500 – 2 000 mots |
| Page "Alternative à X" | 2 000 – 2 800 mots |
| Page pilier | 4 000 – 6 000 mots |

### 4.3 L'Atomic Answer Framework (pour Featured Snippets et AI Overviews)

Après chaque H2 posé sous forme de question (ex : "Comment fonctionne la Facture X ?"), ajouter immédiatement un paragraphe de **40–60 mots** qui répond directement et complètement à la question.

```markdown
## Comment fonctionne la Facture X pour les artisans ?

La Facture X est un format de facturation électronique hybride (PDF + données structurées XML) 
obligatoire en France pour toutes les entreprises soumises à TVA. Pour les artisans, elle doit 
être émise via une Plateforme de Dématérialisation Partenaire (PDP) agrée. OdocPilot prend en 
charge la génération et l'envoi automatique en Facture X.

[Suite de la section avec détails, exemples, captures…]
```

> Ce bloc de 40–60 mots est la cible des Featured Snippets Google et des citations IA (AI Overview, Perplexity, Gemini, ChatGPT).

---

## 5. On-Page SEO — Checklist 32 points

> À compléter pour **chaque article avant publication**. Cocher toutes les cases = article publiable.

### 📝 Rédaction & Structure
- [ ] H1 unique contenant le KW principal (55–65 chars)
- [ ] KW principal dans les 100 premiers mots
- [ ] KW principal dans au moins 1 H2
- [ ] Titre de page (title tag) = H1 ou variante proche (55–60 chars)
- [ ] Meta description rédigée (150–160 chars, KW inclus, CTA implicite)
- [ ] Structure hiérarchique correcte : H1 → H2 → H3 (jamais de saut de niveau)
- [ ] 5–10 H2 couvrant les aspects majeurs du sujet
- [ ] Paragraphes courts (3–5 lignes max)
- [ ] Au moins 1 liste à puces ou tableau dans le corps
- [ ] Section FAQ avec 4–6 questions (H2 "Questions fréquentes")
- [ ] Longueur atteinte (voir tableau section 4.2)
- [ ] Aucune répétition inutile (pas de padding pour allonger)

### 🔗 Mots-clés & Sémantique
- [ ] KW secondaires (KW2–KW5) intégrés naturellement dans le corps
- [ ] Entités LSI (termes liés sémantiquement) présents au moins 2–3 fois
- [ ] Pas de keyword stuffing (densité KW < 2 % du texte)
- [ ] Variantes longue traîne incluses dans les H3 et le corps

### 🖼️ Médias & UX
- [ ] Au moins 1 image originale (capture OdocPilot, schéma, illustration)
- [ ] Alt text de chaque image contenant le KW ou une variante descriptive
- [ ] Images compressées (format WebP, < 150 Ko chacune)
- [ ] Pas de contenu au-dessus de la ligne de flottaison bloquant le texte

### 🔗 Liens
- [ ] 3–5 liens internes (dont 1 vers la page pilier du silo avec ancre riche)
- [ ] 1–2 liens externes vers sources autoritaires (INSEE, Bpifrance, documentation officielle)
- [ ] Aucun lien brisé (vérifier avant publication)
- [ ] URL courte et descriptive (slug en minuscules, tirets, KW inclus, < 60 chars)

### 🏗️ Technique
- [ ] Balise canonical correctement définie (self-canonical)
- [ ] Schema JSON-LD ajouté (Article minimum + FAQPage si section FAQ)
- [ ] Fil d'Ariane (BreadcrumbList schema) actif
- [ ] Open Graph tags définis (og:title, og:description, og:image)
- [ ] Twitter Card définie
- [ ] Article ajouté au sitemap XML (automatique si CMS bien configuré)
- [ ] Page testée sur PageSpeed Insights (LCP < 2,5s, CLS < 0,1)
- [ ] Validé via Google Rich Results Test (schema)

### 🎯 Conversion
- [ ] CTA principal visible sans scroll (above the fold ou fin de section 1)
- [ ] CTA final en bas d'article ("Essayer OdocPilot 14 jours — sans CB")
- [ ] Lien vers page de démo ou pricing présent

---

## 6. E-E-A-T — Signaux de confiance et d'expérience

E-E-A-T = **Experience, Expertise, Authoritativeness, Trustworthiness**. C'est le cadre d'évaluation de Google pour décider si ton contenu mérite d'être bien classé.

### 6.1 Les 4 signaux et comment les intégrer

**Experience (Expérience terrain)**
- Inclure des anecdotes ou situations vécues avec de vraies PME / artisans testeurs
- Mentionner des retours utilisateurs OdocPilot réels ("Un artisan maçon de Seine-et-Marne nous a dit…")
- Ajouter des captures d'écran réelles de l'outil (pas de maquettes)
- Dater précisément les informations ("Testé en avril 2026 avec OdocPilot v1.2")

**Expertise (Maîtrise du domaine)**
- Citer des sources officielles : DGFiP, Bpifrance, CNIL, Facture X.eu
- Démontrer la compréhension technique (Facture X, flux Chorus Pro, etc.)
- Écrire avec un niveau de détail qui prouve qu'on utilise vraiment le produit
- Mentionner la stack technique si pertinent (Supabase, N8N, Ollama, Groq)

**Authoritativeness (Autorité)**
- Ajouter une bio auteur courte sur chaque article (nom, rôle, expertise)
- Construire des backlinks depuis des sites référents (France Num, cabinets comptables, blogs BTP)
- Être cité dans des annuaires sectoriels (Capterra, Appvizer, SaaSForge)
- Créer des ressources téléchargeables uniques (guides PDF, templates)

**Trustworthiness (Confiance)**
- Mentionner les certifications, conformités, labels (RGPD, Facture X compatible, hébergement OVH France)
- Afficher les CGU, mentions légales, politique de confidentialité — accessibles depuis chaque article
- Inclure des données sourcées avec liens actifs vers les sources
- Ne jamais publier de fausses statistiques ou d'informations non vérifiées

### 6.2 Template bio auteur (à ajouter en pied d'article)

```markdown
---
**À propos de l'auteur**  
[Prénom Nom] — Fondateur d'OdocPilot, développeur full-stack spécialisé dans l'automatisation 
IA pour TPE/PME françaises. Basé en Île-de-France. Accompagne des artisans et dirigeants de PME 
dans leur transformation numérique depuis [année]. [Lien LinkedIn]
---
```

---

## 7. IA & Rédaction assistée — Règles d'or

### 7.1 Ce que Google tolère et sanctionne en 2026

| Comportement | Réponse Google | Base légale |
|---|---|---|
| IA assistée + revue humaine + expertise réelle | Ranke normalement selon qualité | Conforme E-E-A-T |
| IA sans attribution auteur | Pénalité qualité (expertise non démontrée) | Quality Rater Guidelines |
| IA avec expérience terrain et données uniques | Ranke normalement si qualité suffisante | Conforme E-E-A-T Experience |
| IA en masse sans éditorial (scaled abuse) | Démotion algorithmique ou désindexation | Spam Policy |
| Contenu IA hors niche (keyword grab) | Signal d'abus de réputation du site | Site Reputation Abuse |

> **Conclusion** : L'IA est un outil de production, pas de substitution. Chaque article doit avoir une couche de valeur humaine irremplaçable.

### 7.2 Workflow IA recommandé pour OdocPilot

```
1. BRIEF (humain)
   → Remplir le template Brief SEO (section 3)
   → Identifier l'angle unique et les éléments obligatoires

2. RECHERCHE (IA + humain)
   → Perplexity : analyse SERP top 5, recherche données récentes
   → Identifier les manques dans les articles concurrents

3. OUTLINE (IA)
   → Générer une structure H2/H3 avec l'IA
   → Valider et ajuster manuellement (ajouter angle unique)

4. RÉDACTION (IA guidée + injection humaine)
   → Générer section par section (pas l'article entier d'un coup)
   → Injecter après génération :
      - Captures OdocPilot réelles
      - Données chiffrées sourcées
      - Anecdotes terrain ou citations clients
      - Atomic Answers rédigés avec précision

5. RELECTURE HUMAINE OBLIGATOIRE (30–45 min par article)
   → Vérifier exactitude factuelle
   → Éliminer le langage "GPT" (liste excessive de généralisations, formules creuses)
   → Ajouter la voix de la marque OdocPilot (directe, concrète, terrain)
   → Compléter la checklist 32 points (section 5)

6. VALIDATION TECHNIQUE
   → Google Rich Results Test
   → PageSpeed Insights
   → Vérification liens internes

7. PUBLICATION & INDEXATION
   → Soumettre l'URL dans Google Search Console
   → Ajouter à la fiche de suivi KPI (section 12)
```

### 7.3 Ce qu'il faut toujours injecter manuellement

Ne jamais laisser l'IA seule sur :
- Les **captures d'écran OdocPilot** (réelles, datées)
- Les **témoignages clients** (vrais ou paraphrasés avec accord)
- Les **données chiffrées** (vérifier la source, mettre le lien)
- Les **CTA** (texte, URL, offre en cours)
- La **date de publication** et **dernière mise à jour**
- Les **mentions légales** spécifiques au secteur (RGPD, Facture X, etc.)

---

## 8. Schema Markup — JSON-LD obligatoire par type de page

### 8.1 Pourquoi le schema markup est critique en 2026

- 72 % des résultats en première page utilisent le schema markup
- Le schema FAQPage + Article produit un lift de 3,1x en citations IA (AI Overviews)
- La combinaison FAQPage + Article + BreadcrumbList est le minimum viable pour un article blog
- Pour les pages SaaS : SoftwareApplication schema sur les pages produit

### 8.2 Template JSON-LD pour article de blog

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[TITRE H1 DE L'ARTICLE]",
  "description": "[META DESCRIPTION 150-160 CHARS]",
  "image": "https://odocpilot.com/images/blog/[slug-image].webp",
  "author": {
    "@type": "Person",
    "name": "[Prénom Nom]",
    "url": "https://odocpilot.com/about",
    "sameAs": "https://www.linkedin.com/in/[profil]"
  },
  "publisher": {
    "@type": "Organization",
    "name": "OdocPilot",
    "logo": {
      "@type": "ImageObject",
      "url": "https://odocpilot.com/logo.png"
    }
  },
  "datePublished": "[AAAA-MM-JJ]",
  "dateModified": "[AAAA-MM-JJ]",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://odocpilot.com/blog/[slug]"
  },
  "keywords": "[kw1], [kw2], [kw3]",
  "articleSection": "[Nom du silo]",
  "inLanguage": "fr-FR"
}
</script>
```

### 8.3 Template JSON-LD FAQPage (à ajouter si section FAQ présente)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question 1 ?]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Réponse complète de 60–100 mots. Doit correspondre exactement au texte visible sur la page.]"
      }
    },
    {
      "@type": "Question",
      "name": "[Question 2 ?]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Réponse 2]"
      }
    }
  ]
}
</script>
```

### 8.4 Template JSON-LD BreadcrumbList

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": "https://odocpilot.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://odocpilot.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "[Nom du Silo]",
      "item": "https://odocpilot.com/blog/[slug-silo]"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "[Titre article]",
      "item": "https://odocpilot.com/blog/[slug-silo]/[slug-article]"
    }
  ]
}
</script>
```

### 8.5 Règles impératives schema

- ✅ Les réponses FAQPage **doivent correspondre exactement** au texte visible sur la page
- ✅ Tester systématiquement via [Google Rich Results Test](https://search.google.com/test/rich-results)
- ✅ Mettre à jour le schema si le contenu change (prix, dates, réponses FAQ)
- ❌ Ne pas ajouter de schema pour du contenu qui n'est pas visible sur la page
- ❌ Ne pas sur-marquer (ajouter des types qui ne s'appliquent pas au contenu)

---

## 9. AEO / GEO — Optimisation pour les IA

**AEO** = Answer Engine Optimization (Featured Snippets, PAA Google)  
**GEO** = Generative Engine Optimization (AI Overviews, Perplexity, ChatGPT, Gemini)

### 9.1 Pourquoi c'est critique en 2026

Les AI Overviews de Google apparaissent maintenant sur 30–40 % des requêtes B2B tech. Les LLMs comme ChatGPT, Perplexity et Gemini sont de plus en plus consultés comme moteur de recherche initial par les dirigeants de PME early adopters. Être cité = visibilité + trafic de qualité.

### 9.2 Les 5 techniques de citation IA

**1. Atomic Answer sous chaque H2 question**  
(Voir section 4.3 — 40–60 mots, réponse directe et complète)

**2. Définitions claires et non ambiguës**  
Quand on mentionne un terme spécifique pour la première fois, le définir en une phrase :
```
La Facture X est un format de facture hybride (PDF lisible + données XML structurées)
rendu obligatoire par la réforme de la facturation électronique française à partir de 2026.
```

**3. Entités nommées explicites**  
Mentionner clairement : OdocPilot, Facture X, N8N, Supabase, Groq, RGPD, DGFiP, Bpifrance — les LLMs s'appuient sur la reconnaissance d'entités pour citer les bonnes sources.

**4. Données uniques et vérifiables**  
Les LLMs préfèrent citer des sources qui ont des données originales plutôt que des agrégateurs. Créer des tableaux de données propres, des calculateurs, des études de cas chiffrées.

**5. Structured data Speakable (avancé)**  
Pour les pages piliers, ajouter le schema Speakable pour indiquer aux IA quels passages sont "citationnels" :
```json
"speakable": {
  "@type": "SpeakableSpecification",
  "cssSelector": [".atomic-answer", ".key-stat"]
}
```

### 9.3 Optimisation "Click Gap"

L'AI Overview doit être utile **mais pas exhaustive** — elle doit donner envie de cliquer pour avoir le "comment" concret. Structurer son contenu ainsi :
- AI Overview obtient la réponse courte (Atomic Answer)
- L'article va plus loin avec des captures, templates, cas clients
- Le CTA invite à découvrir OdocPilot comme solution concrète

---

## 10. Maillage interne — Règles et automatisation

### 10.1 Règles fondamentales

- **Minimum 3–5 liens internes par article** — ni moins, ni beaucoup plus (éviter le link farm interne)
- **Tout cluster → son pilier** (lien obligatoire avec ancre riche contenant le KW cible du pilier)
- **Tout pilier → ses clusters** (liens vers les articles satellites)
- **Liens horizontaux** : entre clusters du même silo quand c'est logique et utile
- **Ancres riches** : pas de "cliquer ici" ou "en savoir plus", mais "[KW cible de la page destination]"
- **Profondeur max 3 clics** depuis l'accueil pour tout article important

### 10.2 Tableau de liens internes clés (à maintenir à jour)

| Page source | Page destination | Ancre recommandée | Silo |
|---|---|---|---|
| Tout article facturation | /blog/facturation-electronique/guide-complet | "guide complet Facture X PME" | Facturation |
| Tout article BTP/artisans | /blog/btp-artisans/logiciel-gestion-chantier | "logiciel gestion chantier artisans" | BTP |
| Tout article ERP/OS | /features | "fonctionnalités OdocPilot" | Produit |
| Tout article concurrents | /pricing | "tarifs OdocPilot" | Conversion |
| Tout article IA/automatisation | /blog/automatisation-ia/n8n-pme-france | "automatisation IA N8N pour PME" | IA |

### 10.3 Process de maillage à chaque publication

```
1. Ouvrir la fiche de l'article dans le CMS
2. Identifier le silo → linker vers la page pilier (ancre riche)
3. Rechercher dans le CMS les 2–3 articles du même silo → ajouter liens bidirectionnels
4. Aller sur les articles déjà publiés du même silo → ajouter un lien vers le nouvel article
5. Vérifier : au moins 1 lien vers une page produit ou pricing
6. Vérifier : aucune ancre générique ("ici", "cliquer", "ce lien")
```

> **Outil recommandé** : SeoQuantum ou Screaming Frog pour auditer le maillage interne tous les mois.

---

## 11. Workflow de publication — Du brief à la mise en ligne

```
ÉTAPE 1 — BRIEF (30 min)
  → Remplir le template Brief SEO complet (section 3)
  → Vérifier que l'angle est unique vs SERP top 3

ÉTAPE 2 — OUTLINE + RÉDACTION IA (20–40 min)
  → Générer outline avec l'IA sur base du brief
  → Rédiger section par section
  → Injecter les éléments humains obligatoires

ÉTAPE 3 — RELECTURE HUMAINE (30–45 min)
  → Lire l'article entier
  → Corriger le "langage GPT" générique
  → Vérifier exactitude factuelle (liens sources actifs)
  → Ajouter captures OdocPilot si manquantes

ÉTAPE 4 — CHECKLIST TECHNIQUE (15 min)
  → Cocher les 32 points (section 5)
  → Ajouter schema JSON-LD (section 8)
  → Tester Google Rich Results Test
  → Vérifier PageSpeed

ÉTAPE 5 — MAILLAGE INTERNE (10 min)
  → Appliquer le process section 10.3
  → Mettre à jour les articles existants du même silo

ÉTAPE 6 — PUBLICATION
  → Publier avec date et auteur
  → Open Graph + image principale définis
  → Canonical self-défini

ÉTAPE 7 — INDEXATION (5 min)
  → Soumettre l'URL dans Google Search Console (Inspection → Demander indexation)
  → Ajouter l'article à la fiche de suivi KPI

DURÉE TOTALE CIBLE : 2h–3h par article de qualité
```

---

## 12. KPIs & Révision du contenu

### 12.1 KPIs à suivre par article (Google Search Console + GA4)

| KPI | Outil | Fréquence | Seuil d'alerte |
|---|---|---|---|
| Impressions (SERP) | GSC | Mensuel | < 50 après 3 mois = retravailler |
| Clics organiques | GSC | Mensuel | CTR < 2 % = optimiser title/meta |
| Position moyenne | GSC | Mensuel | > position 20 après 6 mois = MOFU manquant |
| Temps passé sur page | GA4 | Mensuel | < 2 min = contenu peu engageant |
| Taux de rebond | GA4 | Mensuel | > 80 % = intro ou structure à revoir |
| Conversions (essai) | GA4 | Mensuel | = objectif ultime de chaque BOFU |

### 12.2 Règle de révision trimestrielle

**Tous les 3 mois**, auditer les 20 % d'articles les plus performants et les 20 % les plus faibles :

- **Top performers** : Mettre à jour les données, ajouter 200–400 mots de contenu frais, rafraîchir la date de modification
- **Underperformers** :
  - Position 20–50 → réécrire l'intro, améliorer les H2, ajouter schema
  - Position > 50 après 6 mois → fusionner avec un article similaire (canonical redirect) ou dépublier (noindex)
  - Taux de rebond élevé → restructurer le plan, améliorer le CTA

### 12.3 Tableau de suivi articles (modèle à tenir à jour)

| # | Titre | URL | Silo | Type | Date pub | Position | Clics/mois | Révision prévue |
|---|-------|-----|------|------|----------|----------|-----------|----------------|
| 1 | ... | ... | ... | BOFU | ... | ... | ... | ... |

---

## 13. Calendrier éditorial — Priorités 2026

### 13.1 Fenêtre urgente : Mai–Juillet 2026

**Objectif** : Être indexé avant le pic de recherches "facturation électronique" de août–septembre 2026.

Articles PRIORITAIRES à publier en premier :

**SILO 1 — Facturation électronique (P0 urgent)**
1. [PILIER] Guide complet Facture X PME France 2026
2. Facture X artisan BTP : comment se mettre en conformité
3. Obligations facturation électronique 2026 : calendrier et sanctions
4. Meilleur logiciel facturation électronique PME [comparatif]
5. OdocPilot vs Axonaut : lequel choisir pour la Facture X ?
6. OdocPilot vs Pennylane : comparatif 2026 pour PME
7. OdocPilot vs Sellsy : fonctionnalités, prix, verdict
8. Alternative à Axonaut pour artisans
9. Alternative à Pennylane pour TPE < 10 salariés
10. Prix logiciel facturation PME 2026 : comparatif complet

**SILO 5 — BTP & Artisans (P0 verticale)**
11. [PILIER] Logiciel gestion artisans BTP 2026 : guide complet
12. Automatiser ses devis chantier avec l'IA : guide pratique
13. Suivi de chantier digital : outils et méthodes 2026
14. OCR bons de livraison BTP : comment ça marche
15. Gestion des sous-traitants : logiciel tout-en-un pour BTP

### 13.2 Cadence cible

| Période | Articles/semaine | Focus |
|---|---|---|
| Mai–Juillet 2026 | 10–12/sem | BOFU comparatifs + Facture X + BTP |
| Août–Octobre 2026 | 7–10/sem | MOFU guides + IA/automation + CRM PME |
| Nov–Déc 2026 | 5–7/sem | TOFU autorité + mises à jour top articles |

> **Règle qualité** : mieux vaut 5 bons articles par semaine que 15 articles thin. Ne jamais sacrifier la qualité à la cadence.

---

## 14. Annexes — Outils, ressources, exemples

### 14.1 Stack d'outils SEO recommandée (solo founder budget serré)

| Outil | Usage | Coût |
|---|---|---|
| Google Search Console | Suivi positions, indexation, erreurs | Gratuit |
| Google Analytics 4 | Trafic, conversions, comportement | Gratuit |
| Ahrefs Lite ou SEMrush Guru | KW research, analyse concurrents, backlinks | ~100 €/mois |
| Surfer SEO ou NeuronWriter | Optimisation on-page (NLP, score SEO) | ~30–60 €/mois |
| Screaming Frog (free) | Audit technique, maillage interne | Gratuit (< 500 pages) |
| Google Rich Results Test | Validation schema JSON-LD | Gratuit |
| PageSpeed Insights | Core Web Vitals | Gratuit |
| Perplexity AI Pro | Recherche sources, angles, concurrents | ~20 €/mois |
| Notion / Airtable | Tableau de bord éditorial | ~10 €/mois |

### 14.2 Sources de données à citer en priorité

- DGFiP / Facture-X.eu (réforme facturation électronique)
- Bpifrance.fr (chiffres PME, digitalisation, aides)
- INSEE.fr (statistiques entreprises françaises)
- CNIL.fr (RGPD, conformité)
- France Num (baromètre digitalisation TPE/PME)
- Google Search Central (documentation officielle SEO)

### 14.3 Phrases à bannir dans les articles IA

Signaux "GPT" à repérer et éliminer lors de la relecture :
- "Dans le monde d'aujourd'hui…"
- "Il est important de noter que…"
- "En conclusion, nous avons vu que…"
- "Cet article vous a permis de comprendre…"
- "Comme nous l'avons mentionné précédemment…"
- "Sans plus attendre…"
- "Plongeons dans le vif du sujet…"

### 14.4 Exemples d'articles idéaux pour OdocPilot

**Bon titre BOFU** : `OdocPilot vs Axonaut 2026 : comparatif honnête pour artisans`  
**Bon titre MOFU** : `Facture X pour artisan BTP : 5 étapes pour être conforme avant le 1er septembre 2026`  
**Bon titre TOFU** : `OS d'entreprise IA : qu'est-ce que c'est et pourquoi votre PME en a besoin ?`  

**Mauvais titre** : `Les meilleurs logiciels de gestion pour les entreprises en 2026` (trop générique, aucun angle)

---

*Fin du document SEOBlog.md — OdocPilot v1.0.0 — Mai 2026*  
*Prochaine révision prévue : Août 2026 (après analyse des premiers résultats GSC)*
