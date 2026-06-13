# 🚀 HANDOFF DÉPLOIEMENT — à lire en premier (PC Windows / opérateur)

> **Mis à jour : 2026-06-13.** Ce document **remplace** les consignes datées de `TODO.md` et `refonte/DEPLOY-WINDOWS.md` (qui parlaient d'une branche `feat/refonte-conversion` — **déjà fusionnée**).
> **Tout le travail de refonte est sur `main`, poussé sur GitHub. Rien n'est encore en ligne.** Il reste à **déployer** + 3 réglages d'infra.

---

## ⚠️ Règles d'or (NE JAMAIS enfreindre)
1. On ne déploie QUE **`odoc-landing`** (le site, port 3000). **NE JAMAIS toucher `odoc-frontend`** (le SaaS, port 3001).
2. Image Docker **baked-in** → `docker restart` seul **ne déploie PAS**. Il faut **rebuild** à chaque fois.

---

## 1) DÉPLOYER MAINTENANT (met en ligne tout le travail)

Sur le **VPS** `151.80.144.236` (le Mac n'a pas la clé SSH autorisée → faire depuis le PC qui l'a), dans le dossier du repo `odoc-landing` :

```bash
git pull origin main
docker build -t odoc-landing .
docker stop odoc-landing && docker rm odoc-landing
docker run -d --name odoc-landing --network coolify -p 3000:80 --restart unless-stopped odoc-landing
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000      # attendu : 200
```

> ⚠️ **`.env` sur le VPS** : les variables `VITE_*` sont **cuites au build**. Le `.env` du VPS doit contenir (cf. `.env.example`) : `VITE_SUPABASE_URL`, `VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_APP_URL`, et **les 2 nouvelles** : `VITE_UMAMI_SRC`, `VITE_UMAMI_WEBSITE_ID`. Si elles manquent, le site marche mais l'analytics reste inactif (volontaire).

### ✅ Vérif post-déploiement (dans le navigateur, sur https://odocpilot.com)
- [ ] Accueil **centré**, hero « La réforme de la facture électronique arrive… », thème clair par défaut.
- [ ] **Thème sombre = noir + ORANGE** (plus de bleu/cyan). Tester le bouton de thème.
- [ ] `/e-facture`, `/pricing` (49/89/149), `/fonctionnalites` (aperçus produit), `/a-propos`, `/roadmap`, `/changelog`, `/diagnostic`, `/generateur-factur-x`, `/artisans`, `/commerce`, `/professions-liberales`, `/cabinets-comptables` → tous **200**, pas de 404.
- [ ] **Aucun** claim retiré encore visible (NF Z42-013, « 99.9% uptime », « OS d'entreprise », « 1000 entreprises »).
- [ ] Un article de blog en mode clair = **texte lisible** (plus de texte blanc invisible).

---

## 2) AUTO-DÉPLOIEMENT (pour ne plus jamais le faire à la main)

Le workflow GitHub Actions `.github/workflows/deploy.yml` existe mais **échoue** (secrets absents → ~7 s). Poser **4 secrets** (Repo GitHub → Settings → Secrets and variables → Actions) :

| Secret | Valeur |
|---|---|
| `VPS_HOST` | `151.80.144.236` |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | la **clé privée SSH** qui ouvre le VPS (celle du PC) |
| `VPS_REPO_DIR` | le chemin du repo `odoc-landing` sur le VPS |

→ Ensuite, **chaque `git push` sur `main` redéploie tout seul**. (Déclenchement manuel possible : onglet Actions → Run workflow.)

---

## 3) MESURE D'AUDIENCE UMAMI — créer le sous-domaine HTTPS

Le code est prêt (`src/lib/analytics.ts`) : il charge Umami **en HTTPS uniquement** et **seulement après consentement** (RGPD). Tant que l'URL HTTPS n'existe pas, l'analytics reste **inactif** (volontaire — on ne réintroduit pas de « mixed-content »).

**À faire (infra VPS)** : exposer l'instance Umami (conteneur, port `3002`) derrière un sous-domaine **HTTPS** :
- Créer `analytics.odocpilot.com` → reverse-proxy nginx + certificat Let's Encrypt → `http://127.0.0.1:3002`.
- Vérifier que `https://analytics.odocpilot.com/script.js` répond (200).
- (Optionnel) surcharger via `.env` : `VITE_UMAMI_SRC` / `VITE_UMAMI_WEBSITE_ID` (les défauts pointent déjà vers ce sous-domaine + le bon website-id).

Vérif : sur le site déployé, refuser les cookies → aucun script `script[data-odoc-analytics]` ; accepter → le script HTTPS se charge.

---

## 4) OG IMAGE (preview sur LinkedIn / X / Facebook)

Aujourd'hui `og:image` pointe vers un **`.svg`** → **ignoré par les réseaux sociaux**. Il faut un **PNG/JPG 1200×630**. Le design est prêt : **`public/og.html`**.

**Générer le PNG** (au choix) :
- Ouvrir `public/og.html` dans un navigateur à **1200×630** et faire une **capture** → enregistrer en `public/og-image.png`.
- Ou en CLI sur le PC : headless Chrome / `cwebp` / un screenshot tool sur `og.html`.

**Puis pointer les balises dessus** (2 fichiers) :
- `src/components/SEOHead.tsx` → `DEFAULT_OG_IMAGE = ${BASE_URL}/og-image.png` (au lieu de `.svg`).
- `index.html` → `og:image` et `twitter:image` → `https://odocpilot.com/og-image.png`.

Puis rebuild/redeploy (étape 1). *(Tester ensuite sur https://www.opengraph.xyz ou le LinkedIn Post Inspector.)*

---

## 5) (Optionnel) VRAIES CAPTURES PRODUIT

La page `/fonctionnalites` affiche désormais des **aperçus produit designés** (composant `src/components/FeaturePreview.tsx`) — honnêtes, fidèles aux vraies fonctions, sans rien inventer. **Pas d'action requise** pour déployer.

Si tu veux de **vraies captures** de l'app connectée : capture ces écrans en `.webp` (≤150 Ko) — *extraction d'une facture · recherche GED en langage naturel · chat Brain sourcé · génération Factur-X · export FEC* — et passe-les à Claude (côté Mac), qui remplacera les aperçus designés par les vraies captures.

---

## 6) BUG SEO À TRAITER CÔTÉ AGENT SEO (odoc-pulse, pas ici)

Le **prerender du blog** (`scripts/prerender-blog.ts`) lit les colonnes `json_ld`, `schema_faq`, `meta_description`. Si elles n'existent pas dans la table Supabase `blog_posts`, le SELECT échoue → **0 article prérendu** → articles **invisibles** pour Google et les bots IA. *(Non corrigé ici : impossible de vérifier le schéma de la DB depuis le Mac — REST 401 — et ce pipeline appartient à l'agent SEO côté `odoc-pulse`.)* → **À vérifier/corriger là où le schéma de la base est connu.**

---

## 🔁 État des branches
- **`main`** = à jour, tout le travail dessus. C'est ce qu'on déploie.
- Aucune branche à fusionner. (Les anciennes consignes « merge `feat/refonte-conversion` » sont **obsolètes**.)

*Questions / blocages → Claude côté Mac connaît le détail de chaque commit.*
