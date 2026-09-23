import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  REDIRECTS_JSON,
  REDIRECTS_NGINX,
  renderNginxMap,
  validateRedirects,
  type RedirectTable,
} from "../../scripts/lib/blog-redirects";
import { STATIC_ROUTES } from "../../scripts/site-routes";

const table = JSON.parse(readFileSync(REDIRECTS_JSON, "utf-8")) as RedirectTable;
const entries = Object.entries(table);
const staticLocs = STATIC_ROUTES.map((r) => r.loc);

describe("seo/blog-redirects.json (articles retirés)", () => {
  it("n'a que des clés sous /blog/", () => {
    expect(entries.length).toBeGreaterThan(0);
    for (const [key] of entries) expect(key).toMatch(/^\/blog\/[a-z0-9][a-z0-9-]*$/);
  });

  it("n'utilise que 301 (avec cible) et 410 (sans cible)", () => {
    for (const [key, entry] of entries) {
      expect([301, 410], key).toContain(entry.status);
      if (entry.status === 301) expect(entry.to, key).toMatch(/^\//);
      else expect("to" in entry, key).toBe(false);
    }
  });

  it("ne crée aucune chaîne de redirection (aucune cible n'est elle-même redirigée)", () => {
    for (const [key, entry] of entries) {
      if (entry.status !== 301) continue;
      expect(table[entry.to]?.status, `${key} → ${entry.to}`).not.toBe(301);
    }
  });

  it("ne redirige vers aucun article retiré (aucune cible en 410)", () => {
    for (const [key, entry] of entries) {
      if (entry.status !== 301) continue;
      expect(table[entry.to], `${key} → ${entry.to}`).toBeUndefined();
    }
  });

  it("vise une page statique connue quand la cible est hors du blog", () => {
    for (const [key, entry] of entries) {
      if (entry.status !== 301 || entry.to.startsWith("/blog/")) continue;
      expect(staticLocs, `${key} → ${entry.to}`).toContain(entry.to);
    }
  });

  it("passe la validation du build (même règles que generate-nginx-redirects.ts)", () => {
    expect(validateRedirects(table, staticLocs)).toEqual([]);
  });
});

describe("validateRedirects refuse les tables fautives", () => {
  const ok = { status: 301, to: "/pricing" };
  const cases: Array<[string, unknown, RegExp]> = [
    ["clé hors /blog/", { "/guide/x": ok }, /clé attendue/],
    ["slash final", { "/blog/a/": ok }, /clé attendue/],
    ["statut 302", { "/blog/a": { status: 302, to: "/pricing" } }, /seuls 301 et 410/],
    ["410 avec cible", { "/blog/a": { status: 410, to: "/pricing" } }, /n'a pas de cible/],
    ["301 sans cible", { "/blog/a": { status: 301 } }, /cible 301 invalide/],
    ["cible externe", { "/blog/a": { status: 301, to: "https://evil.example" } }, /cible 301 invalide/],
    ["chaîne", { "/blog/a": { status: 301, to: "/blog/b" }, "/blog/b": ok }, /chaîne de redirections/],
    ["cible en 410", { "/blog/a": { status: 301, to: "/blog/b" }, "/blog/b": { status: 410 } }, /elle-même retirée/],
    ["page inconnue", { "/blog/a": { status: 301, to: "/nulle-part" } }, /page inconnue/],
    ["champ inconnu", { "/blog/a": { status: 410, raison: "x" } }, /champ\(s\) inconnu/],
  ];
  it.each(cases)("%s", (_name, bad, message) => {
    const errors = validateRedirects(bad, staticLocs);
    expect(errors.join("\n")).toMatch(message);
  });
});

describe("seo/blog-redirects.nginx.conf (généré, commité)", () => {
  const committed = readFileSync(REDIRECTS_NGINX, "utf-8").replace(/\r\n/g, "\n");

  it("est à jour avec le JSON (sinon : bun scripts/generate-nginx-redirects.ts)", () => {
    expect(committed).toBe(renderNginxMap(table));
  });

  it("déclare chaque entrée dans la map $blog_retired, 410 compris", () => {
    for (const [key, entry] of entries) {
      const value = entry.status === 410 ? "410" : entry.to;
      expect(committed).toMatch(new RegExp(`^\\s+"${key}"\\s+"${value}";$`, "m"));
    }
    expect(committed).toContain('map $uri $blog_retired {');
    expect(committed).toMatch(/^map_hash_bucket_size \d+;$/m);
  });
});
