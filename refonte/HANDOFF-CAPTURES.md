# 📸 Handoff captures produit — pour le PC Windows

> Objectif : remplacer les **placeholders gris** (« Aperçu — … ») par de **vraies captures** de `app.odocpilot.com`, et fournir le hero + l'OG image. Le founder fournit les captures depuis l'autre PC ; le PC Windows les implante.

## 1. Où déposer les fichiers
Créer le dossier : **`/public/images/features/`** (+ `/public/images/` pour le hero/OG).

## 2. Format
- **WebP** (fallback PNG accepté), ratio **16:10**, ~**1600×1000 px**, **< 200 Ko** chacune (compresser).
- **Thème CLAIR** de l'app (le site est désormais en clair par défaut) → cohérence visuelle.
- UI réelle, données plausibles (pas de “Lorem”), pas d'infos client réelles sensibles.

## 3. Fichiers attendus (nommage exact = id du module)
| Fichier | Module / usage |
|---|---|
| `hero-dashboard.webp` | Hero home — tableau de bord (à encaisser / devis / relances) |
| `gestion-documentaire.webp` | Gestion documentaire |
| `factures-ia.webp` | Factures (saisie auto, validation) |
| `assistant-ia.webp` | Assistant IA (question en français → réponse) |
| `analytics.webp` | Analytics / tableaux de bord |
| `equipe.webp` | Gestion d'équipe (rôles) |
| `rh.webp` | Module RH (congés) |
| `projets.webp` | Projets Kanban |
| `messagerie.webp` | Messagerie interne |
| `portail-fournisseur.webp` | Portail fournisseur |
| `connectors.webp` | Connecteurs (Drive/Dropbox) |
| `calendrier.webp` | Calendrier partagé |
| `og-image.png` | **1200×630** — image de partage social (manquante aujourd'hui, ref. `og-image.svg`) |

## 4. Câblage (fait par Claude côté refonte, ou par le PC Windows)
- `FonctionnalitesPage.tsx` → la refonte ajoutera un champ optionnel `image` par module : si présent → `<img src="/images/features/<id>.webp" loading="lazy" alt="...">`, sinon le placeholder reste. **Donc : déposer les fichiers suffit**, le rendu se branche dessus.
- Hero `HomePage` → `hero-dashboard.webp` remplacera la carte simulée.
- `index.html` / `SEOHead` → `og-image.png` (preview sociale).

## 5. Rappel déploiement (CLAUDE.md)
Le site = image Docker **baked-in** (`odoc-landing`, port 3000). Après `git pull` :
`docker build -t odoc-landing . && docker stop odoc-landing && docker rm odoc-landing && docker run -d --name odoc-landing --network coolify -p 3000:80 --restart unless-stopped odoc-landing`
⚠️ Ne **jamais** toucher `odoc-frontend` (le SaaS, port 3001).
