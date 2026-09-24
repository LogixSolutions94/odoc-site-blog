import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { prerenderableRoutes, renderPage, BASE_URL } from "../../scripts/lib/marketing-pages";
import { STATIC_ROUTES } from "../../scripts/site-routes";
import { GUIDE_BY_SLUG } from "../content/guides";
import { COMPARISON_BY_SLUG, compareDisclaimer } from "../content/comparisons";
import { EDITEURS } from "../content/editeurs";

const ROOT = resolve(__dirname, "../..");
// Même <head> que dist/index.html (Vite n'y ajoute que les balises des assets).
const shell = readFileSync(resolve(ROOT, "index.html"), "utf-8");
const shellTitle = /<title>([\s\S]*?)<\/title>/.exec(shell)?.[1];

/** Décode les entités produites par esc()/attr() pour comparer au texte source. */
const unesc = (s: string) => s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const one = (html: string, re: RegExp) => {
  const all = html.match(new RegExp(re.source, "g")) ?? [];
  expect(all.length, `${re} doit apparaître une seule fois`).toBe(1);
  return unesc(re.exec(html)![1]);
};

describe("prérendu des pages marketing", () => {
  const routes = prerenderableRoutes();

  it("couvre toutes les routes statiques du sitemap sauf l'accueil", () => {
    expect(routes).toEqual(STATIC_ROUTES.map((r) => r.loc).filter((l) => l !== "/"));
    expect(routes).toContain("/editeurs");
  });

  it.each(routes)("%s : title, description, canonical, og et contenu propres à la page", (loc) => {
    const { html, meta } = renderPage(shell, loc);
    const title = one(html, /<title>([\s\S]*?)<\/title>/);
    expect(title).toBe(meta.title);
    expect(title).not.toBe(shellTitle);
    expect(one(html, /<meta name="description" content="([^"]*)"/)).toBe(meta.description);
    expect(one(html, /<link rel="canonical" href="([^"]*)"/)).toBe(`${BASE_URL}${loc}`);
    expect(one(html, /<meta property="og:url" content="([^"]*)"/)).toBe(`${BASE_URL}${loc}`);
    expect(one(html, /<meta property="og:title" content="([^"]*)"/)).toBe(meta.title);
    expect(one(html, /<meta property="og:description" content="([^"]*)"/)).toBe(meta.description);
    expect(one(html, /<meta name="twitter:title" content="([^"]*)"/)).toBe(meta.title);
    expect(one(html, /<h1[^>]*>([\s\S]*?)<\/h1>/)).toBe(meta.h1);
    expect(meta.intro.length).toBeGreaterThanOrEqual(40);
    expect(html).toContain(`<div id="root"><main`);
  });

  it("/editeurs : texte validé complet et FAQPage", () => {
    const { html, meta } = renderPage(shell, "/editeurs");
    expect(meta.title).toBe("Test de conformité Factur-X pour éditeurs — OdocPilot");
    expect(meta.description).toBe(EDITEURS.seoDesc);
    const text = unesc(html);
    for (const s of [EDITEURS.intro, EDITEURS.why.body, EDITEURS.learned.outro, EDITEURS.plans.note, EDITEURS.notThis.body, EDITEURS.after.body, EDITEURS.email]) {
      expect(text).toContain(s);
    }
    for (const f of EDITEURS.faqs) expect(text).toContain(f.a);
    const ld = JSON.parse(/<script type="application\/ld\+json" data-rh="true">([\s\S]*?)<\/script>/.exec(html)![1]);
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity).toHaveLength(EDITEURS.faqs.length);
  });

  it("/guide/plateforme-agreee : sections, FAQ et liens du guide", () => {
    const g = GUIDE_BY_SLUG["plateforme-agreee"];
    const text = unesc(renderPage(shell, "/guide/plateforme-agreee").html);
    for (const s of g.sections) expect(text).toContain(s.h2);
    for (const f of g.faqs) expect(text).toContain(f.q);
    for (const r of g.related) expect(text).toContain(`href="${r.to}"`);
  });

  it("/comparatif/pennylane : tableau, réserve et FAQ", () => {
    const c = COMPARISON_BY_SLUG["pennylane"];
    const text = unesc(renderPage(shell, "/comparatif/pennylane").html);
    for (const r of c.rows) expect(text).toContain(r.dim);
    expect(text).toContain(compareDisclaimer("Pennylane"));
    for (const f of c.faqs) expect(text).toContain(f.q);
  });

  it("échappe le HTML : aucune balise ne s'échappe du texte injecté", () => {
    for (const loc of routes) {
      const { html } = renderPage(shell, loc);
      const root = /<div id="root">([\s\S]*)<\/div>\s*<script/.exec(html)![1];
      expect(root, loc).not.toMatch(/<script|javascript:|onerror=/i);
    }
  });
});

describe("routes de l'application", () => {
  const app = readFileSync(resolve(ROOT, "src/App.tsx"), "utf-8");
  const paths = [...app.matchAll(/<Route path="([^"]+)"/g)].map((m) => m[1]);
  const matches = (loc: string) =>
    paths.some((p) => new RegExp(`^${p.replace(/:[a-z]+/gi, "[a-z0-9-]+")}$`).test(loc));

  it.each(STATIC_ROUTES.map((r) => r.loc))("%s a une route dans App.tsx", (loc) => {
    expect(matches(loc)).toBe(true);
  });
});
