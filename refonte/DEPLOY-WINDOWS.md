# 🚀 Déploiement — consignes PC Windows (refonte conversion)

> **But** : mettre la refonte en ligne sur `odocpilot.com` **sans erreur**.
> La refonte est sur la branche **`feat/refonte-conversion`** (poussée sur GitHub), **basée sur `main`** (propre, sans le travail SSG en cours).

---

## ⚠️ Règles d'or (NE JAMAIS enfreindre)
1. **NE JAMAIS toucher `odoc-frontend`** (le SaaS, port 3001). On ne déploie QUE `odoc-landing` (le site, port 3000).
2. **`docker restart odoc-landing` seul NE redéploie PAS** (image Docker *baked-in*). Il faut **rebuild** l'image à chaque fois.
3. Ne pas mélanger avec la branche `feat/blog-ssr-prerender` (prérendu blog, séparé — à traiter plus tard avec le fondateur).

---

## Étape 0 — AVANT de déployer : déposer les captures (recommandé)
Pour qu'elles soient *cuites* dans l'image Docker, ajouter les captures **avant** le build, selon `refonte/HANDOFF-CAPTURES.md` :
- `public/images/features/facturation.webp`, `pilotage.webp`, `documents.webp`, `equipe.webp`
- `public/images/hero-dashboard.webp` (optionnel) · `public/og-image.png` (1200×630)
Tant qu'elles ne sont pas là, la page Fonctionnalités affiche des **placeholders propres** (pas de vide, pas d'image cassée — fallback automatique). On peut donc déployer sans, et les ajouter plus tard.

## Étape 1 — Récupérer & valider la refonte (sur le PC Windows)
```bash
git fetch origin
git checkout feat/refonte-conversion
# (optionnel) prévisualiser : bun install && bun run dev  → http://localhost:8080
```

## Étape 2 — Fusionner dans main
```bash
git checkout main
git merge feat/refonte-conversion
git push origin main
```
> ✅ Bonus : `main` contient déjà le correctif légal du 29/05 (claims NF Z42-013 / AES-256 / +200 équipes retirés). En déployant `main`, **on corrige enfin ces claims encore en ligne**.

## Étape 3 — Déployer sur le VPS (image Docker baked-in)
SSH sur le VPS (`151.80.144.236`), dans le dossier du repo `odoc-landing` :
```bash
git pull origin main
docker build -t odoc-landing .
docker stop odoc-landing && docker rm odoc-landing
docker run -d \
  --name odoc-landing \
  --network coolify \
  -p 3000:80 \
  --restart unless-stopped \
  odoc-landing
```

## Étape 4 — Vérifier
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000   # attendu : 200
curl -I https://odocpilot.com                                    # attendu : HTTP/2 200
```
Puis dans le navigateur :
- [ ] Home s'ouvre **en clair par défaut** ; le bouton ☀️/🌙 bascule clair/sombre.
- [ ] Hero « Toute la gestion de votre entreprise. Sans la paperasse. »
- [ ] Section « Vous êtes…? » (routeur ICP) cliquable.
- [ ] **`/artisans`** s'ouvre (fallback SPA nginx OK).
- [ ] `/fonctionnalites` = 4 groupes-bénéfices.
- [ ] `/pricing` = « Un seul prix. Tout compris. »
- [ ] Aucun texte techno (SHA-256 / N8N / RAG / OS) visible.

## En cas de souci
- Build Docker échoue → vérifier les logs `docker build` (souvent une dépendance ; `npm ci` se fait DANS l'image, Node y est dispo).
- Page blanche → vérifier que `dist/` a bien été généré dans l'image (étape `RUN npm run build` du Dockerfile).
- Rollback : `docker run` l'ancienne image taguée, ou `git revert` le merge puis redéployer.
