import redirectsRaw from "../../seo/blog-redirects.json?raw";

/**
 * Articles retirés du blog (301 ou 410, source : seo/blog-redirects.json). Certains sont encore
 * « published » en base : on ne les liste jamais, sinon le lecteur tombe sur une page supprimée.
 * Réservé au navigateur (import ?raw de Vite) : les scripts de build lisent le JSON eux-mêmes.
 */
export const RETIRED_SLUGS = Object.keys(JSON.parse(redirectsRaw) as Record<string, unknown>)
  .filter((k) => k.startsWith("/blog/"))
  .map((k) => k.slice("/blog/".length));

const RETIRED = new Set(RETIRED_SLUGS);
export const isRetiredPost = (slug: string) => RETIRED.has(slug);
