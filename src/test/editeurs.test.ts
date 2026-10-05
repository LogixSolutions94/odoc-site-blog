import { describe, it, expect } from "vitest";
import { EDITEURS } from "../content/editeurs";

/**
 * Garde-fou : la page /editeurs ne doit JAMAIS réafficher de prix (décision Riad du
 * 04/10/2026 : chiffrage sur devis). Ce test casse le build si un montant revient.
 */
describe("EDITEURS — page /editeurs sans prix", () => {
  const allText = JSON.stringify(EDITEURS);

  it("n'affiche aucun prix (ni €, ni les anciens montants)", () => {
    expect(allText).not.toMatch(/\d\s*€/);
    expect(allText).not.toMatch(/\d\s*euros?/i);
    expect(allText).not.toContain("490");
    expect(allText).not.toContain("1 500");
    expect(allText).not.toContain("1 500");
  });

  it("propose au moins 10 modules/offres", () => {
    expect(EDITEURS.offers.items.length).toBeGreaterThanOrEqual(10);
  });

  it("chaque offre a un tag, un nom et une description, sans prix", () => {
    for (const o of EDITEURS.offers.items) {
      expect(o.tag.trim()).toBeTruthy();
      expect(o.name.trim()).toBeTruthy();
      expect(o.desc.trim().length).toBeGreaterThan(20);
      expect(o.desc).not.toMatch(/€/);
    }
  });

  it("ne se présente pas comme plateforme agréée (garde-fou claims)", () => {
    expect(EDITEURS.notThis.body.toLowerCase()).toContain("ne sommes pas une plateforme agréée");
  });

  it("les champs SEO ne contiennent plus de prix", () => {
    // Les années (2026/2027) sont légitimes ; on vise les montants et le symbole €.
    expect(EDITEURS.seoDesc).not.toContain("€");
    expect(EDITEURS.seoDesc).not.toContain("490");
    expect(EDITEURS.seoTitle).not.toContain("€");
  });
});
