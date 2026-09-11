# Architecture & déploiement — détail

> À lire avant toute opération Docker/Nginx, tout déploiement manuel, ou pour retrouver un chemin/domaine précis. La règle critique (ne jamais toucher le SaaS) est dans `AGENTS.md` — ce fichier n'en est que le détail opérationnel.

---

## Domaines en production

```
┌─ https://odocpilot.com         → Landing page + Blog (React SPA)  [ce repo]
├─ https://app.odocpilot.com     → SaaS Frontend (Docker, port 3001)
├─ https://api.odocpilot.com     → API REST (port 4000)
├─ https://blog.odocpilot.com    → Blog (port 3100)
├─ https://docs.odocpilot.com    → Docs (port 3200)
└─ https://status.odocpilot.com  → Status page (port 3300)
```

## Répertoires locaux

```
/src/pages/
  ├── HomePage.tsx               → Landing page hero + modules
  ├── PricingPage.tsx            → Pricing 4 plans + comparatif
  ├── FonctionnalitesPage.tsx    → 11 modules détaillés
  ├── BlogPage.tsx               → Blog listing
  ├── BlogPostPage.tsx           → Article individuel
  ├── ContactPage.tsx            → Formulaire contact
  ├── AProposPage.tsx            → À propos
  └── ...autres pages

/src/components/
  ├── SiteHeader.tsx             → Navigation principale
  ├── SiteFooter.tsx             → Footer
  ├── MotionDiv.tsx              → Wrapper Framer Motion
  ├── SEOHead.tsx                → Composant SEO/helmet
  ├── MarketingLayout.tsx        → Layout pages marketing
  └── /ui/                       → shadcn/ui components

/src/integrations/supabase/
  └── client.ts                  → Client Supabase config

/public/
  └── ...assets, favicon, etc.
```

## Déploiement VPS

```
VPS : 151.80.144.236 (OVH)
SSH : ssh -i ~/.ssh/odoc_vps_rsa root@151.80.144.236

Landing page : /var/www/odoc/               (fichiers statiques)
Nginx config : /etc/nginx/sites-available/odocpilot.conf
SSL certs    : /etc/letsencrypt/live/odocpilot.com/
```

---

## Déploiement automatique (depuis le 2026-06-28)

`.github/workflows/deploy.yml` rebuild `odoc-landing` sur le VPS **à chaque push de code sur `main`** (secrets `VPS_*` posés et vérifiés OK) : git pull + docker build + stop/rm/run + check HTTP 200.

Donc **un merge sur `main` = déploiement auto** — plus besoin de rebuild manuel. Vérifier un déploiement : `gh run list --workflow=deploy.yml`.

Le rebuild manuel ci-dessous ne sert plus que de **fallback** si le workflow échoue, ou pour tester hors `main`.

## Workflow manuel — fallback uniquement

⚠️ **RÈGLE ABSOLUE** : Ce repo utilise une image Docker **baked-in** (pas de volume mount). `docker restart odoc-landing` seul **NE rebuild PAS l'image** → les changements ne sont **PAS** déployés !

```bash
# ✅ WORKFLOW CORRECT à chaque déploiement manuel
git pull origin main                      # Récupérer les changements VPS
docker build -t odoc-landing .            # Reconstruire l'image
docker stop odoc-landing && docker rm odoc-landing  # Arrêter & supprimer
docker run -d \
  --name odoc-landing \
  --network coolify \
  -p 3000:80 \
  --restart unless-stopped \
  odoc-landing                            # Relancer avec nouvelle image

curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000  # Vérifier 200

# ❌ JAMAIS SEUL (ancien build reste actif)
docker restart odoc-landing

# ❌ JAMAIS SCP sans rebuild (fichiers sur VPS mais pas dans image)
scp -i ~/.ssh/odoc_vps_rsa -r dist/* root@151.80.144.236:/var/www/odoc/

# ❌ INTERDIT — ne jamais faire depuis ce repo
docker restart odoc-frontend  # Jamais toucher le SaaS
```

## Ancien processus manuel local → VPS (partiellement périmé)

> Historique : ce processus en 4 étapes (scp direct) précède le déploiement automatique du 2026-06-28. Il reste documenté ici comme fallback/référence mais **le déploiement automatique fait foi** (voir plus haut). Le bloc « Déploiement rapide » qui suivait dans l'ancien CLAUDE.md (section « Questions ? ») faisait doublon avec l'étape 3 ci-dessous — fusionné ici, rien perdu.

**1. Développer & tester**
```bash
npm run dev                    # Démarrer le dev server
npm run build                  # Vérifier le build
git add .
git commit -m "DESCRIPTION"
```

**2. Vérifier avant de pousser**
```bash
npm run build                  # ✅ Doit compiler sans erreurs
git log --oneline -5           # Vérifier les commits
```

**3. Déployer sur VPS**
```bash
npm run build && \
scp -i ~/.ssh/odoc_vps_rsa -r dist/* root@151.80.144.236:/var/www/odoc/
```

**4. Vérifier que c'est live**
```bash
curl -I https://odocpilot.com  # Doit retourner HTTP/2 200
```

## Commandes utiles

```bash
# Voir les logs Nginx
ssh -i ~/.ssh/odoc_vps_rsa root@151.80.144.236 "tail -f /var/log/nginx/access.log"

# Redémarrer Nginx
ssh -i ~/.ssh/odoc_vps_rsa root@151.80.144.236 "systemctl restart nginx"

# Vérifier certificats SSL
ssh -i ~/.ssh/odoc_vps_rsa root@151.80.144.236 "certbot certificates"
```
