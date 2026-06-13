# 🔬 Analyse concurrentielle — tunnels de vente (FR + US) & plan « vente automatique »

> Généré le 2026-06-13. Méthode : teardown multi-agents de **21 concurrents** (web research + vérification adversariale des faits porteurs : prix, free/essai, self-serve vs sales, lead magnets, preuve sociale). Données brutes : `/tmp/td_compact.txt` (digest) + sortie workflow `w467byut8`.
> Objet : voir ce que font les meilleurs tunnels, **recopier ce qui marche**, **noter** odocpilot.com face à eux, et tracer le chemin d'une **vente automatique** (self-serve no-touch jusqu'au paiement).

---

## 0. TL;DR

- **Notre site marketing (tel que codé dans `main`) est déjà top-quartile** sur 2 axes rares : le **positionnement « l'IA prépare, vous validez »** (créneau vide que personne n'occupe frontalement) et les **2 lead magnets sans compte** (générateur Factur-X EN16931 valide + diagnostic). Beaucoup de concurrents (Axonaut, Sellsy, Libeo, Evoliz, Digits) **n'ont aucun outil interactif**.
- **MAIS** le tunnel **meurt** à 3 endroits que les concurrents franchissent tous : **activation** (notre onboarding email est cassé → personne ne peut activer), **paiement** (billing Lemon inerte), **transmission** (PA non branchée). Résultat : on a une **machine à leads**, pas une **machine à vendre**.
- **Note site (front-end conversion) : 70/100 (B).** **Note vente automatique de bout en bout : 34/100 (D)** — plafonnée par les 3 bloqueurs.
- **Le pattern n°1 à copier d'urgence** (universel chez les gagnants) : un **palier/produit GRATUIT permanent sans CB** comme aimant (Pennylane, Indy, Abby, Wave, Tiime, Shine, Qonto, Ramp, Melio). On n'a pas de marche d'entrée → barrière d'acquisition forte sur une cible TPE non-technicienne.
- **Le contournement gagnant pendant que les bloqueurs durent** : **démo interactive sans compte** (Shine/Storylane, Digits) + **Google SSO** au signup (FreshBooks, Indy) qui **shunte l'email cassé**.

---

## 1. Panorama des 21 concurrents (synthèse)

### France (compta / facturation / gestion TPE-PME)
| Concurrent | Modèle prix | Free/essai | Tunnel | Arme principale |
|---|---|---|---|---|
| **Pennylane** | freemium + 7/14/24/79€ | gratuit micro **à vie** + essai 15j sans CB + **auto-conversion opt-out** | self-serve <6 sal., sales 6+ | routage par taille, pré-remplissage SIRET, collab expert-comptable |
| **Qonto** | paliers 9→249€ | essai 30j sans CB | self-serve pur (compte en ~10 min) | H1 = 3 mots-clés piliers, **6+ outils gratuits** (calculateurs), blog conformité massif |
| **Indy** | freemium **à vie** + 9€+ | gratuit à vie sans CB | self-serve pur | générateur factures + **simulateur e-facture indexable**, SEO programmatique `/guide/` |
| **Tiime** | freemium **à vie** + per-seat | gratuit à vie + essai 60j | self-serve <6 sal. | statut PA, simulateur d'éligibilité, SEO par métier |
| **Sellsy** | per-seat 29-99€, min 2 users | essai 15j sans CB | **sales-led** (démo dominante) | double-CTA démo+essai, blog comparatif |
| **Axonaut** | per-seat 35-70€ | essai 15j sans CB | self-serve dominant | 25 modèles gratuits sans email, prix d'appel marketing |
| **Abby** | freemium pur + 9/15/33€ | gratuit + essai 14j sans CB | self-serve pur | **batterie de simulateurs** (TJM, impôt, BIC/BNC) en sous-domaine `lp.` |
| **Shine** | freemium 0/9/20/60€ | gratuit + essai sans CB | self-serve | **démo interactive Storylane sans compte**, hero « dès 0€ » |
| **Evoliz** (Visma) | 29/49€ | essai 15j sans CB | self-serve + démo | hero d'urgence **« Survivrez-vous à 2026 ? »**, PA incluse |
| **Libeo** | sur devis | essai (durée floue) | **sales-led** (prix masqué) | silos SEO réforme 3000-4500 mots, AEO |
| **FacturConform / MaFactureConforme** | 100% gratuit (affiliation) | sans compte, sans email | self-serve pur | **diagnostic + vérificateur PDF + comparateur PA** = concurrents SERP DIRECTS du wedge |

### US (invoicing / SMB finance / AI bookkeeping)
| Concurrent | Modèle prix | Free/essai | Tunnel | Arme principale |
|---|---|---|---|---|
| **QuickBooks** | free réel + 20→275$ | essai 30j sans CB **OU** -50% 3 mois (choix forcé) | self-serve + onboarding humain 1:1 | générateur facture IA sans compte, hub /r/ massif, 35+ modèles |
| **FreshBooks** | 23/43/70$ | essai 30j sans CB, **Google SSO** | self-serve | support humain primé, modèles 5 formats, guides data annuels |
| **Wave** | **freemium pur** 0$ + 19$ | gratuit permanent sans CB | self-serve pur | **outil gratuit = produit**, modèles par format, pages « Compare X » |
| **BILL** | per-seat 49-89$ | essai 30j sans CB | hybride | double-CTA, Spend gratuit, machine SEO « painkiller » |
| **Ramp** | **freemium 0$** + 15$ | gratuit permanent | self-serve + sales Enterprise | **14 outils gratuits sans compte**, calculateur ROI, pages `/versus`, bonus $ à l'activation |
| **Stripe Invoicing** | usage 0,4-0,5%/facture | **pas de CB, pay-on-success** | self-serve pur | CTA = verbe de valeur, stats (« payé 3× plus vite »), logos prestige |
| **Xero** | 25/55/90$ | essai 30j sans CB | self-serve | coaching humain gratuit 90j, modèles indexés, marque émotionnelle |
| **Pilot** | 99$+ + CFO services | essai 15j sans CB | hybride | **hero coût d'opportunité** « who's leading the company? », TTV « books in <5 min » |
| **Digits** | 65/100$ | essai 30j | self-serve + sales | **démo console cliquable sans compte**, mono-CTA strict, catégorie « first AI-native GL » |
| **Melio** | freemium 0$ + 25→80$ | gratuit + essai 30j sans CB | self-serve | **page `/llm-info` (AEO/GEO)**, défaut intelligent (pas de choix de plan au signup) |

---

## 2. Le « copy-playbook » — ce qu'il faut RECOPIER, par étage de tunnel

### A. Positionnement & hero
1. **Garder et amplifier « l'IA prépare, vous validez »** — c'est notre actif n°1, et c'est exactement le cadrage gagnant de **Pilot/Digits** (« human-in-the-loop », l'IA bosse en coulisse, vous gardez la main). On le fait déjà mieux qu'eux. → Le marteler en catégorie : *« le copilote IA de conformité e-facture pour le dirigeant de TPE »* (ancrage de catégorie à la Digits).
2. **Hero d'urgence anxiété→soulagement** (Evoliz « Survivrez-vous à 2026 ? », Pilot « who's leading the company? »). Notre hero est descriptif/rassurant → ajouter une **variante d'urgence datée + compte à rebours** vers le 01/09/2026 (Tiime/Evoliz le font).
3. **Tableau de positionnement « la place vide »** (vs Pennylane=cabinet / Qonto=banque / Indy=TNS) — **on l'a déjà** dans la section pétrole. Excellent, à garder.

### B. Pricing & packaging
4. **🔴 PRIORITÉ — créer un palier GRATUIT / produit d'appel permanent sans CB.** Pattern UNIVERSEL des gagnants (Pennylane micro 0€, Indy/Tiime « à vie », Abby, Wave, Shine, Ramp, Melio). On vend 49/89/149 sans marche d'entrée → on perd la TPE non-technicienne qui compare à un Abby/Indy gratuit. **Et c'est gratuit à produire pour nous** puisque le billing est inerte : faire de **« OdocPilot Conformité » (générateur Factur-X + diagnostic + lecture IA limitée, ex. 5 factures/mois)** un palier 0€ affiché sous le 49.
5. **« Le plus populaire » sur le palier du milieu** (Pennylane, Qonto) — **on l'a** (« Le plus choisi » sur Pro 89). Bon. Ajouter un **toggle mensuel/annuel interactif** (-20%, annuel présélectionné) au lieu du texte statique « 39€/mois en annuel ».
6. **Essai SANS CB, AFFICHÉ explicitement** (universel) — **on le fait déjà** en micro-copy. Garder.
7. **Offre « tarif fondateur » réservable sans CB** — aucun concurrent ne le fait (c'est notre hack pré-revenu pour capter l'intention d'achat malgré le billing mort). À ajouter sous la grille.

### C. Conversion & lead-gen
8. **Outils gratuits sans compte = aimant n°1** (Qonto 6+, Ramp 14, Indy, Abby, QuickBooks, Wave, FacturConform). **On a déjà 2 (générateur + diagnostic) — top-tier.** À étendre : **vérificateur de facture** (drag-drop PDF → check mentions + validation EN16931, FacturConform le fait, on a le moteur), **comparateur de PA**, **calculateur « combien vous coûte votre admin »** (Ramp/Pilot).
9. **Mono-CTA répété, verbe de valeur** (Indy « Démarrer », Digits ×3, Stripe « Créer et envoyer »). Tant que l'essai est cassé, **faire du diagnostic/générateur le CTA primaire** (pas l'essai qui mène à un mur).
10. **Pages comparatives « vs X » / « alternative à X »** (Wave, Ramp `/versus`, Sellsy, Axonaut). On n'en a aucune → **gain SEO BOFU facile** sur l'angle « créneau vide ».
11. **Démo produit interactive sans compte** (Shine/Storylane, Digits console) — **levier énorme vu l'onboarding cassé** : laisser voir « l'IA lit une facture → prépare → vous validez » sans créer de compte.

### D. Onboarding & activation (= « vente automatique »)
12. **🔴 Google SSO au signup** (FreshBooks, Indy, Evoliz) — **shunte directement l'email de confirmation cassé** (GoTrue supporte Google). Le levier le plus rentable pour débloquer l'activation.
13. **Routage par profil au 1er écran** (Pennylane par taille, Abby par profil fiscal, BILL) → utiliser **/diagnostic comme porte d'entrée** de l'onboarding.
14. **Pré-remplissage SIRET/SIREN** (Pennylane, Indy via INSEE/Sirene) → time-to-value quasi instantané.
15. **Aha-moment immédiat « déposez une facture, l'IA l'extrait »** (Ramp, Stripe, Digits, QuickBooks connect-a-source). C'est notre fonction réelle → en faire le 1er écran.
16. **Checklist d'activation + défaut intelligent** (FreshBooks, BILL ; Melio = pas de choix de plan bloquant au signup, bascule auto sur free utile en fin d'essai).
17. **Conversion auto opt-out en fin d'essai** (Pennylane auto-bascule en payant + email J-4 ; Melio retombe sur free) — **à armer quand le billing sera actif**.

### E. Confiance & preuve
18. **On ne peut pas copier la preuve sociale chiffrée** (pré-revenu) — NE PAS inventer de chiffres (rappel : même les notes Trustpilot des concurrents varient selon les sources). **Substituer par notre actif unique** : souveraineté **données ET IA en France** (Mistral hébergé France), RGPD/AI Act — que **Wave/QuickBooks/Stripe/Ramp n'ont pas pour la France**. On l'a déjà (TrustCredentials) → l'amplifier.
19. **Compteur d'usage du free tool** (« X Factur-X générées / vérifiées ») = preuve sociale honnête et auto-alimentée. Démarrer la collecte d'avis (Trustpilot/Product Hunt) dès les 1ers users.
20. **Statut PA partenaire nommé** dès que branché (Libeo/Evoliz/Tiime affichent le registre DGFiP). Tant que sandbox : rester sur l'encart « transmission bientôt » (déjà fait, honnête).

### F. SEO / AEO / contenu
21. **🔴 SEO programmatique par métier × format × intention** (Qonto, Indy, Tiime, Abby, QuickBooks, FreshBooks, Wave) — **notre plus gros trou**. Construire les 5 silos déjà définis (SEOBlog.md) + pages-outils indexables (l'outil EST la page SEO, à la Indy/FacturConform).
22. **Page `/llm-info` (AEO/GEO)** (Melio) + versions « machine » des pages clés (Ramp) — faits structurés citables par les IA. Différenciateur facile.
23. **Pages-ressources d'intention** : « liste des plateformes agréées 2026 », « PA vs PDP », « qui est concerné » (Qonto, Indy, Pennylane captent ces requêtes). On les a en plan, pas en ligne.

---

## 3. 📊 Notation du site OdocPilot (tel que codé) face au benchmark

> Le site n'est pas encore déployé : note du site **codé dans `main`**. Échelle 0-10.

| # | Dimension | Note | Leader benchmark | Écart / action |
|---|---|---|---|---|
| 1 | Positionnement & différenciation | **9** | Pilot / Digits | Déjà supérieur. Marteler en catégorie + urgence datée. |
| 2 | Hero & première impression | **8** | Ramp / Stripe | Ajouter compte à rebours + variante anxiété (Evoliz). |
| 3 | Stratégie CTA & focus tunnel | **7** | Indy / Wave / Digits | Bon (dual CTA), mais l'essai mène à un mur → CTA primaire = diagnostic tant que bloqué. |
| 4 | Lead magnets & outils interactifs | **9** | FacturConform / Qonto / Ramp | Top-tier (2 outils sans compte valides). Ajouter vérificateur + comparateur PA + calculateur ROI. |
| 5 | Page pricing & packaging | **6** | Pennylane / Qonto | **Pas de palier gratuit**, pas de toggle annuel interactif, pas d'offre fondateur. |
| 6 | Onboarding self-serve & activation (PLG) | **3** | Pennylane / FreshBooks / Xero | 🔴 **Email cassé = 0 activation.** Manque SSO Google, SIRET prefill, checklist, aha « dépose une facture ». |
| 7 | Preuve sociale & confiance | **6** | tous (chiffres) / nous (souveraineté) | Trust souveraineté excellent ; **zéro preuve sociale** (pré-revenu, normal). Compteur d'usage + 1ers avis. |
| 8 | SEO / AEO & contenu | **5** | Qonto / Indy / Abby / Tiime | 🔴 **Plus gros trou** : silos non publiés, 0 page comparative, pas de `/llm-info`, blog mince (prerender juste réparé). |
| 9 | Design & UX | **8** | Ramp / Digits / Stripe | Premium (dark+orange, cartes honnêtes, MotionDiv). Solide. |
| 10 | Mobile & performance (CWV) | **6** | Ramp / Stripe | Code responsive mais **non vérifié déployé** (site pas en ligne). |
| 11 | **Vente automatique (no-touch → paiement)** | **2** | Wave / Stripe / Melio / Ramp | 🔴🔴 **3 bloqueurs durs** : email (activation) + billing (paiement) + transmission. Tunnel = cul-de-sac. |

### Notes globales
- **🅑 Front-end conversion (qualité du site comme actif marketing) : 70 / 100.** Très bon : positionnement et outils gratuits en haut du marché, design premium, honnêteté = différenciateur. Trois trous : profondeur SEO/contenu, preuve sociale (inévitable pré-revenu), absence de palier gratuit.
- **🅓 Vente automatique de bout en bout : 34 / 100.** Le site **capte des leads mais ne vend pas** : il dead-end à l'activation et au paiement. C'est le vrai sujet de la prochaine étape.

**Verdict** : *« On a un meilleur HAUT de tunnel que la plupart des concurrents (message + outils), et un BAS de tunnel inexistant. Les concurrents médiocres en message vendent quand même parce que leur tunnel va jusqu'au bout ; nous non. »*

---

## 4. Plan d'action — « recopier ce qui marche » + rendre la vente automatique

### 🟥 NOW (jours — débloquer la vente + quick wins gratuits)
1. **Débloquer l'activation : Google SSO au signup** (copie FreshBooks/Indy) — contourne l'email GoTrue cassé. *Effort M, impact ÉLEVÉ.* → côté app (odoc-pulse) + repointer les CTA essai dessus.
2. **Palier « Conformité » gratuit/0€** affiché sous le 49 (copie Pennylane/Indy/Abby/Wave) : générateur Factur-X + diagnostic + lecture IA limitée. *Effort M, impact ÉLEVÉ.* Gratuit à servir tant que billing inerte.
3. **Démo interactive sans compte** sur la home (copie Shine/Digits) : « l'IA lit une facture → prépare → vous validez » en GIF/Storylane. *Effort M, impact ÉLEVÉ* (vend la valeur sans buter sur l'onboarding).
4. **CTA primaire = diagnostic/générateur** partout tant que l'essai bute sur un mur (copie Indy mono-CTA). *Effort S, impact MOYEN.*
5. **Compte à rebours daté + micro-copy d'urgence** dans le hero (copie Evoliz/Tiime). *Effort S, impact MOYEN.*
6. **Vérificateur de facture** (drag-drop PDF → mentions + EN16931) (copie FacturConform). *Effort M, impact ÉLEVÉ* — on a déjà le moteur Factur-X.

### 🟧 NEXT (semaines — profondeur SEO + pricing + activation)
7. **Silos SEO conformité par métier × intention** + pages-outils indexables (copie Qonto/Indy/Abby). *Effort L, impact ÉLEVÉ.*
8. **Pages comparatives « OdocPilot vs Pennylane/Qonto/Indy »** sur l'angle créneau vide (copie Wave/Ramp `/versus`). *Effort M, impact ÉLEVÉ.*
9. **Onboarding : routage /diagnostic + pré-remplissage SIRET + aha « dépose une facture » + checklist** (copie Pennylane/QuickBooks/FreshBooks). *Effort L, impact ÉLEVÉ.*
10. **Toggle pricing mensuel/annuel + offre « tarif fondateur » réservable** (copie Pennylane toggle ; hack pré-revenu maison). *Effort M, impact MOYEN.*
11. **Page `/llm-info` + JSON-LD AEO** (copie Melio/Ramp). *Effort S, impact MOYEN.*
12. **Compteur d'usage du free tool + 1ers avis** (copie Wave/Indy). *Effort S, impact MOYEN.*

### 🟩 LATER (quand les 3 bloqueurs sont levés — automatisation du paiement)
13. **Billing Lemon Squeezy actif** → essai 14j sans CB → **conversion auto opt-out + email J-4** (copie Pennylane) ou retombée sur free utile (copie Melio).
14. **Choix forcé « essai gratuit OU -50% / 2 mois offerts »** (copie QuickBooks) à l'activation.
15. **Transmission via PA partenaire branchée** → afficher le statut/registre DGFiP (copie Libeo/Evoliz/Tiime) → la promesse devient complète.
16. **Upsell piloté par l'usage** via le Brain (copie reverse-trial → upsell de Pennylane/Stripe).

---

## 5. 🤖 Blueprint « vente automatique » (self-serve no-touch)

```
ACQUISITION → ACTIVATION → PAIEMENT → EXPANSION
```

1. **Acquisition (no-touch)** : SEO silos conformité + outils gratuits sans compte (générateur, diagnostic, vérificateur) + pages comparatives + cold email légal daté → trafic d'intention. CTA unique vers l'outil gratuit (jamais un mur).
2. **Activation (no-touch)** : signup **Google SSO** (shunte l'email cassé) → routage /diagnostic → **pré-remplissage SIRET** → **aha « dépose une facture, l'IA l'extrait, tu valides en 1 clic »** → checklist d'activation 3 étapes. *C'est ici que tout se joue : sans email réparé OU SSO, il n'y a pas de vente automatique possible.*
3. **Paiement (no-touch)** : reverse trial 14j sans CB → en fin d'essai, **conversion auto opt-out** (billing Lemon actif) avec email de rappel J-4, OU retombée sur le palier gratuit Conformité (jamais de coupure brutale). Avant déblocage billing : **« réserver mon tarif fondateur »** capture l'intention d'achat.
4. **Expansion (no-touch)** : le Brain suggère le passage Pro/Manager quand l'usage le justifie (nb factures, équipe, besoin transmission).

### ⛓️ Dépendances (les 3 bloqueurs — session « Sellability » côté odoc-pulse)
- **Onboarding email cassé** (GoTrue SMTP) → le contournement immédiat est **Google SSO** ; le fix de fond est SMTP (cf. `docs/HANDOFF_GOTRUE_SMTP.md`).
- **Billing Lemon Squeezy inerte** (`BILLING_ENFORCED=false`) → bloque les étapes 3-4. En attendant : palier gratuit + réservation tarif fondateur.
- **Transmission via PA non branchée** (sandbox) → la promesse reste « bientôt » (déjà honnête sur le site).

> **Conclusion stratégique** : le site (front-end) est prêt à concurrencer les meilleurs. Le verrou n'est pas le marketing, c'est le **back-end de vente** : tant que l'email + le billing ne sont pas réparés, aucun montant de copie de tunnel ne produira une vente automatique. Le **Google SSO** est le plus court chemin pour passer de « machine à leads » à « machine à activer ».

---

*Document à mettre à jour après déploiement (mesure réelle) et après la session « Sellability ».*
