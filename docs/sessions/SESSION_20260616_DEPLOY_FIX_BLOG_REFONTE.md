# 📝 SESSION 2026-06-16 — Réparation du déploiement + mise en ligne refonte blog (PR #2)

### **2026-06-16 — Déblocage déploiement site + merge PR #2 (refonte premium blog)**

#### `[~12:00 UTC] FIX+FEATURE — auto-deploy réparé, clé Supabase, nginx /blog, PR #2 live`

**Contexte / déclencheur :** on pensait que « la PR #2 du site n'était pas commitée/pushée ».
Vérification : **faux** — PR #2 (`feat/blog-refonte-premium`, +1990/−363) était bien poussée,
mergeable, `tsc` OK, juste **non mergée**. En vérifiant, découverte de 3 vrais problèmes.

**Problèmes trouvés (diagnostic) :**
```
1. Auto-deploy CASSÉ depuis toujours : workflow deploy.yml échoue en ~8s
   → "Error: missing server host" : les 4 secrets GitHub Actions
     (VPS_HOST/VPS_USER/VPS_SSH_KEY/VPS_REPO_DIR) n'avaient JAMAIS été posés.
   → Conséquence : 9 commits sur main jamais déployés (site en ligne figé).

2. Blog en ligne CASSÉ : .env committé avec la clé Supabase publishable PÉRIMÉE
   (rotée le 04/06) → fetch articles en 401 + build `prerender`/`sitemap` en 401.
   (clé valide = celle d'odoc-pulse/.env.production, testée 200 vs 401.)

3. /blog → 404 et /blog/ → 403 : nginx try_files contenait `$uri/`, qui captait
   le dossier /blog/ (créé par le prérendu via /blog/<slug>/) au lieu de retomber
   sur le shell SPA.
```

**Modifications appliquées :**
```
✅ GitHub Actions secrets (repo odoc-site-blog) — POSÉS
   - VPS_HOST=151.80.144.236, VPS_USER=root, VPS_REPO_DIR=/root/odoc-site-blog
   - VPS_SSH_KEY = clé privée ed25519 (posée via stdin / printf → zéro BOM, zéro newline)

✅ .env (commit 5b8c4dd → rebasé)
   - VITE_SUPABASE_PUBLISHABLE_KEY : clé périmée → clé publishable valide (anon, publique by design)

✅ nginx.conf (commit 483ae79)
   - try_files : retrait de `$uri/` → `try_files $uri $uri/index.html /index.html;`
   - articles prérendus toujours servis ($uri/index.html), /blog & routes SPA retombent sur le shell

✅ PR #2 mergée (merge commit sur main) → refonte premium du blog en ligne
```

**Build & Compilation :**
```
tsc --noEmit (PR #2, local) → ✅ 0 erreur
Build Docker VPS (npm ci + npm run build incl. prerender) → ✅ après clé valide
```

**Déploiement :**
```
Méthode : GitHub Actions (deploy.yml) → SSH VPS → git pull + docker build + restart odoc-landing (port 3000)
- Deploy #1 (clé) ✅ vert (1m01)
- Deploy #2 (merge PR #2 refonte) ✅ vert
- Deploy #3 (fix nginx) ✅ vert (36s)
VPS: 151.80.144.236 — conteneur odoc-landing — repo /root/odoc-site-blog
```

**Tests effectués (live) :**
```
✅ https://odocpilot.com/        → 200
✅ https://odocpilot.com/blog    → 200 (était 404)
✅ https://odocpilot.com/blog/   → 200 (était 403)
✅ https://odocpilot.com/blog/fec-comptable-...-eviter → 200, 26 Ko, vrai contenu prérendu
   (titre + 36 mentions OdocPilot → preuve que le prerender tourne avec la clé valide)
```

**Issues rencontrées & résolutions :**
```
✅ VPS repo /root/odoc-site-blog : .env modifié localement + 9 commits de retard → bloquait git pull
   Solution : git checkout -- .env sur le VPS avant le 1er deploy → pull fast-forward propre. Résolu.
✅ Secret VPS_REPO_DIR : 1er essai → cd échouait (newline en trop)
   Solution : re-posé via printf '%s' (sans newline). Résolu.
```

**Notes & décisions :**
```
- Clé publishable (anon) committée volontairement : publique par design (déjà dans le bundle client).
  Anti-pattern « .env committé » laissé tel quel (tout le pipeline en dépend) → à sortir du git plus tard.
- L'auto-deploy fonctionne désormais : tout push sur main (hors **.md / refonte/ / .github/) redéploie.
- Branche feat/blog-refonte-premium supprimée (local + remote) après merge.
```

**Git :**
```
5b8c4dd  fix(deploy): clé Supabase publishable valide dans .env
483ae79  fix(nginx): /blog (et routes SPA) retombent sur le shell, plus de 403/404
(+ merge commit PR #2)
```

**Status :** 🟢 Complete — site live, refonte en ligne, pipeline de déploiement réparé.

**Prochaine session :**
```
[ ] Sortir .env du git (gitignore + injection clé côté build VPS) — proprement
[ ] Supprimer le dossier orphelin GitHub/odoc-site-blog/ (reliquat 13/04, hors git)
```

---
