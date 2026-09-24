/**
 * generate-nginx-redirects.ts — Produit la table nginx des articles de blog retirés.
 *
 * ENTRÉE  : seo/blog-redirects.json (source de vérité, relue en revue).
 * SORTIE  : seo/blog-redirects.nginx.conf — bloc `map` de niveau http, copié par le
 *           Dockerfile en /etc/nginx/conf.d/00-blog-redirects.conf et utilisé par
 *           nginx.conf dans `location /blog/`. Le fichier est COMMITÉ (lisible en revue)
 *           ET régénéré à chaque build : l'image sert toujours la table du JSON.
 *
 * FAIL-CLOSED : table incohérente (clé hors /blog/, statut autre que 301/410, chaîne de
 * redirections, cible retirée, page statique inconnue) → code 1, le build s'arrête.
 *
 * Usage :
 *   bun scripts/generate-nginx-redirects.ts               valide + écrit la map
 *   bun scripts/generate-nginx-redirects.ts --check-dist  après le prérendu : signale les
 *     301 dont la cible /blog/<slug> n'a pas de page prérendue (redirection → 404).
 *     Avertissement seulement : l'agent blog peut dépublier un article cible.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  REDIRECTS_NGINX,
  loadRedirects,
  renderNginxMap,
  unrenderedBlogTargets,
} from "./lib/blog-redirects";

try {
  const table = loadRedirects();
  if (process.argv.includes("--check-dist")) {
    const missing = unrenderedBlogTargets(table, resolve("dist"));
    if (missing.size === 0) {
      console.log("[redirects] ✓ chaque cible /blog/ des 301 a sa page prérendue");
    } else {
      console.warn(`[redirects] ⚠ ${missing.size} cible(s) de 301 sans page prérendue : ces redirections aboutissent à une 404`);
      for (const [to, count] of missing) console.warn(`    ${to}  (← ${count} redirection(s))`);
    }
  } else {
    writeFileSync(REDIRECTS_NGINX, renderNginxMap(table), "utf-8");
    console.log(`[redirects] ✓ ${Object.keys(table).length} entrée(s) → seo/blog-redirects.nginx.conf`);
  }
} catch (e) {
  console.error("[redirects] ✗", e instanceof Error ? e.message : e);
  process.exitCode = 1;
}
