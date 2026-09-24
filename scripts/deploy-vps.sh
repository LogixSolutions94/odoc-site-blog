#!/usr/bin/env bash
# deploy-vps.sh — reconstruit l'image odoc-landing et remplace le conteneur sans risque.
#
# Lancé par .github/workflows/deploy.yml, depuis le clone du VPS (après git pull), en UNE
# seule commande : `bash scripts/deploy-vps.sh`. Pourquoi un fichier et pas le bloc `script:`
# du workflow : appleboy/ssh-action (option script_stop) injecte un contrôle du code de sortie
# après CHAQUE ligne du bloc ; il tuait le déploiement au premier essai de la vérification de
# santé (nginx pas encore prêt), avant le retour arrière (constaté le 24/09/2026, runs
# 35947132020 et 35947240049 : nouveau conteneur servi mais job rouge, ancien jamais nettoyé).
#
# Garanties :
#   - un build en échec (base injoignable, contrôles SEO stricts) s'arrête avant de toucher
#     au conteneur en ligne ;
#   - un nouveau conteneur qui ne répond pas 200 sur / et /blog est retiré et l'ancien relancé ;
#   - un déploiement interrompu entre renommage et nettoyage est repris au suivant.
set -euo pipefail

echo "→ docker build odoc-landing:new"
# CACHE_BUST : le build relit la base à chaque fois (sinon le cache Docker fige le blog).
docker build -t odoc-landing:new --build-arg CACHE_BUST="$(date +%s)" .

# Reprise d'un déploiement interrompu entre renommage et nettoyage.
if docker container inspect odoc-landing-old >/dev/null 2>&1; then
  if docker container inspect odoc-landing >/dev/null 2>&1; then
    docker rm -f odoc-landing-old >/dev/null
  else
    docker rename odoc-landing-old odoc-landing
    docker start odoc-landing >/dev/null
  fi
fi

old_image=""
if docker container inspect odoc-landing >/dev/null 2>&1; then
  old_image=$(docker container inspect -f '{{.Image}}' odoc-landing)
  echo "→ ancien conteneur mis de côté (odoc-landing-old)"
  docker rename odoc-landing odoc-landing-old
  docker stop odoc-landing-old >/dev/null
fi

# Répond 0 quand l'URL locale renvoie le code attendu, en 15 essais d'une seconde.
check() {
  local code="000"
  for _ in $(seq 1 15); do
    code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000$1" || true)
    if [ "$code" = "$2" ]; then
      echo "  $1 → $code"
      return 0
    fi
    sleep 1
  done
  echo "  $1 → $code (attendu $2)"
  return 1
}

rollback() {
  echo "✗ nouveau conteneur KO : retour arrière"
  docker logs --tail 30 odoc-landing 2>&1 || true
  docker rm -f odoc-landing >/dev/null 2>&1 || true
  if [ -n "$old_image" ]; then
    docker rename odoc-landing-old odoc-landing
    docker start odoc-landing >/dev/null
    echo "→ ancien conteneur relancé"
  fi
  exit 1
}

echo "→ lancement du nouveau conteneur"
if ! docker run -d --name odoc-landing --network coolify -p 3000:80 --restart unless-stopped odoc-landing:new >/dev/null; then
  rollback
fi
if ! check / 200 || ! check /blog 200; then
  rollback
fi

docker tag odoc-landing:new odoc-landing:latest
if [ -n "$old_image" ]; then
  docker rm odoc-landing-old >/dev/null
  # Image précédente devenue orpheline : on la retire (seulement elle).
  if [ "$old_image" != "$(docker image inspect -f '{{.Id}}' odoc-landing:new)" ]; then
    docker rmi "$old_image" >/dev/null 2>&1 || true
  fi
fi
echo "✓ nouveau conteneur en service"
