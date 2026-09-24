/**
 * prerender-pages.ts — Prérend les pages marketing APRÈS `vite build`.
 *
 * POURQUOI : le site est une SPA. Sans prérendu, le HTML brut de /pricing, /e-facture,
 * /guide/*, /comparatif/*… porte le <title> et la description de l'ACCUEIL : pour un robot
 * qui n'exécute pas le JS (et pour le premier passage de Google), 30 pages identiques.
 *
 * Écrit dist/<route>/index.html pour chaque route statique du sitemap (sauf « / », qui
 * garde dist/index.html). nginx sert ce fichier à /<route> (try_files $uri/index.html).
 * Détail de ce qui est écrit : scripts/lib/marketing-pages.ts.
 *
 * Aucune dépendance réseau : toute erreur est un défaut de code ou de contenu → code 1,
 * le build s'arrête (local comme Docker).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { prerenderableRoutes, renderPage } from "./lib/marketing-pages";

const DIST = resolve("dist");
const SHELL = resolve(DIST, "index.html");

try {
  if (!existsSync(SHELL)) throw new Error("dist/index.html absent — lancer `vite build` d'abord");
  const shell = readFileSync(SHELL, "utf-8");
  const routes = prerenderableRoutes();
  for (const loc of routes) {
    const { html } = renderPage(shell, loc);
    const dir = resolve(DIST, ...loc.slice(1).split("/"));
    mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, "index.html"), html, "utf-8");
  }
  console.log(`[prerender-pages] ✓ ${routes.length} page(s) marketing pré-rendue(s) dans dist/<route>/index.html`);
} catch (e) {
  console.error("[prerender-pages] ✗", e instanceof Error ? e.message : e);
  process.exitCode = 1;
}
