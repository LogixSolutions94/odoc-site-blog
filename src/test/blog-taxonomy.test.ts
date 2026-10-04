import { describe, it, expect } from "vitest";
import { resolveSiloSlug, categoryGuideSlug, categoryLabel } from "../lib/blogTaxonomy";
import { pickSeoTitle, pickSeoDescription } from "../lib/blogContent";

describe("resolveSiloSlug", () => {
  it("l'override par slug est prioritaire sur silo et category", () => {
    expect(
      resolveSiloSlug({
        slug: "factur-x-rejetee-9-erreurs-plateforme-agreee",
        silo: "facturation-electronique",
        category: null,
      }),
    ).toBe("factur-x");
  });

  it("mappe un ancien silo large vers outils-gestion", () => {
    expect(resolveSiloSlug({ slug: "x", silo: "logiciel-gestion-tpe-pme", category: null })).toBe("outils-gestion");
    expect(resolveSiloSlug({ slug: "x", silo: "crm-gestion-commerciale", category: null })).toBe("outils-gestion");
  });

  it("btp-artisans rejoint le segment TPE sans comptable", () => {
    expect(resolveSiloSlug({ slug: "x", silo: "btp-artisans", category: null })).toBe("tpe-sans-comptable");
  });

  it("conserve un silo déjà canonique", () => {
    expect(resolveSiloSlug({ slug: "y", silo: "facturation-electronique", category: null })).toBe(
      "facturation-electronique",
    );
  });

  it("retombe sur category (ancienne colonne) si silo absent", () => {
    expect(resolveSiloSlug({ slug: "z", silo: null, category: "plateforme-agreee" })).toBe("plateforme-agreee");
  });

  it("null si rien de reconnu", () => {
    expect(resolveSiloSlug({ slug: "z", silo: null, category: null })).toBeNull();
    expect(resolveSiloSlug({ slug: "z", silo: "inconnu", category: "inconnu" })).toBeNull();
  });
});

describe("categoryGuideSlug", () => {
  it("null pour outils-gestion (pas de page pilier)", () => {
    expect(categoryGuideSlug("outils-gestion")).toBeNull();
  });
  it("slug du pilier pour un silo wedge", () => {
    expect(categoryGuideSlug("facturation-electronique")).toBe("facturation-electronique-2026");
    expect(categoryGuideSlug("plateforme-agreee")).toBe("plateforme-agreee");
  });
  it("libellé lisible pour outils-gestion", () => {
    expect(categoryLabel("outils-gestion")).toBe("Outils & gestion");
  });
});

describe("pickSeoTitle / pickSeoDescription", () => {
  it("privilégie seo_* quand présent", () => {
    expect(pickSeoTitle({ title: "T", seo_title: "S", meta_title: "M" })).toBe("S");
    expect(pickSeoDescription({ title: "T", excerpt: "E", seo_description: "S", meta_description: "M" })).toBe("S");
  });
  it("retombe sur meta_* (colonnes pipeline) puis titre / chapeau", () => {
    expect(pickSeoTitle({ title: "T", seo_title: null, meta_title: "M" })).toBe("M");
    expect(pickSeoTitle({ title: "T", seo_title: "  ", meta_title: null })).toBe("T");
    expect(pickSeoDescription({ title: "T", excerpt: "E", seo_description: null, meta_description: "M" })).toBe("M");
    expect(pickSeoDescription({ title: "T", excerpt: "E", seo_description: null, meta_description: null })).toBe("E");
  });
});
