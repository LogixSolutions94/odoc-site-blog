/**
 * blog-redirects.ts — Table des articles de blog retirés : validation et rendu nginx.
 *
 * SOURCE DE VÉRITÉ : seo/blog-redirects.json
 *   { "/blog/<slug>": { "status": 301, "to": "/chemin" } | { "status": 410 } }
 *
 * Module PUR (aucun effet de bord à l'import) : utilisé par
 * scripts/generate-nginx-redirects.ts (build), scripts/generate-sitemap.ts
 * (exclusion des articles retirés) et src/test/blog-redirects.test.ts.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { STATIC_ROUTES } from "../site-routes";

export type RetiredEntry = { status: 301; to: string } | { status: 410 };
export type RedirectTable = Record<string, RetiredEntry>;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const REDIRECTS_JSON = resolve(ROOT, "seo/blog-redirects.json");
export const REDIRECTS_NGINX = resolve(ROOT, "seo/blog-redirects.nginx.conf");

/** Même règle que les slugs prérendus (prerender-blog.ts) : [a-z0-9-], sans slash final. */
const KEY_RE = /^\/blog\/[a-z0-9][a-z0-9-]*$/;
/** Chemin interne simple : « / » ou « /segment(/segment)* », sans query ni slash final. */
const TARGET_RE = /^\/(?:[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*)?$/;

/** Renvoie la liste des erreurs (vide = table valide). */
export function validateRedirects(table: unknown, staticRoutes: readonly string[]): string[] {
  if (!table || typeof table !== "object" || Array.isArray(table)) {
    return ['la table doit être un objet { "/blog/<slug>": { "status": … } }'];
  }
  const entries = Object.entries(table as Record<string, unknown>);
  const statusOf = new Map<string, unknown>(
    entries.map(([k, v]) => [k, v && typeof v === "object" ? (v as { status?: unknown }).status : undefined]),
  );
  const errors: string[] = [];
  if (entries.length === 0) errors.push("table vide");

  for (const [key, raw] of entries) {
    if (!KEY_RE.test(key)) {
      errors.push(`${key} : clé attendue /blog/<slug> ([a-z0-9-], sans slash final)`);
    }
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      errors.push(`${key} : valeur invalide`);
      continue;
    }
    const { status, to, ...rest } = raw as Record<string, unknown>;
    const extra = Object.keys(rest);
    if (extra.length) errors.push(`${key} : champ(s) inconnu(s) : ${extra.join(", ")}`);

    if (status === 410) {
      if (to !== undefined) errors.push(`${key} : un 410 n'a pas de cible (« to » à retirer)`);
      continue;
    }
    if (status !== 301) {
      errors.push(`${key} : statut ${JSON.stringify(status)} (seuls 301 et 410 sont admis)`);
      continue;
    }
    if (typeof to !== "string" || !TARGET_RE.test(to)) {
      errors.push(`${key} : cible 301 invalide (${JSON.stringify(to)})`);
      continue;
    }
    if (statusOf.get(to) === 301) {
      errors.push(`${key} → ${to} : chaîne de redirections (la cible est elle-même redirigée)`);
    } else if (statusOf.has(to)) {
      errors.push(`${key} → ${to} : la cible est elle-même retirée (${String(statusOf.get(to))})`);
    }
    if (!to.startsWith("/blog/") && !staticRoutes.includes(to)) {
      errors.push(`${key} → ${to} : page inconnue (absente de scripts/site-routes.ts)`);
    }
  }
  return errors;
}

/** Lit et valide la table ; lève une erreur lisible si elle est incohérente. */
export function loadRedirects(): RedirectTable {
  const table: unknown = JSON.parse(readFileSync(REDIRECTS_JSON, "utf-8"));
  const errors = validateRedirects(table, STATIC_ROUTES.map((r) => r.loc));
  if (errors.length) {
    throw new Error(`seo/blog-redirects.json invalide :\n  - ${errors.join("\n  - ")}`);
  }
  return table as RedirectTable;
}

/**
 * Taille de seau de hachage nécessaire pour la clé la plus longue :
 * ngx_hash_elt_t = pointeur (8) + longueur (2) + clé, aligné sur 8, plus le pointeur
 * de fin de seau (8). Au-delà de 64 octets (défaut), nginx refuse de démarrer.
 */
function bucketSizeFor(maxKeyLength: number): number {
  const needed = Math.ceil((8 + 2 + maxKeyLength) / 8) * 8 + 8;
  let size = 64;
  while (size < needed) size *= 2;
  return size;
}

/** Rendu déterministe (clés triées) de la map nginx, contexte http. */
export function renderNginxMap(table: RedirectTable): string {
  const keys = Object.keys(table).sort();
  const n301 = keys.filter((k) => table[k].status === 301).length;
  const n410 = keys.length - n301;
  const longest = Math.max(...keys.map((k) => k.length));
  const pad = longest + 3;
  const rows = keys.map((k) => {
    const entry = table[k];
    const value = entry.status === 410 ? "410" : entry.to;
    return `    ${`"${k}"`.padEnd(pad)}"${value}";`;
  });
  return [
    "# ─────────────────────────────────────────────────────────────────────────────",
    "# FICHIER GÉNÉRÉ par scripts/generate-nginx-redirects.ts : ne pas modifier à la main.",
    `# Source de vérité : seo/blog-redirects.json (${keys.length} entrées : ${n301} × 301, ${n410} × 410).`,
    "# Copié par le Dockerfile en /etc/nginx/conf.d/00-blog-redirects.conf (contexte http).",
    "# Lu par nginx.conf (location /blog/) : chemin cible = 301, « 410 » = 410, vide = rien.",
    "# ─────────────────────────────────────────────────────────────────────────────",
    "",
    `# Clés jusqu'à ${longest} caractères : le seau par défaut (64 octets) est trop petit,`,
    "# nginx refuserait de démarrer (« could not build map_hash »).",
    `map_hash_bucket_size ${bucketSizeFor(longest)};`,
    "",
    "map $uri $blog_retired {",
    '    default "";',
    ...rows,
    "}",
    "",
  ].join("\n");
}

/**
 * Cibles /blog/<slug> de 301 sans page prérendue dans `distDir` (la redirection
 * aboutirait à une 404). Renvoie cible → nombre de redirections concernées.
 */
export function unrenderedBlogTargets(table: RedirectTable, distDir: string): Map<string, number> {
  const missing = new Map<string, number>();
  for (const entry of Object.values(table)) {
    if (entry.status !== 301 || !entry.to.startsWith("/blog/")) continue;
    if (!existsSync(resolve(distDir, entry.to.slice(1), "index.html"))) {
      missing.set(entry.to, (missing.get(entry.to) ?? 0) + 1);
    }
  }
  return missing;
}
