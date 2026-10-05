import { describe, it, expect } from "vitest";
import { resolveSiloSlug, categoryGuideSlug, categoryLabel } from "../lib/blogTaxonomy";
import { pickSeoTitle, pickSeoDescription, autoLinkInternal } from "../lib/blogContent";

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

describe("autoLinkInternal (maillage interne au rendu)", () => {
  it("lie la 1re occurrence d'un terme vers son pilier", () => {
    expect(autoLinkInternal("La Factur-X est un format hybride.")).toBe(
      "La [Factur-X](/guide/factur-x) est un format hybride.",
    );
  });
  it("une seule fois par URL de destination", () => {
    const out = autoLinkInternal("Factur-X ici. Et Factur-X là.");
    expect((out.match(/\/guide\/factur-x/g) || []).length).toBe(1);
  });
  it("ne touche ni les titres, ni le code (bloc et inline)", () => {
    expect(autoLinkInternal("## La Factur-X")).toBe("## La Factur-X");
    expect(autoLinkInternal("```\nFactur-X\n```")).toBe("```\nFactur-X\n```");
    expect(autoLinkInternal("Voir `Factur-X` inline")).toBe("Voir `Factur-X` inline");
  });
  it("ne double-lie pas une ligne contenant déjà un lien", () => {
    const line = "[Factur-X](/x) et plateforme agréée partout";
    expect(autoLinkInternal(line)).toBe(line);
  });
  it("mappe les termes wedge vers les bons piliers", () => {
    expect(autoLinkInternal("la facture électronique arrive")).toContain("](/e-facture)");
    expect(autoLinkInternal("un auto-entrepreneur concerné")).toContain("](/auto-entrepreneurs)");
    expect(autoLinkInternal("via une plateforme agréée")).toContain("](/guide/plateforme-agreee)");
  });
  it("plafonne le nombre de liens à 5", () => {
    const md = "plateforme agréée, e-reporting, Factur-X, auto-entrepreneur, facture électronique, Chorus Pro";
    expect((autoLinkInternal(md).match(/\]\(\//g) || []).length).toBeLessThanOrEqual(5);
  });
});
