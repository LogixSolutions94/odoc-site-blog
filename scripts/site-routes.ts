/**
 * site-routes.ts — Routes statiques du site : SOURCE UNIQUE.
 *
 * Lue par :
 *   - scripts/generate-sitemap.ts   → <url> statiques du sitemap ;
 *   - scripts/prerender-pages.ts    → une page HTML prérendue par route (sauf « / ») ;
 *   - les tests (src/test/*.test.ts) → cohérence sitemap / prérendu / redirections.
 *
 * Ajouter une page publique = l'ajouter ici (et sa route dans src/App.tsx).
 * Les articles de blog n'y figurent pas : ils viennent de la base (blog_posts).
 */
export type StaticRoute = {
  loc: string;
  priority: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
};

export const STATIC_ROUTES: StaticRoute[] = [
  { loc: "/",                  priority: "1.0", changefreq: "weekly"  },
  { loc: "/pricing",           priority: "0.9", changefreq: "monthly" },
  { loc: "/fonctionnalites",   priority: "0.9", changefreq: "monthly" },
  { loc: "/e-facture",         priority: "0.9", changefreq: "weekly"  },
  { loc: "/diagnostic",        priority: "0.8", changefreq: "monthly" },
  { loc: "/generateur-factur-x", priority: "0.8", changefreq: "monthly" },
  { loc: "/verificateur",      priority: "0.8", changefreq: "monthly" },
  { loc: "/llm-info",          priority: "0.6", changefreq: "monthly" },
  { loc: "/guide/facturation-electronique-2026", priority: "0.8", changefreq: "monthly" },
  { loc: "/guide/obligations-2026-2027",         priority: "0.8", changefreq: "monthly" },
  { loc: "/guide/plateforme-agreee",             priority: "0.8", changefreq: "monthly" },
  { loc: "/guide/factur-x",                      priority: "0.8", changefreq: "monthly" },
  { loc: "/guide/tpe-sans-comptable",            priority: "0.8", changefreq: "monthly" },
  { loc: "/comparatif/pennylane", priority: "0.8", changefreq: "monthly" },
  { loc: "/comparatif/qonto",     priority: "0.8", changefreq: "monthly" },
  { loc: "/comparatif/indy",      priority: "0.8", changefreq: "monthly" },
  { loc: "/comparatif/sellsy",    priority: "0.7", changefreq: "monthly" },
  { loc: "/comparatif/axonaut",   priority: "0.7", changefreq: "monthly" },
  { loc: "/comparatif/abby",      priority: "0.7", changefreq: "monthly" },
  { loc: "/artisans",          priority: "0.7", changefreq: "monthly" },
  { loc: "/commerce",          priority: "0.7", changefreq: "monthly" },
  { loc: "/professions-liberales", priority: "0.7", changefreq: "monthly" },
  { loc: "/cabinets-comptables", priority: "0.6", changefreq: "monthly" },
  { loc: "/editeurs",          priority: "0.7", changefreq: "monthly" },
  { loc: "/lexique",           priority: "0.7", changefreq: "monthly" },
  { loc: "/livre-blanc",       priority: "0.8", changefreq: "monthly" },
  { loc: "/roadmap",           priority: "0.5", changefreq: "monthly" },
  { loc: "/changelog",         priority: "0.5", changefreq: "monthly" },
  { loc: "/a-propos",          priority: "0.7", changefreq: "monthly" },
  { loc: "/blog",              priority: "0.8", changefreq: "daily"   },
  { loc: "/contact",           priority: "0.6", changefreq: "monthly" },
  { loc: "/mentions-legales",  priority: "0.3", changefreq: "yearly"  },
  { loc: "/cgu",               priority: "0.3", changefreq: "yearly"  },
];
