# CHANGELOG MARKETING — Corrections de conformité

> Date : 2026-05-29
> Source : `odoc-pulse/docs/AUDIT_ACTION_PLAN.md` (Phase A — P0)
> Objectif : aligner les promesses du site marketing public sur le périmètre réellement implémenté dans le produit, afin de prévenir tout risque DGCCRF (pratique commerciale trompeuse), CNIL et nullité de clauses contractuelles. Cette correction est faite de manière proactive, en l'absence de tout signalement extérieur, comme preuve de bonne foi.

---

## Résumé exécutif

14 promesses identifiées comme juridiquement risquées par l'audit interne du 27 mai 2026 ont été corrigées le 29 mai 2026 sur les pages publiques (`HomePage`, `EFacturePage`, `FonctionnalitesPage`, `PricingPage`). Les claims supprimés ou modifiés portent sur :

- la certification NF Z42-013 (remplacée par la description factuelle : empreinte SHA-256 + journal d'événements) ;
- la précision chiffrée de l'extraction IA (98 %) non mesurée par un benchmark public ;
- la disponibilité "prête PDP" des formats Factur-X / UBL / CII (réelle uniquement en lecture ; la génération native est planifiée Q3 2026) ;
- les claims cryptographiques excessifs ("admissible en justice", "falsification impossible") remplacés par la description technique réelle ;
- le terme "chiffrement AES-256" remplacé par "TLS 1.3 en transit + hébergement chiffré OVH France" ;
- la mention "✅ Conforme maintenant" sur la directive UE 2014/55/UE remplacée par "🚧 En développement — Q3 2026" ;
- les "Smart Connectors bidirectionnels" Google Drive / Dropbox remplacés par "Import automatique" ;
- l'intégration Google Calendar bidirectionnelle annoncée comme prévue Q4 2026 ;
- le SSO SAML/OpenID du plan Entreprise étiqueté "sur demande — roadmap" ;
- les "permissions granulaires par dossier" remplacées par la description réelle (rôles owner/admin/member/viewer) ;
- l'"infrastructure dédiée + SLA contractuel" Entreprise remplacée par "sur étude (cahier des charges)" ;
- les stats marketing "200+ équipes / 99,9 % uptime" remplacées par des métriques factuelles ;
- la "détection de fraude IA temps réel" remplacée par "détection automatique par règles métier" ;
- le "rapprochement bancaire automatique" remplacé par "rapprochement par import CSV de relevés".

---

## Détail des corrections

| # | Fichier | Avant | Après |
|---|---|---|---|
| P0-1 | `HomePage.tsx`, `EFacturePage.tsx` (badges, hero, comparatif) | "🏆 NF Z42-013 certifié" / "Conformité NF Z42-013" / "Norme NF Z42-013" | "Empreinte SHA-256 + journal d'événements" / "Archivage SHA-256 horodaté" / "Archivage à valeur probante (référentiel NF Z42-013)" avec mention "Certification roadmap 2026" |
| P0-2 | `EFacturePage.tsx` | "Extraction IA — 98 %+ de précision" + "zéro erreur" | "Extraction IA — montants, SIRET, IBAN, dates" + "réduit drastiquement la saisie manuelle" |
| P0-3 | `EFacturePage.tsx` | "Formats légaux : Factur-X, UBL, CII — Prêt PDP dès aujourd'hui" | "Lecture/détection Factur-X — génération Factur-X/UBL/CII prévue Q3 2026" |
| P0-4 | `EFacturePage.tsx` | "signée cryptographiquement SHA-256 … falsification impossible, admissible en justice" | "empreinte SHA-256 horodatée à la seconde, utilisée pour le contrôle d'intégrité et le journal d'événements" |
| P0-5 | `HomePage.tsx`, `PricingPage.tsx` | "Chiffrement AES-256" | "TLS 1.3 + hébergement chiffré OVH France" |
| P0-6 | `EFacturePage.tsx` (bloc Directive UE 2014/55/UE) | "✅ Conforme maintenant" | "🚧 En développement — Q3 2026" (description ajustée en conséquence) |
| P0-7 | `FonctionnalitesPage.tsx` (M10 Smart Connectors) | "Synchronisation Google Drive/Dropbox bidirectionnelle" | "Import automatique Google Drive et Dropbox" |
| P0-8 | `FonctionnalitesPage.tsx` (M11 Calendrier) | "Intégration Google Calendar bidirectionnelle" | "Calendrier partagé Odoc — intégration Google Calendar prévue Q4 2026" |
| P0-9 | `PricingPage.tsx` (plan Entreprise) | "SSO SAML/OpenID" | "SSO SAML/OpenID — sur demande, roadmap" |
| P0-10 | `FonctionnalitesPage.tsx` (M05 Équipe) | "Permissions granulaires par module et par dossier" | "Rôles owner / admin / member / viewer" |
| P0-11 | `PricingPage.tsx` (plan Entreprise) | "Infrastructure dédiée + SLA contractuel" | "Instance dédiée — sur étude (cahier des charges)" + "SLA — sur étude contractuelle" |
| P0-12 | `HomePage.tsx` (StatCounter + hero badge) | "200+ Équipes actives" / "99,9 % Uptime garanti" / "Déjà adopté par +200 équipes" | Retirés. Remplacés par "11 modules intégrés", "2 h gagnées / jour (estimé)", "100 % hébergé en France", "0 € pour démarrer". Badge hero : "Accès anticipé ouvert". Trust badge : "Bêta active — SLA en cours de mise en place". |
| P0-13 | `EFacturePage.tsx` (F-EF-04 + comparatif) | "Détection de fraude IA en temps réel" | "Détection automatique par règles métier (doublons, montants, OCR low-confidence, TVA incohérente)" |
| P0-14 | `EFacturePage.tsx` (F-EF-08) | "Rapprochement bancaire automatique" | "Rapprochement par import CSV de relevés — open banking prévu en 2026" |
| P0-15 | `docs/CHANGELOG_MARKETING.md` | — | Création du présent document |

---

## Roadmap de retour aux promesses initiales

Plusieurs des claims retirés temporairement font partie de chantiers déjà planifiés dans la roadmap interne :

- **Génération Factur-X / UBL 2.1 / CII conforme EN 16931** — chantier P1-1 / P1-2 (échéance Q3 2026, en amont de l'obligation française du 1er septembre 2026).
- **Horodatage RFC 3161 via TSA qualifiée (Universign)** — chantier P1-3.
- **Chaîne de hash documentaire complète + dépôt de la certification NF Z42-013** — chantiers P1-4 et roadmap 2026.
- **Open banking via Bridge ou Powens** — chantier P1-8.
- **Chiffrement disque LUKS sur VPS OVH + chiffrement applicatif pgcrypto sur colonnes sensibles** — chantiers P1-9 et P1-10.
- **SSO SAML pour le plan Entreprise** — chantier P2-1.
- **Intégration Google Calendar bidirectionnelle** — Q4 2026.

Ces livraisons feront l'objet d'une réintroduction graduelle des claims correspondants sur le site marketing, sourcés par les preuves techniques (numéros de version, certificats, audits indépendants) au moment de leur disponibilité réelle.

---

## Contact

Toute question relative aux corrections ci-dessus peut être adressée à : `contact@odocpilot.com`.
