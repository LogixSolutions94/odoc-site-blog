# 🚀 Checklist lancement marque « OdocPilot » — visibilité Google sur le nom

> Objectif : que Google sorte **OdocPilot #1** sur la recherche du nom seul (sans `.com`).
> Cause du problème actuel : domaine récent + 0 page indexée + aucun signal d'entité.
> « OdocPilot » est un mot inventé : une fois indexé + 2-3 mentions réelles, le #1 vient quasi automatiquement (~1 à 4 semaines).

---

## ✅ Déjà corrigé dans le code (sera live au prochain rebuild Docker du VPS)

- [x] `public/logo.svg` créé (marque orbitale orange) → corrige le 404 du logo dans le schema Organization
- [x] Schema Organization : `logo` passé en `ImageObject` (512×512)
- [x] `sameAs` (LinkedIn/X) **retirés** tant que les profils n'existent pas (évite des liens 404 = signal négatif). À ré-ajouter une fois les profils créés (voir TODO dans `index.html`).

> ⚠️ Ces corrections ne seront en ligne qu'après **rebuild Docker du conteneur `odoc-landing`** (cf. `CLAUDE.md` → déploiement landing). Les étapes ci-dessous (Search Console, profils, annuaires) sont **indépendantes** et peuvent se faire tout de suite.

---

## 🥇 P0 — Google Search Console (le levier n°1, gratuit, ~30 min)

1. https://search.google.com/search-console → **Ajouter une propriété** → type **« Domaine »** → `odocpilot.com`.
2. Google donne un **enregistrement DNS TXT** → l'ajouter chez **OVH** (zone DNS du domaine) → revenir cliquer **Valider**.
3. **Sitemaps** → soumettre `sitemap.xml`.
4. **Inspection d'URL** → coller `https://odocpilot.com/` → **Demander l'indexation**. Répéter pour :
   - `https://odocpilot.com/e-facture`
   - `https://odocpilot.com/pricing`
   - `https://odocpilot.com/fonctionnalites`
   - `https://odocpilot.com/blog`
5. **Bing Webmaster Tools** (https://www.bing.com/webmasters) → même chose (alimente Copilot / ChatGPT Search). On peut importer depuis GSC en 1 clic.

> Le rapport **« Pages » / « Couverture »** de GSC te dira précisément combien de pages sont indexées — c'est la vraie mesure, pas une recherche manuelle.

---

## 🥈 P1 — Créer les profils de marque (signaux d'entité)

> Réserve **exactement** ces identifiants (le schema les attend). Si un identifiant est pris, choisis une variante et préviens pour aligner le code.

### 1. Page entreprise LinkedIn → `linkedin.com/company/odocpilot`
- **Nom :** OdocPilot
- **Slogan (≤120 car.) :** Le copilote IA français qui prépare votre facturation et votre conformité e-facture 2026/2027. Vous validez en 1 clic.
- **Secteur :** Développement de logiciels
- **Type :** Société indépendante
- **Site web :** https://odocpilot.com
- **À propos :**
  > OdocPilot est le copilote IA français de facturation et de conformité pour les dirigeants de TPE, PME et indépendants.
  >
  > Notre point de départ : la facturation électronique obligatoire 2026/2027 (réception au 1er septembre 2026, émission en 2027). OdocPilot génère vos factures au format Factur-X (norme EN 16931), lit et classe automatiquement vos factures par IA, prépare vos relances et votre export FEC.
  >
  > Le principe : **l'IA prépare l'administratif, vous validez en 1 clic.** Jamais d'IA qui exécute seule.
  >
  > Données ET IA hébergées en France (Mistral), conformité RGPD et AI Act, démarche d'IA frugale.
  >
  > Essai 14 jours, sans carte bancaire → https://app.odocpilot.com
- **Logo :** `public/logo.svg` (ou export PNG 512×512) — **Bannière :** réutiliser `og-image.png`.

### 2. Compte X (Twitter) → `x.com/odocpilot`
- **Nom :** OdocPilot
- **Bio (≤160 car.) :** Copilote IA 🇫🇷 de facturation & conformité e-facture 2026/2027 pour TPE/PME. L'IA prépare, vous validez. Données & IA en France.
- **Site :** https://odocpilot.com — **Localisation :** France

### 3. Google Business Profile (si éligible)
- Pertinent surtout si tu as une adresse/zone de service B2B. Une fiche valide « OdocPilot » (catégorie *Éditeur de logiciels*) renforce fortement le knowledge panel sur le nom. Si pas d'adresse publique, passe cette étape.

> 🔁 **Une fois LinkedIn + X en ligne**, me redonner les URLs exactes → je ré-active le bloc `sameAs` dans `index.html`.

---

## 🥉 P2 — Mentions externes / annuaires (accélère la reconnaissance d'entité)

Pour un mot inventé, **3-4 mentions autoritaires + 1 backlink** suffisent souvent à faire basculer Google. Cibles FR/SaaS B2B :

- [ ] **Appvizer** (FR, fort en facturation) → créer la fiche éditeur
- [ ] **Capterra / GetApp / Software Advice** (groupe Gartner) → 1 inscription = 3 annuaires
- [ ] **France Num — annuaire des solutions** (annuaire officiel, très crédible)
- [ ] **Product Hunt** → lancement (pic de mentions + backlink)
- [ ] **Bpifrance / French Tech** annuaires si éligible
- [ ] (Optionnel) BetaList, SaaSworthy, Indiehackers

**Règle d'or :** sur chaque fiche, écrire le nom **« OdocPilot » en un seul mot** (jamais « Odoc Pilot » / « Odocpilot ») et toujours lier vers `https://odocpilot.com`. La cohérence du nom + de l'URL est ce qui apprend l'entité à Google.

---

## 📅 Attendu

| Échéance | Résultat attendu |
|----------|------------------|
| J+0 à J+3 | GSC validé, sitemap soumis, indexation demandée → pages commencent à apparaître dans `site:odocpilot.com` |
| Semaine 1-2 | Profils + 2-3 annuaires en ligne ; Google commence à associer « OdocPilot » = ce site |
| Semaine 2-4 | **#1 sur la recherche « OdocPilot »** ; les marques voisines (Docupilot, oddopilot) reculent |

> Tant que Google n'est pas « sûr », il continuera d'afficher des marques au nom proche : c'est la latence normale de désambiguïsation d'une jeune marque, pas une panne.
