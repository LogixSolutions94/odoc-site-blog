# Handoff : vitrine odocpilot.com, refonte en ligne, suivi Google quotidien

**Mis à jour :** 25/09/2026 · **`main`** tout déployé (déploiements verts depuis #24) · Pas de branche
de travail ouverte.

> Lire d'abord `AGENTS.md` (identité légale, conventions), puis ce fichier. Avant de toucher une page :
> `docs/design/REFONTE-2026-09.md` (système visuel, classes, affirmations autorisées et interdites).

---

## ✅ En ligne

| PR | Contenu |
|---|---|
| #21 | Relance SEO (autre session) : www → apex en 301, articles retirés en 301/410, vraies 404 sous `/blog`, prérendu des pages marketing (`scripts/prerender-pages.ts`), page `/editeurs` |
| #22 | Légal : mentions, CGU, confidentialité, `llms.txt` à l'identité EI. Directeur de la publication **« M. Brahimi R. »** (remplace « Lucas Belloc », prénom fictif). Fin de « Logix Solutions SASU » |
| #24 | Déploiement fiable : `scripts/deploy-vps.sh` exécuté d'un bloc, avec retour arrière si le nouveau conteneur est KO |
| #25 à #27 | Article retiré (410), témoignages non vérifiés et promesses fausses retirés, plafonds réels sur les tarifs |
| #28 | Thème : script externe `public/theme-init.js` (le script inline était bloqué par la CSP de prod) |
| #30 | **Refonte « Papeterie »** (25/09) : accueil « Facture électronique : soyez en règle, simplement. », tarifs, À propos (limites écrites), contact, facture électronique, guides, lexique, blog, 404, en-tête, pied de page, cookies |
| #31 | Accessibilité : `MotionDiv` lit `prefers-reduced-motion` dès le premier rendu (animations coupées en plein vol, 4 px de débordement sur `/diagnostic` en mobile) |
| #33 | **Page `/auto-entrepreneurs`** : facture électronique en franchise de TVA, exemple de facture annotée, 4 étapes, 7 questions (FAQPage), prérendu complet (1 244 mots), liens depuis l'accueil, le pied de page et /e-facture |
| #34 | Confidentialité : tous les sous-traitants affichés (Supabase, Resend, Stripe remis à côté d'OVH, Mistral, Lemon Squeezy, Google/Dropbox), décision de Riad |

**Système « Papeterie »** : papier blanc, encre pétrole. L'orange est le *surligneur* (ce que l'IA
prépare), l'encre et le *tampon* sont ce que VOUS décidez. Police Switzer (Fontshare, autorisée par
la CSP). Scène de l'accueil : `src/components/home/InvoiceScene.tsx` et `Stamp.tsx`. Sources uniques
des liens, prix, essai et éditeur : `src/lib/marketing.ts`. Typographie française : `fr()` dans
`src/lib/typo.ts`.

## 📈 Suivi Google (Search Console)

- **Dépôt privé [`LogixSolutions94/odoc-seo-data`](https://github.com/LogixSolutions94/odoc-seo-data)** : chaque jour à 05:30 UTC, une tâche GitHub interroge Search Console et enregistre l'historique jour par jour (`data/daily.csv`, 16 mois), les requêtes et pages sur 28 jours comparées aux 28 précédents, le trafic hors marque, les pages clés, et le rapport **`RAPPORT.md`**. Privé car le dépôt du site est public.
- **Il lui faut sa clé** : secret `GSC_SERVICE_ACCOUNT_JSON`, qui contient la clé du compte de service `odocpilot1@odoc-copilot.iam.gserviceaccount.com` (déjà autorisé sur la propriété). Sans elle, la tâche avertit et n'écrit rien. Commande dans le README du dépôt.
- Indexation demandée le 25/09 dans Search Console pour `/auto-entrepreneurs`, `/`, `/e-facture` et `/pricing`.
- Côté SaaS, `seo-insights` (`gsc_sync`, lundi 07:00 UTC) continue de suivre les articles du blog dans `seo_page_metrics`.

## 🔴 Ta liste (actions fondateur)

1. **Clé Search Console** pour `odoc-seo-data` (voir ci-dessus), si ce n'est pas déjà fait.
2. **Tâche cloud en attente** : *Aligner le SaaS : relances opt-in et page d'inscription* (odoc-pulse : `reminders_enabled` vaut DEFAULT true, et la page d'inscription vend « 52 actions exécutables »). Celle des sous-traitants est close : décision du 25/09, tout afficher (#34).
3. **Légal encore ouvert** : pied d'email de prospection B2B et licéité des envois (voir la mémoire « dossier-conformite-legale-ouvert »). Le reste de ta liste vit dans `../odoc-pulse/docs/HANDOFF_NEXT_SESSION.md` (SuperPDP production, Lemon Squeezy, etc.).

## 🧭 Pistes ouvertes pour la suite

| Piste | Détail |
|---|---|
| Lire les premiers relevés | Vers le 10/10 : impressions hors marque, apparition de `/auto-entrepreneurs` sur « facture électronique auto-entrepreneur », position de `/guide/plateforme-agreee` |
| Pages sœurs de `/auto-entrepreneurs` | Même gabarit (contenu dans `src/content/`, prérendu complet, FAQ en JSON-LD) pour d'autres requêtes à volume : « facture électronique artisan », « professions libérales »… Seulement si les relevés confirment l'intérêt |
| Prérendu de l'accueil | `prerender-pages` garde `dist/index.html` pour « / » : titre et description OK, mais pas de H1 ni de texte dans le HTML brut (déjà le cas avant la refonte) |
| Longueur de l'accueil | ≈ 11 900 px en 1440, ≈ 19 200 px en 375. À resserrer selon les premières mesures (clics d'essai par section via `data-umami-event`) |

**Ne pas toucher sans Riad** : `MentionsLegalesPage`, `CguPage`, `PolitiqueConfidentialitePage`
(versions validées, en ligne ; sous-traitants : tout afficher, décision du 25/09).

## ⚙️ Pièges connus (poste Windows)

- **Worktree + Vite** : Tailwind lit ses chemins `content` depuis le *cwd*. Lancer Vite depuis le
  worktree, sinon les nouvelles classes disparaissent sans erreur. Lanceur minimal :
  `process.chdir(worktree); process.argv = [node, vite.js, "--port", "8093"]; await import(vite.js)`.
- **Captures** : le panneau de prévisualisation expire. Utiliser `playwright-core` (node_modules) avec
  `chromium.launch({ channel: "chrome" })`, car les navigateurs Playwright installés ont une autre
  version que celle attendue.
- **Commit depuis PowerShell** : passer le message par fichier (`git commit -F fichier`). Un
  here-string envoyé sur `-F -` est pris pour un chemin.
- **Supprimer un worktree dont `node_modules` est une jonction** : d'abord
  `[System.IO.Directory]::Delete("<wt>\node_modules", $false)` (retire le lien seul), puis
  `git worktree remove`.
- **Rejouer le build de prod sans bun** : Node 24 exécute les scripts avec un petit résolveur d'imports sans extension (`node --import <resolveur.mjs> scripts/…`) et `--experimental-transform-types` pour `prerender-pages`. Sans clé Supabase locale, `generate-sitemap` réécrit `public/sitemap.xml` avec 0 article : **ne pas le commiter** (`git checkout -- public/sitemap.xml`).
- **Deux sessions dans le même worktree** (cas du fork du 24/09) : elles s'écrasent. Une seule écrit,
  l'autre passe la main par message.

## 🗄️ Archives locales (non poussées)

- `archive/wip-checkout-principal-2026-09-24` (`591bf84`) : ce qui traînait non commité dans le
  checkout principal. Prototype « copilote » de Codex du 19/09 (remplacé par la refonte), son audit et
  ses captures, des renommages « Odoc → OdocPilot » (Contact, 404, `publish-blog-post`). À relire
  si besoin, sinon à supprimer.

## 📉 Point de départ (relevé manuel du 25/09, avant les effets de la refonte)

- 28 jours, données arrêtées au 22/09 : **34 clics, 2 200 impressions**, surtout sur la marque
  (« odoc », « logix »). Trois mois avant : 50 clics pour 5 890 impressions.
- Dernières 24 h (23 au 24/09) : 0 clic, 50 impressions.
- **Aucun effet mesurable encore** : les changements datent du 24/09, et Google met des jours, voire
  des semaines, à recrawler. La refonte n'est pas en ligne. Point de contrôle conseillé autour du
  10/10 : impressions hors marque et position de `/guide/plateforme-agreee` (objectifs du plan de
  relance, `../odoc-pulse/docs/PLAN-ACQUISITION-ODOCPILOT.md`).
