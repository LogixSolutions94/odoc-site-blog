# 🔒 Audit de sécurité — odoc-site-blog (odocpilot.com)

**Date** : 2026-06-16  
**Périmètre** : site marketing + blog (odocpilot.com, container `odoc-landing`) — **PAS** le SaaS `app.odocpilot.com`  
**Méthode** : audit en lecture seule (statique + runtime read-only sur la prod). **Aucune modification appliquée.**  
**Branche analysée** : `feat/blog-refonte-premium` (`fcff29b`) + état réel de la prod (HTTP + REST/EF)

---

## 📊 Synthèse exécutive

**Verdict global** : **risque ÉLEVÉ**. 3 problèmes critiques exploitables sans aucune compétence d'attaquant (drafts publics, headers HTTP absents, spam endpoint ouvert), 5 hauts, 7 medium, 5 low. Le code source est globalement propre, mais **la prod a un drift sévère par rapport au repo Git** (RLS différente, table manquante, EF cassée).

| Sévérité | Count |
|---|---|
| 🔴 CRITIQUE | 3 |
| 🟠 HIGH | 5 |
| 🟡 MEDIUM | 7 |
| 🔵 LOW | 5 |
| ⚪ INFO | 4 |

**Ordre de correction recommandé** : C1 → C2 → C3 → H1 → H2 → H3 → H4 → H5 → medium → low.

---

## 🔴 CRITIQUE — corriger AUJOURD'HUI

### C1. Brouillons de blog publiquement accessibles via REST API
- **Surface** : `https://api.odocpilot.com/rest/v1/blog_posts?status=neq.published`
- **Preuve** (run 2026-06-16 18:36 UTC, anon key extraite du bundle JS public) :
  ```
  HTTP 200
  [{"slug":"fec-comptable-obligation-expert-comptable","status":"draft",
    "title":"FEC comptable : pourquoi votre expert-comptable l'exige …",
    "content":"# FEC comptable : pourquoi votre expert-comptable l'exige …"}]
  ```
- **Cause** : la RLS policy de la migration locale `20260315050226_*.sql:59-60` dit `USING (status = 'published')`. **Cette policy ne tient pas en prod** : drafts (slug, titre, contenu, SEO) sont lisibles par n'importe quel anon.
- **Impact** : fuite de tout contenu non-publié (stratégie SEO, articles en préparation, contenu temporaire/test, données embargoes). Concurrents peuvent surveiller la pipeline éditoriale.
- **Fix** : `psql` sur la prod →
  ```sql
  ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "Public can read published posts" ON public.blog_posts;
  CREATE POLICY "Public can read published posts" ON public.blog_posts
    FOR SELECT TO anon, authenticated USING (status = 'published');
  ```
  Vérifier ensuite via la commande curl du § Preuve (doit renvoyer `[]` ou 401).

### C2. Aucun en-tête de sécurité HTTP en prod
- **Surface** : `curl -I https://odocpilot.com/`
- **Preuve** (run 2026-06-16) :
  ```
  HTTP/2 200
  server: nginx/1.31.1
  content-type: text/html
  # AUCUN : Strict-Transport-Security, Content-Security-Policy, X-Frame-Options,
  # X-Content-Type-Options, Referrer-Policy, Permissions-Policy
  ```
- **Cause** : [nginx.conf](nginx.conf) ne définit aucun `add_header`.
- **Impact** :
  - **Clickjacking trivial** (frame depuis n'importe quel site)
  - **MITM downgrade HTTPS** (pas de HSTS)
  - **XSS non mitigé** (pas de CSP — couplé à d'autres failles aggrave fortement)
  - **MIME-sniffing** sur uploads/SVG
  - **Referer leak** (URLs blog/diagnostic envoyées à tout site externe cliqué)
  - **Fingerprinting** version nginx (1.31.1 — vérifier CVE, et préférer `server_tokens off`)
- **Fix** : patcher [nginx.conf](nginx.conf) :
  ```nginx
  server_tokens off;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
  add_header X-Frame-Options "DENY" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()" always;
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://analytics.odocpilot.com; style-src 'self' 'unsafe-inline' https://api.fontshare.com; font-src 'self' https://cdn.fontshare.com data:; img-src 'self' data: https:; connect-src 'self' https://api.odocpilot.com https://analytics.odocpilot.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;
  ```
  Tester en staging avec la console DevTools — la CSP doit être ajustée si des assets externes manquent (Umami, fonts Fontshare, etc.).

### C3. Edge Function `sitemap-refresh` ouverte sur Internet, sans aucun secret
- **Surface** : `POST https://api.odocpilot.com/functions/v1/sitemap-refresh`
- **Preuve** (run 2026-06-16) :
  ```bash
  curl -X POST https://api.odocpilot.com/functions/v1/sitemap-refresh \
       -H "Content-Type: application/json" \
       -d '{"type":"INSERT","record":{"status":"published","slug":"probe"}}'
  # → 200 OK, "ok":true,"slug":"probe","pinged":"…/sitemap"
  ```
- **Cause** : [supabase/functions/sitemap-refresh/index.ts](supabase/functions/sitemap-refresh/index.ts) — aucun check de header/secret, et `verify_jwt = false` dans [config.toml](supabase/config.toml).
- **Impact** : un attaquant peut lancer un flood d'invocations → consommation de quota Edge Function Supabase (coût €) + flood de pings Google (Google rate-limit côté lui, mais l'EF est facturée à chaque hit). DoS économique.
- **Fix** : exiger un `X-Webhook-Secret` partagé avec le trigger Postgres (qui peut le passer via `headers := '{"X-Webhook-Secret":"<secret>"}'::jsonb` dans [fix_trigger.sql](fix_trigger.sql:6-10)), et le valider en timing-safe au début du handler.

---

## 🟠 HIGH — corriger cette semaine

### H1. Email bombing via `newsletter_subscribers` (RLS trop permissive)
- **Surface** : 5 surfaces frontend (`NewsletterInline`, `DiagnosticPage:73`, `ChangelogPage:42`, `GenerateurFacturXPage:190`, `HomePage:171`) insèrent direct dans la table sans captcha, sans rate-limit.
- **Cause** : migration `20260329181233_*.sql:11-12` :
  ```sql
  CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);
  ```
- **Impact** : un attaquant peut inscrire en boucle des milliers d'emails (les siens ou ceux de tiers → harcèlement / spam des destinataires si l'app envoie un confirm). Pollution de la base.
- **NB runtime** : en prod, la table **n'existe pas du tout** (REST renvoie `42P01 relation does not exist`), donc le risque est temporairement inerte… mais le code frontend insert dedans = **toutes les newsletters échouent silencieusement aujourd'hui** (bug fonctionnel/produit séparé).
- **Fix** :
  1. Créer la table en prod (la migration n'a pas été appliquée).
  2. Remplacer la policy par un check d'email valide + un rate-limit applicatif (déplacer la logique dans une Edge Function `subscribe-newsletter` avec captcha hCaptcha/Turnstile invisible et rate-limit IP).
  3. Ajouter une policy DELETE pour l'utilisateur (RGPD droit à l'oubli — cf. M5).

### H2. `send-contact-email` — aucun captcha / rate-limit + injection HTML
- **Fichier** : [supabase/functions/send-contact-email/index.ts](supabase/functions/send-contact-email/index.ts)
- **Cause** :
  - Aucune protection abuse (le honeypot côté frontend est trivialement contournable).
  - Le HTML de l'email est interpolé sans escape : ligne 40-45, `${name}`, `${email}`, `${company}`, `${message}` injectés dans `html: …<p><strong>Nom :</strong> ${name}</p>…`. Le `message.replace(/\n/g, "<br />")` **n'échappe pas** les `<`, `>`, ni les guillemets.
  - Le `subject:` ligne 38 contient `${name}` brut → **CRLF / header-injection** possible si Resend ne sanitize pas (selon leur doc ils le font, mais on dépend du fournisseur).
  - `error.message` exposé au client ligne 65 → fuite info (stack/Resend reply).
- **Impact** :
  - Spam abuse → consommation crédits Resend (€)
  - HTML injection dans la boîte du destinataire interne (contact@odoc.fr) — risque XSS dans le client mail, hameçonnage interne
  - Fuite info Resend
- **NB runtime** : l'EF répond **HTTP 500** en prod (`InvalidWorkerCreation: worker boot error: failed to read path: No such file or directory`) → **le formulaire de contact ne marche pas du tout** (bug fonctionnel séparé). La fenêtre d'exploitation s'ouvre dès qu'elle est redéployée.
- **Fix** :
  1. Sanitiser : `const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));` et entourer chaque interpolation.
  2. Strip `\r\n` du `name`/`email`/`company` avant insertion dans le `subject`.
  3. Ajouter Cloudflare Turnstile (gratuit) ou rate-limit IP via Deno KV / un endpoint en amont.
  4. Renvoyer un message générique au client (`"L'envoi a échoué, réessayez"`), logger l'erreur côté serveur uniquement.

### H3. `react-router-dom` < 6.30.2 — open redirect connu (CVE)
- **Avis** : [GHSA-2j2x-hqr9-3h42](https://github.com/advisories/GHSA-2j2x-hqr9-3h42) + GHSA-9jcx-v3wj-wh4m.
- **Cause** : la version installée a un bug qui interprète `//evil.com` comme un redirect externe via le mécanisme de path same-origin.
- **Impact** : si quelque part dans l'app un `navigate(…)` ou `<Link to={…}>` est alimenté par un paramètre URL (à grepper avant patch), un attaquant peut forger `https://odocpilot.com/?next=//evil.com` pour rediriger l'utilisateur vers son phishing. Notre grep `searchParams`/`location.href` n'a rien trouvé d'exploitable aujourd'hui, mais la surface existe.
- **Fix** : `bun update react-router-dom react-router` (puis vérifier 6.30.2+).

### H4. Anon key + URL API exposées par un `.env` Git-tracké
- **Fichier** : [.env](.env) (tracké, vu `git ls-files | grep .env`)
- **Cause** : `.gitignore` ne contient pas `.env` (`*.local` seulement). La clé anon Supabase est conçue pour être publique côté front, **mais** :
  - Git tracker `.env` est un trou-mémoire — le jour où quelqu'un colle un `SUPABASE_SERVICE_ROLE_KEY` ou un `RESEND_API_KEY` dans ce fichier "par habitude", il sera commit puis pushé public.
  - La clé en Git (`zcc44owwgoc48c0w8k8kgocs`) **ne correspond pas** au project ID prod (`vvpkuoiugrnxdacgbiby`, vu dans [supabase/config.toml](supabase/config.toml)) ni à la clé prod active (extraite du bundle public). Indice qu'un ancien projet Supabase a été abandonné — ce sont peut-être des credentials orphelins encore valides côté Supabase, à révoquer.
- **Impact** : trou de processus + risque de leak de clé sensible à terme + clés d'un ancien projet possiblement encore vivantes.
- **Fix** :
  1. Ajouter `.env` au [.gitignore](.gitignore), `git rm --cached .env`, commit.
  2. Confirmer que le projet Supabase `zcc44owwgoc48c0w8k8kgocs` est bien supprimé (sinon clés à révoquer).
  3. Vérifier l'historique git avec `git log -p -S service_role` et `git log -p -S RESEND` pour s'assurer qu'aucune clé sensible n'a été commit (audit déjà fait, négatif — bonne nouvelle).

### H5. Image Docker `node:18-alpine` en fin de vie + pas de `.dockerignore`
- **Fichier** : [Dockerfile](Dockerfile)
- **Cause** :
  - `node:18-alpine` → Node 18 a atteint l'EOL en avril 2025 → **plus de patches de sécurité de l'upstream** (1 an+ de CVEs alpine/nodejs cumulés).
  - `nginx:alpine` → tag flottant, pas de digest → l'image runtime peut basculer sans préavis (supply-chain).
  - Pas de [.dockerignore](. dockerignore) (absent) → le contexte build envoyé au daemon inclut `node_modules/`, `.git`, `.env`, `refonte/`, `docs/`, `fix_trigger.sql`. Image finale OK (seul `dist/` copié), mais build context lourd et risque si quelqu'un copie autre chose.
- **Impact** : CVEs non patchées sur libc, openssl, node — directement exploitables si l'attaquant atteint le conteneur via une autre faille.
- **Fix** :
  ```dockerfile
  FROM node:22-alpine AS builder           # LTS active
  …
  FROM nginx:1.27-alpine                   # pin version
  ```
  Créer `.dockerignore` : `node_modules`, `.git`, `.env*`, `dist`, `refonte`, `docs`, `*.sql`, `*.md`.

---

## 🟡 MEDIUM

### M1. RPC `increment_view_count` accessible à anon → inflation de stats
- **Surface** : `POST /rest/v1/rpc/increment_view_count {"post_slug":"<any>"}`
- **Cause** : `SECURITY DEFINER` (migration `20260315050233_*.sql:16`) + exposée par défaut via PostgREST à tout rôle ayant l'`EXECUTE` (par défaut, anon).
- **Impact** : un attaquant peut spammer le compteur de vues de n'importe quel article (ou de tous). Inflation des stats internes → décisions éditoriales/SEO biaisées.
- **Fix** : `REVOKE EXECUTE ON FUNCTION public.increment_view_count(text) FROM anon;` puis appeler depuis un EF protégé par captcha + rate-limit, ou abandonner ce compteur et compter via Umami uniquement.

### M2. CORS `*` sur toutes les Edge Functions
- **Cause** : `"Access-Control-Allow-Origin": "*"` dans les 4 EF.
- **Impact** : permet à n'importe quel site web tiers d'invoquer ces EF au nom du visiteur (CSRF côté API pour les endpoints sans JWT comme `sitemap-refresh`). Combiné à C3 et H2, démultiplie le facteur d'attaque (les pages malveillantes peuvent déclencher du spam).
- **Fix** : restreindre à `https://odocpilot.com` (et `https://app.odocpilot.com` si nécessaire). Faire varier par origin en lisant `req.headers.get('origin')` contre une liste blanche.

### M3. Comparaison de `Bearer` non timing-safe dans `publish-blog-post`
- **Fichier** : [supabase/functions/publish-blog-post/index.ts:36](supabase/functions/publish-blog-post/index.ts) `authHeader !== \`Bearer ${secret}\``
- **Cause** : `!==` est court-circuit byte-par-byte → timing attack théorique.
- **Impact** : faible en pratique (Deno + réseau public bruyant), mais bonne pratique d'utiliser `crypto.timingSafeEqual` sur des `TextEncoder().encode()`. Sinon, en cas de compromis : service-role utilisée → tout le blog est manipulable.
- **Fix** : implémenter une comparaison constant-time.

### M4. Drift catégorie `blog_posts.category` vs front-end
- **Cause** : `CHECK (category IN ('facturation','comptabilite','ia-documents','gestion-pme','tutoriel','general'))` (migration 1) vs `facturation-electronique`, `obligations-2026-2027`, `plateforme-agreee`, `factur-x`, `tpe-sans-comptable` (SEOBlog.md / front BlogPage).
- **Impact** : `publish-blog-post` avec une catégorie "moderne" → INSERT échoue → blog cassé.
- **Fix** : `ALTER TABLE public.blog_posts DROP CONSTRAINT …; ALTER TABLE … ADD CONSTRAINT … CHECK (category IN (…liste à jour…))`.

### M5. RGPD — pas de mécanisme self-service de retrait du consentement / désinscription
- **Symptôme** : la CookieBanner ne réapparait pas après acceptation/refus, aucun lien "Gérer mes cookies" en footer ; aucun endpoint d'unsubscribe newsletter (pas de policy DELETE non plus).
- **Référence CNIL** : retrait du consentement aussi facile que l'octroi.
- **Fix** :
  1. Ajouter un lien `Gérer mes cookies` dans [SiteFooter.tsx](src/components/SiteFooter.tsx) qui efface `localStorage["odoc_cookie_consent"]` et reload.
  2. Endpoint `/unsubscribe?token=…` + policy DELETE sur la table par token signé.

### M6. CookieBanner différé de 1200ms → tracking délai
- **Fichier** : [src/components/CookieBanner.tsx:14](src/components/CookieBanner.tsx)
- **Cause** : `setTimeout(() => setVisible(true), 1200)`. C'est cosmétique mais... pendant ce délai, sans consentement, Umami n'est pas chargé (vérifié dans [src/lib/analytics.ts](src/lib/analytics.ts)) — donc OK techniquement. Sévérité réelle : **LOW**, gardé MEDIUM pour visibilité éditoriale.
- **Fix** : ramener à 300-500ms ou afficher tout de suite.

### M7. Pas de RLS DELETE pour les anons sur `newsletter_subscribers`
- **Cause** : aucune policy DELETE → un utilisateur ne peut pas se désinscrire via l'API → contraint à passer par l'email manuellement.
- **Fix** : voir M5 — endpoint unsubscribe avec token signé HMAC.

---

## 🔵 LOW

### L1. `window.open("", "_blank", …)` sans `noopener` dans Factur-X PDF popup
- **Fichier** : [src/pages/GenerateurFacturXPage.tsx:165](src/pages/GenerateurFacturXPage.tsx)
- **Risque** : popup same-origin avec `window.opener` accessible. Aucun lien externe injecté dans la popup, donc safe en pratique.
- **Fix** : `window.open("", "_blank", "noopener,width=800,…")` — coût zéro.

### L2. Workflow GitHub `appleboy/ssh-action@v1.2.0` non épinglé par digest
- **Fichier** : [.github/workflows/deploy.yml:36](.github/workflows/deploy.yml)
- **Risque** : supply-chain action — un tag peut être réécrit. Pour une action SSH qui se connecte au VPS prod avec `VPS_SSH_KEY`, c'est sensible.
- **Fix** : épingler par SHA : `uses: appleboy/ssh-action@<commit-sha>`.

### L3. Dependency vulns build/dev-time
- `vitest <3.2.6` critique mais dev-time only ; `vite`, `esbuild`, `postcss`, `picomatch`, `minimatch` — uniquement build/test.
- **Fix** : `bun update` mensuel, garder un Dependabot.

### L4. `ws` via `@supabase/realtime-js` (DoS)
- Théorique car le front n'utilise pas Realtime.
- **Fix** : `bun update @supabase/supabase-js` (récente version pinne `ws` patché).

### L5. Drift `.env` ↔ `config.toml` ↔ prod
- `.env` → project ID `zcc44ow…`, anon key obsolète
- `supabase/config.toml` → `vvpkuoiugrnxdacgbiby`
- prod active → autre clé anon encore
- **Fix** : Source de vérité unique (Coolify env). `.env.example` documente, `.env` git-ignored.

---

## ⚪ INFO — drift prod / bugs fonctionnels (à régler en parallèle)

| # | Constat | Impact |
|---|---|---|
| I1 | `newsletter_subscribers` n'existe pas en prod (`42P01`) | Toutes les inscriptions échouent silencieusement (NewsletterInline, Diagnostic, Changelog, GenerateurFacturX, HomePage) |
| I2 | EF `send-contact-email` HTTP 500 `worker boot error` | Le formulaire `/contact` ne fonctionne pas |
| I3 | RLS prod ≠ migration Git (drafts publics) | Voir C1 |
| I4 | Clé anon du `.env` ≠ clé anon en prod | Indique 2 projets Supabase coexistants ou un changement non versionné |

Ces 4 points sont **fonctionnels** (pas sécu), mais ils s'intercalent dans le même chantier — à corriger pendant le passage `psql`.

---

## ✅ Ce qui va bien (à conserver)

- React-Markdown utilisé sans `rehype-raw` → **XSS du contenu blog correctement neutralisée**
- Honeypot `website` sur ContactPage (filtre bots basiques)
- `rel="noopener noreferrer"` systématique sur les liens externes (grep exhaustif)
- `esc()` appliqué partout dans le générateur Factur-X → pas d'XML injection / pas de XSS dans le PDF popup
- Cookie banner = opt-in explicite, Umami ne charge **que** si `accepted`
- `loadAnalytics()` refuse les sources non-HTTPS (anti mixed-content)
- Politique de confidentialité bien structurée (responsable, finalités, base légale, durée, droits, sous-traitants, CNIL)
- `verify_jwt` correctement configuré sur `publish-blog-post` (false + secret applicatif) — patron sain
- `publish-blog-post` exige un `BLOG_WEBHOOK_SECRET` et utilise `service_role` côté EF seulement → service_role **n'est pas** côté client ✅
- RLS *spec* est saine (juste à appliquer en prod) — `blog_posts` n'a aucune policy INSERT/UPDATE pour anon
- Honeypot custom storage pour la session Supabase (évite localStorage iframe issues, et `persistSession: false` → pas de surface persistante côté SaaS)

---

## 🗺️ Plan de remédiation — ordre opérationnel

**Phase 1 — bloquer la fuite (1h)** — Coolify env + psql prod
1. C1 — Réappliquer policy RLS `blog_posts` (`USING (status='published')`) en `psql` sur la prod.
2. C2 — Patcher [nginx.conf](nginx.conf) (headers de sécurité), rebuild Docker, deploy.
3. C3 — Ajouter `X-Webhook-Secret` à `sitemap-refresh` + au trigger Postgres ; redeploy EF.

**Phase 2 — durcir les EF (2h)**
4. H2 — Sanitize HTML + rate-limit + Turnstile sur `send-contact-email` ; renvoyer erreur générique. Et débugger le `worker boot error` (I2).
5. M2 — Restreindre CORS aux origines OdocPilot.
6. M3 — Comparaison Bearer timing-safe.

**Phase 3 — base de données (1h)**
7. H1 — Créer la table `newsletter_subscribers` en prod (I1), durcir le `WITH CHECK` (email regex + rate-limit applicatif).
8. M1 — `REVOKE EXECUTE` du `increment_view_count` à anon.
9. M4 — Aligner la contrainte `category` sur la taxonomie à jour.
10. M5/M7 — Endpoint unsubscribe + DELETE policy par token signé.

**Phase 4 — supply-chain (2h)**
11. H4 — `.env` git-ignored + révoquer projet Supabase orphelin.
12. H5 — Migrer image base vers `node:22-alpine` + créer `.dockerignore`.
13. H3 — `bun update react-router-dom`.
14. L2 — épingler `appleboy/ssh-action` par SHA.

**Phase 5 — RGPD / cosmétique (1h)**
15. M5 — Lien "Gérer mes cookies" dans le footer + reset consent.
16. M6 — Banner cookie sans délai.
17. L1 — `noopener` sur popup PDF.

**Coût total estimé** : ~7h de dev + tests, sans rupture de service si on respecte l'ordre.

---

## 🔁 Vérification post-fix (smoke tests à rejouer)

```bash
# C1 — drafts must be denied
PROD_ANON="$(curl -s https://odocpilot.com/assets/client-*.js | grep -oE 'eyJ[A-Za-z0-9_.-]{50,}' | head -1)"
curl -s "https://api.odocpilot.com/rest/v1/blog_posts?status=eq.draft&select=slug" \
     -H "apikey: $PROD_ANON" -H "Authorization: Bearer $PROD_ANON"
# attendu : [] (ou 401)

# C2 — headers
curl -sI https://odocpilot.com/ | grep -iE "strict-transport|content-security|x-frame|x-content|referrer|permissions"
# attendu : 6 headers présents

# C3 — sitemap-refresh sans secret
curl -s -o /dev/null -w "%{http_code}\n" -X POST \
     https://api.odocpilot.com/functions/v1/sitemap-refresh \
     -d '{"type":"INSERT","record":{"status":"published","slug":"probe"}}'
# attendu : 401 ou 403
```

---

*Fin du rapport — diagnostic uniquement, aucune correction appliquée. Cohérent avec la convention des audits précédents (`odoc-security-audit-jun2026` sur odoc-pulse).*
