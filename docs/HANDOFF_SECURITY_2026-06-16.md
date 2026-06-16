# 🤝 HANDOFF — Sécurité odoc-site-blog (juin 2026)

**Objet** : tout ce qui reste à faire APRÈS le merge de la [PR #3](https://github.com/LogixSolutions94/odoc-site-blog/pull/3) (`chore/security-hardening`). À exécuter dans l'ordre ci-dessous **depuis le PC Windows** (le Mac n'a pas la clé SSH active sur le VPS — cf. [`odoc-pulse-vps-access`]).

> Ce document est la **source unique** de la séquence de déploiement. Si une étape échoue, **ARRÊTER et signaler** — ne pas continuer.

---

## ⏱️ TL;DR — 6 étapes, ~30 min

1. Merger la PR #3 sur `main` (déclenche le build Docker auto, mais sans secrets ⇒ EFs cassées tant que pas étape 2)
2. **Avant que les secrets ne soient posés**, ne pas tester les EFs durcies — elles renverront 500 (`server misconfiguration`)
3. Poser les 2 secrets Supabase (`SITEMAP_WEBHOOK_SECRET`, `NEWSLETTER_TOKEN_SECRET`)
4. Appliquer la migration SQL en `psql` (idempotente)
5. Poser le GUC Postgres + rejouer `fix_trigger.sql`
6. Smoke tests post-déploiement

---

## 🟢 Étape 1 — Merger la PR #3

```bash
gh pr merge 3 --merge --delete-branch
# ou via GitHub UI : "Merge pull request"
```

Une fois mergée, la GH Action `Déploiement odoc-landing (VPS)` se déclenche :
- `git pull origin main`
- `docker build -t odoc-landing .` (Node 22, nginx 1.27)
- `docker stop/rm/run odoc-landing`
- Vérifie `http://127.0.0.1:3000 == 200`

➡️ **Observer le run dans GitHub Actions**. S'il échoue, la prod tourne encore sur l'image précédente — pas de coupure.

⚠️ **CONFLIT POTENTIEL (déjà vu la dernière fois) — comment l'éviter :**
- La branche `feat/blog-refonte-premium` ([PR #2](https://github.com/LogixSolutions94/odoc-site-blog/pull/2)) contient ses propres modifs sur `nginx.conf` et `Dockerfile`. Si elle est mergée APRÈS #3 sans rebase, ça écrase les headers de sécu.
- **Règle** : si #2 doit aussi partir, rebase #2 sur `main` (post-#3) AVANT son merge. Vérifier ensuite que `nginx.conf` contient bien les `add_header Strict-Transport-Security` et que `Dockerfile` est sur `node:22-alpine`.

---

## 🟢 Étape 2 — Poser les secrets Supabase

⚠️ **DEUX secrets différents**, générés indépendamment. **Aucun ne doit fuiter dans Git, Coolify UI exposée, ni dans cette mémoire**.

```bash
# Sur le PC :
supabase login   # (si pas déjà fait)
supabase link --project-ref vvpkuoiugrnxdacgbiby

# Générer 2 secrets distincts :
SECRET_SITEMAP=$(openssl rand -hex 32)
SECRET_NEWSLETTER=$(openssl rand -hex 32)

# Les poser :
supabase secrets set SITEMAP_WEBHOOK_SECRET="$SECRET_SITEMAP"
supabase secrets set NEWSLETTER_TOKEN_SECRET="$SECRET_NEWSLETTER"

# Garder ces valeurs au chaud quelque part de sûr (1Password, Bitwarden).
# SECRET_SITEMAP sera réutilisé à l'étape 4.
echo "=== À COLLER DANS UN COFFRE-FORT ==="
echo "SITEMAP_WEBHOOK_SECRET=$SECRET_SITEMAP"
echo "NEWSLETTER_TOKEN_SECRET=$SECRET_NEWSLETTER"
echo "====================================="
```

Vérifier que les secrets sont posés :
```bash
supabase secrets list
# Doit lister SITEMAP_WEBHOOK_SECRET et NEWSLETTER_TOKEN_SECRET
```

---

## 🟢 Étape 3 — Déployer les EFs durcies

Les 6 EFs sont prêtes dans le repo après merge :
- `send-contact-email` (sanitize + rate-limit)
- `publish-blog-post` (timing-safe + erreurs génériques)
- `sitemap` (GET-only + cache)
- `sitemap-refresh` (requiert X-Webhook-Secret)
- `subscribe-newsletter` **(NOUVELLE)**
- `unsubscribe-newsletter` **(NOUVELLE)**

```bash
# Depuis le repo cloné sur le PC :
git pull origin main
supabase functions deploy send-contact-email
supabase functions deploy publish-blog-post
supabase functions deploy sitemap
supabase functions deploy sitemap-refresh
supabase functions deploy subscribe-newsletter
supabase functions deploy unsubscribe-newsletter
```

Vérifier le déploiement :
```bash
supabase functions list
# Toutes en STATUS = ACTIVE
```

⚠️ **`send-contact-email` était déjà cassée AVANT cette PR** (HTTP 500 `worker boot error: failed to read path`). Le redéploiement DOIT régler ce problème. Si l'erreur persiste, vérifier les Coolify Supabase logs (`supabase functions logs send-contact-email --tail`).

---

## 🟢 Étape 4 — Appliquer la migration SQL

**Pré-requis** : connexion `psql` au VPS. Cf. [`odoc-pulse-vps-access`] : utiliser `psql -U supabase_admin` (PAS `supabase`, le rôle propriétaire est `supabase_admin`).

```bash
# Depuis le PC (qui a la clé SSH active sur le VPS) :
scp supabase/migrations/20260616120000_security_hardening.sql \
    root@151.80.144.236:/tmp/

ssh root@151.80.144.236
# Sur le VPS :
docker exec -i $(docker ps -qf name=supabase-db) \
    psql -U supabase_admin -d postgres \
    -f /tmp/20260616120000_security_hardening.sql

# Sortie attendue : ALTER TABLE / CREATE POLICY / REVOKE / CREATE INDEX
# La migration est IDEMPOTENTE : safe à rejouer.
```

Vérifier les policies en place :
```sql
SELECT polname, polcmd, polqual::text AS using_clause
FROM pg_policy
WHERE polrelid IN ('public.blog_posts'::regclass, 'public.newsletter_subscribers'::regclass)
ORDER BY polname;

-- Doit montrer :
--  Public can read published posts | SELECT | (status = 'published'::text)
--  Service role can manage all posts | ALL | true
--  Anon can subscribe with valid email | INSERT | NULL
--  Service role can manage subscribers | ALL | true
```

---

## 🟢 Étape 5 — Activer le webhook trigger SQL

Le trigger Postgres doit connaître le secret pour le passer à l'EF `sitemap-refresh`.

```bash
# Toujours dans le psql VPS, avec la valeur SECRET_SITEMAP de l'étape 2 :
docker exec -i $(docker ps -qf name=supabase-db) \
    psql -U supabase_admin -d postgres -c \
    "ALTER DATABASE postgres SET app.sitemap_webhook_secret = '<SECRET_SITEMAP de l'étape 2>';"

# Rejouer fix_trigger.sql (le trigger lit maintenant le GUC) :
scp fix_trigger.sql root@151.80.144.236:/tmp/
docker exec -i $(docker ps -qf name=supabase-db) \
    psql -U supabase_admin -d postgres -f /tmp/fix_trigger.sql
```

**Test du trigger** : passer un article en `published` dans Studio Supabase et vérifier le log de `sitemap-refresh` :
```bash
supabase functions logs sitemap-refresh --tail
# Doit montrer : [sitemap-refresh] Google ping → 200 for slug="..."
```

Si le log montre `unauthorized` → le GUC n'a pas pris (vérifier que la session psql a été redémarrée, le `ALTER DATABASE` ne s'applique qu'aux NOUVELLES sessions).

---

## 🟢 Étape 6 — Smoke tests post-déploiement

À copier-coller dans un terminal local :

```bash
# 1. Headers sécu (doit lister 6 headers) :
curl -sI https://odocpilot.com/ | grep -iE "strict-transport|content-security|x-frame|x-content|referrer|permissions"

# 2. Sitemap-refresh sans secret (doit être 401) :
curl -s -o /dev/null -w "%{http_code}\n" -X POST \
     https://api.odocpilot.com/functions/v1/sitemap-refresh \
     -H "Content-Type: application/json" \
     -d '{"type":"INSERT","record":{"status":"published","slug":"probe"}}'
# Attendu : 401

# 3. Drafts blog (doit être [] ou 401 — JAMAIS contenu) :
PROD_ANON="$(curl -s https://odocpilot.com/assets/client-*.js 2>/dev/null | grep -oE 'eyJ[A-Za-z0-9_.-]{50,}' | head -1)"
curl -s "https://api.odocpilot.com/rest/v1/blog_posts?status=eq.draft&select=slug" \
     -H "apikey: $PROD_ANON" -H "Authorization: Bearer $PROD_ANON"
# Attendu : []

# 4. Newsletter (doit retourner success malgré email faux — test inerte) :
curl -s -X POST "https://api.odocpilot.com/functions/v1/subscribe-newsletter" \
     -H "Content-Type: application/json" \
     -H "Origin: https://odocpilot.com" \
     -d '{"email":"audit-probe@example.invalid","source":"smoke-test","website":""}'
# Attendu : {"success":true}

# 5. Contact email (test depuis le formulaire /contact, doit recevoir un email dans contact@odocpilot.com)

# 6. .well-known/security.txt (doit retourner le vrai fichier RFC 9116) :
curl -s https://odocpilot.com/.well-known/security.txt | grep "Contact: mailto:"
# Attendu : Contact: mailto:security@odocpilot.com

# 7. llms.txt (doit retourner le manifest IA, PAS le shell SPA) :
curl -sI https://odocpilot.com/llms.txt | grep "content-type:"
# Attendu : content-type: text/plain (et NON text/html)
```

Si **un seul** test échoue : revenir à l'étape correspondante.

---

## 📋 Points d'attention

### Domaine d'envoi des emails (corrigé dans Lot F)
Avant : `from: noreply@odoc.fr` — domaine **sans SPF/DKIM/DMARC** → emails marqués spam.
Maintenant : `from: noreply@odocpilot.com` — SPF + DMARC actifs sur ce domaine.

⚠️ **Pré-requis Resend** : il faut que `odocpilot.com` soit déjà vérifié dans le compte Resend (DKIM record sur le DNS). À vérifier dans Resend Dashboard > Domains. Si absent, ajouter les TXT/CNAME indiqués et attendre la validation.

### Drift Supabase
Le `.env` Git pointait sur le projet `zcc44owwgoc48c0w8k8kgocs` mais la prod tourne sur `vvpkuoiugrnxdacgbiby` (cf. `supabase/config.toml`). Le `.env` est maintenant git-ignored, mais :
- Si l'ancien projet existe encore dans le compte Supabase, **le supprimer** (sinon clés orphelines)
- Vérifier `supabase projects list`

### Banner cookies
Le banner ne s'affiche plus que sur les visiteurs **sans** clé `odoc_cookie_consent` dans localStorage. Pour le tester en post-déploiement :
```js
// Dans la console du navigateur :
localStorage.removeItem("odoc_cookie_consent"); location.reload();
```

### Page /unsubscribe
- Routée dans `App.tsx`
- `<meta robots="noindex,nofollow">` (Lot F)
- `Disallow: /unsubscribe` dans robots.txt
- Pour générer un lien de test :
  ```js
  // L'EF subscribe-newsletter renvoie un succès et stocke le HMAC en base.
  // Pour fabriquer un lien d'unsub manuel (debug seulement) :
  // 1. INSERT { email, unsubscribe_token: <hex> }
  // 2. https://odocpilot.com/unsubscribe?email=<x>&token=<token>
  ```

---

## 🔁 Rollback

Si quelque chose casse en prod après merge :

```bash
# Revert le merge sur main :
git revert -m 1 <commit-merge> --no-edit
git push origin main
# La GH Action redéploie l'image précédente (sans les changements)
```

Pour la migration SQL : aucun rollback automatique (idempotente). Si la nouvelle policy `blog_posts` casse quelque chose, la précédente était `USING (status = 'published')` — la même. Si `newsletter_subscribers` causait souci, la restaurer :
```sql
DROP POLICY "Anon can subscribe with valid email" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
FOR INSERT WITH CHECK (true);
```

---

## ✅ Definition of Done

- [ ] PR #3 mergée
- [ ] Action `deploy-odoc-landing` verte
- [ ] Les 6 EFs `ACTIVE` dans `supabase functions list`
- [ ] Migration SQL appliquée
- [ ] Secrets posés
- [ ] GUC Postgres posé
- [ ] Trigger SQL rejoué
- [ ] 7 smoke tests passent (script section "Étape 6")
- [ ] Banner cookies réapparait via "Gérer mes cookies" en footer
- [ ] Test réel : envoyer un message via `/contact` → reçu dans `contact@odocpilot.com`
- [ ] Test réel : s'inscrire newsletter via `/` → email reçu (si Resend transactionnel configuré)
- [ ] Rapport `docs/SECURITY_AUDIT_2026-06-16.md` archivé (référence permanente)

---

*Document maintenu par l'auteur de l'audit. Référence : [docs/SECURITY_AUDIT_2026-06-16.md](SECURITY_AUDIT_2026-06-16.md) + [PR #3](https://github.com/LogixSolutions94/odoc-site-blog/pull/3).*
