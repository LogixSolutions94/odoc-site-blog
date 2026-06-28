# SEO — Correctif d'indexation (Google Search Console) — 2026-06-28

Trace du travail fait suite aux erreurs « Pourquoi des pages ne sont pas indexées » remontées par Search Console (3 mois : 30 clics · 1 180 impressions · CTR 2,5 % · position moyenne 14,6).

## Erreurs GSC constatées

| Statut GSC | Pages | Lecture |
|---|---|---|
| Page en double sans URL canonique sélectionnée par l'utilisateur | 3 | URL mortes servies en 200 + même contenu 404 → groupées en doublons |
| Autre page avec balise canonique correcte | 2 | **Bénin** : variantes (www / slash final) qui canonicalisent correctement |
| Introuvable (404) | 2 | Anciennes URL d'une structure pré-refonte (≠ les articles de blog, toujours publiés) |
| Explorée, actuellement non indexée | 2 | Soft-404 / contenu mince sur les URL mortes |

## Cause racine

Le site est un **SPA** : nginx renvoie **HTTP 200 + la coquille `index.html` pour n'importe quelle URL**, même morte.

- La page **404** ne déclarait ni `noindex` ni canonical → toutes les URL mortes rendaient le même contenu → Google les classait en **doublon** / **soft-404**.
- Un **article supprimé** faisait un **redirect JS** vers `/blog` (invisible pour Google, qui restait sur un 200 trompeur) → même symptôme.

## Correctif livré — PR #12 (commit `17cfe7f`, mergé `4f9bf7e`)

- **`src/pages/NotFound.tsx`** : ajout du flag `noindex` (déjà supporté par `SEOHead`). Toute URL morte dit explicitement à Google de ne pas l'indexer.
- **`src/pages/BlogPostPage.tsx`** : un slug inexistant/supprimé rend désormais `<NotFound />` (404 `noindex`) au lieu du redirect soft. Imports inutiles retirés (`useNavigate`, `useToast`).
- `tsc --noEmit` : OK.

## Déploiement — fait & vérifié (2026-06-28)

- Auto-deploy `.github/workflows/deploy.yml` déclenché au merge → run = **success**.
- Image `odoc-landing` reconstruite (`image_created=2026-06-28T04:46:40Z`), `restarts=0`, **HTTP 200**.
- **Bonus majeur** : ce build met enfin en ligne la refonte → le **sitemap live** contient maintenant `/artisans`, `/e-facture`, `/guide/*`, `/comparatif/*`, pages métiers, et **28 articles** (régénéré depuis Supabase via le Dockerfile). `/artisans` ne renvoie plus 404.
- Note : le `sitemap.xml` n'est **pas** committé à la main — il se régénère à chaque build Docker (clé Supabase injectée). Ne jamais committer un sitemap généré en local (il sortirait sans articles).

## À FAIRE côté humain (Search Console) — après ce déploiement

1. **Search Console → Indexation → Pages** : sur chaque catégorie d'erreur, cliquer **« Valider la correction »** pour forcer le recrawl (à faire **maintenant**, le déploiement est live).
2. **Inspection d'URL** sur 2-3 pages clés à fort intent (`/e-facture`, un `/guide/*`, un `/comparatif/*`) → **« Demander une indexation »** (elles étaient absentes/404 avant, elles sont maintenant servies).
3. Les 2 « Introuvable (404) » : si ce sont d'anciennes URL définitivement disparues, les laisser tomber (le `noindex` 404 + l'absence du sitemap suffisent à les faire sortir de l'index). Si une correspond à une vraie page renommée, ajouter une redirection 301 nginx.
4. Re-checker la perf à J+15/J+21 : les impressions montaient déjà (courbe du 19/06) ; l'objectif est de passer les pages clés de la position ~14 (page 2) au top 10.
