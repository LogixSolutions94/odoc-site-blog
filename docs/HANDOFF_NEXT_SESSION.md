# Handoff : vitrine odocpilot.com, refonte en cours, légal en ligne

**Mis à jour :** 25/09/2026 · **`main`** tout déployé (déploiements verts depuis #24) · **Branche de travail :**
`refonte/vitrine-2026-09` (poussée, **ne pas fusionner en l'état**)

> Lire d'abord `AGENTS.md` (identité légale, conventions), puis ce fichier. Le guide visuel et
> éditorial de la refonte est dans la branche : `docs/design/REFONTE-2026-09.md`.

---

## ✅ En ligne depuis le 24/09

| PR | Contenu |
|---|---|
| #21 | Relance SEO (autre session) : www → apex en 301, articles retirés en 301/410, vraies 404 sous `/blog`, prérendu des pages marketing (`scripts/prerender-pages.ts`), page `/editeurs` |
| #22 | Légal : mentions, CGU, confidentialité, `llms.txt` à l'identité EI. Directeur de la publication **« M. Brahimi R. »** (remplace « Lucas Belloc », prénom fictif). Fin de « Logix Solutions SASU » |
| #24 | Déploiement fiable : `scripts/deploy-vps.sh` exécuté d'un bloc, avec retour arrière si le nouveau conteneur est KO |
| #25 à #27 | Article retiré (410), témoignages non vérifiés et promesses fausses retirés, plafonds réels sur les tarifs |
| #28 | Thème : script externe `public/theme-init.js` (le script inline était bloqué par la CSP de prod) |

## 🔴 Ta liste (actions fondateur)

1. **Deux tâches cloud t'attendent** (« waiting on a human ») : *Aligner le SaaS : relances opt-in et
   page d'inscription* (odoc-pulse : `reminders_enabled` vaut DEFAULT true, et la page d'inscription
   vend « 52 actions exécutables ») et *Corriger la liste des sous-traitants* (la politique de
   confidentialité cite Stripe et Resend, oublie Mistral et Lemon Squeezy). Les deux s'arrêtent pour
   ta validation.
2. **Valider la refonte visuelle** avant publication (captures à regénérer après le rebase, cf. plus bas).
3. **Légal encore ouvert** : pied d'email de prospection B2B et licéité des envois (voir la mémoire
   « dossier-conformite-legale-ouvert »). Le reste de ta liste vit dans
   `../odoc-pulse/docs/HANDOFF_NEXT_SESSION.md` (SuperPDP production, Lemon Squeezy, etc.).

## 🧭 Reprendre la refonte (`refonte/vitrine-2026-09`)

**Direction « Papeterie »** : papier blanc, encre pétrole. L'orange est le *surligneur* (ce que
l'IA prépare), l'encre et le *tampon* sont ce que VOUS décidez. Accueil : « Facture électronique :
soyez en règle, simplement. » (consigne de Riad du 24/09), scène animée d'une facture contrôlée avant
envoi puis tamponnée. Police Switzer (Fontshare, autorisée par la CSP).

**État** : 2 commits. `5ccfdf3` pose le système et le nouvel accueil. `eda5250` est un WIP
sauvegardé tel quel, non relu : blog, tarifs, À propos, contact, facture électronique, guides, 404,
outils. `tsc -p tsconfig.app.json` : OK. Il n'y a pas de PR.

| Étape | À faire |
|---|---|
| 1. Rebase | `git rebase origin/main`. Conflits attendus sur **2 fichiers** seulement : `SiteFooter.tsx` (garder le lien « Offre éditeurs » de #21) et `PricingPage.tsx` (garder les plafonds réels de #27). `index.html` : garder `theme-init.js` (#28) |
| 2. Lien mort | Le pied de page pointe vers `/auto-entrepreneurs`, **aucune route** : créer la page ou retirer le lien |
| 3. Relecture | Relire le WIP `eda5250` page par page contre la mémoire « vitrine-claims-guardrails » : jamais « rien ne part sans votre clic » (relances automatiques par défaut dans le SaaS), pas de témoignage, pas « plateforme agréée », nom public « M. Brahimi R. » uniquement |
| 4. Revue visuelle | 1440 / 768 / 375, clair et sombre, `prefers-reduced-motion`. Vérifier l'état final de la scène : tampon sans masquer les montants, bouton de succès non grisé |
| 5. Contrôles | `tsc -p tsconfig.app.json --noEmit`, `vite build`, un seul H1 par page, titres et descriptions lisibles par `scripts/prerender-pages.ts` |
| 6. Publication | PR → Lighthouse CI → merge → déploiement auto → vérifier la prod (pages clés en 200, pas d'erreur console) |

**Ne pas toucher dans la refonte** : `MentionsLegalesPage`, `CguPage`, `PolitiqueConfidentialitePage`
(versions validées par Riad, en ligne).

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
- **Deux sessions dans le même worktree** (cas du fork du 24/09) : elles s'écrasent. Une seule écrit,
  l'autre passe la main par message.

## 🗄️ Archives locales (non poussées)

- `archive/wip-checkout-principal-2026-09-24` (`591bf84`) : ce qui traînait non commité dans le
  checkout principal. Prototype « copilote » de Codex du 19/09 (remplacé par la refonte), son audit et
  ses captures, des renommages « Odoc → OdocPilot » (Contact, 404, `publish-blog-post`). À relire
  si besoin, sinon à supprimer.

## 📈 Mesure (Search Console, relevé du 25/09)

- 28 jours, données arrêtées au 22/09 : **34 clics, 2 200 impressions**, surtout sur la marque
  (« odoc », « logix »). Trois mois avant : 50 clics pour 5 890 impressions.
- Dernières 24 h (23 au 24/09) : 0 clic, 50 impressions.
- **Aucun effet mesurable encore** : les changements datent du 24/09, et Google met des jours, voire
  des semaines, à recrawler. La refonte n'est pas en ligne. Point de contrôle conseillé autour du
  10/10 : impressions hors marque et position de `/guide/plateforme-agreee` (objectifs du plan de
  relance, `../odoc-pulse/docs/PLAN-ACQUISITION-ODOCPILOT.md`).
