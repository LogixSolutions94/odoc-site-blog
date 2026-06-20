/**
 * prerender-marketing.ts — Pré-rend les pages MARKETING statiques en HTML brut APRÈS `vite build`.
 *
 * POURQUOI : le site est un SPA Vite (rendu client). Seul `index.html` a un vrai <title> /
 * <meta description>. Toutes les autres routes (/pricing, /e-facture, /comparatif/*, /guide/*…)
 * définissent leur SEO CÔTÉ CLIENT via react-helmet (<SEOHead>). Quand Googlebot récupère le
 * HTML BRUT d'une route, il voit donc le <title>/description de la HOMEPAGE → ~25 pages qui se
 * ressemblent toutes → Google fabrique des snippets aberrants et refuse les sitelinks.
 *
 * Ce script écrit, pour chaque route marketing, un `dist/<route>/index.html` dont le <head>
 * contient le BON <title>, la BONNE meta description, le canonical, et les OG/Twitter de la
 * page — en swappant directement le HTML (même technique que prerender-blog.ts). nginx sert
 * `dist/pricing/index.html` à `/pricing` via `try_files $uri $uri/ /index.html`. Le SPA monte
 * toujours côté client (createRoot remplace #root) : les humains voient le SPA, les robots
 * voient les bonnes balises. PARITÉ : on réutilise EXACTEMENT les strings passées à <SEOHead>.
 *
 * ZÉRO nouvelle dépendance (fs/path, sous tsx). 100% RÉSILIENT : si dist/index.html absent →
 * warn + exit 0 (ne casse JAMAIS le build) ; chaque route est dans un try/catch.
 */
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";
// Modules de contenu PARTAGÉS avec le client → garantit la PARITÉ avec ce que <SEOHead> rend.
import { COMPARISONS } from "../src/content/comparisons";
import { GUIDES } from "../src/content/guides";

const BASE_URL = "https://odocpilot.com";
const DIST = resolve("dist");
const SHELL = resolve(DIST, "index.html");

type RouteMeta = { path: string; title: string; description: string; canonical?: string };

// ── Même échappement que prerender-blog.ts (parité, sûreté) ─────────────────────
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function attr(s: string): string {
  return esc(s).replace(/\n/g, " ");
}

// ── Table route → métadonnées (strings EXACTES des <SEOHead> côté client) ────────
// Pages simples : title/description inline (= props passées à <SEOHead> dans le composant).
const STATIC_ROUTES: RouteMeta[] = [
  {
    path: "pricing",
    title:
      "Tarifs OdocPilot — un seul prix, tout compris | Palier gratuit, sans carte bancaire",
    description:
      "Des tarifs simples et transparents, sans coût par utilisateur. Palier Conformité gratuit, puis Essential 49€, Pro 89€, Manager 149€. Préparez votre conformité facture électronique 2026/2027. Palier Conformité gratuit, sans carte bancaire. Données et IA en France.",
  },
  {
    path: "fonctionnalites",
    title:
      "Fonctionnalités OdocPilot — Factur-X, lecture IA des factures, GED & export FEC",
    description:
      "Tout ce qu'OdocPilot prépare pour vous : factures au format Factur-X conforme, lecture IA des factures, recherche de documents en langage naturel, copilote Brain, export FEC. L'IA prépare, vous validez. Données et IA hébergées en France.",
  },
  {
    path: "e-facture",
    title:
      "Facturation électronique 2026/2027 : préparez votre conformité | OdocPilot",
    description:
      "Réception obligatoire au 1ᵉʳ septembre 2026, émission en 2027 : OdocPilot prépare votre conformité e-facture. Génération Factur-X, lecture IA des factures, export FEC. L'IA prépare, vous validez. Données et IA hébergées en France. Palier Conformité gratuit, sans carte bancaire.",
  },
  {
    path: "diagnostic",
    title: "Diagnostic conformité e-facture 2026 en 3 minutes | OdocPilot",
    description:
      "Êtes-vous prêt pour la facturation électronique obligatoire 2026/2027 ? Répondez à 3 questions et obtenez votre feuille de route datée, gratuitement. Données et IA en France.",
  },
  {
    path: "generateur-factur-x",
    title:
      "Générateur Factur-X gratuit (XML EN 16931) — sans inscription | OdocPilot",
    description:
      "Créez gratuitement le volet XML structuré (Factur-X CII, profil EN 16931) de votre facture + un PDF, et vérifiez vos mentions obligatoires. Sans inscription. Données et IA en France.",
  },
  {
    path: "verificateur",
    title:
      "Vérificateur de facture électronique (Factur-X / EN 16931) gratuit | OdocPilot",
    description:
      "Déposez une facture (PDF Factur-X ou XML) : on vérifie gratuitement le volet structuré, les mentions obligatoires et la cohérence des totaux selon la norme EN 16931. Sans inscription. Données traitées dans votre navigateur.",
  },
  {
    path: "llm-info",
    title:
      "OdocPilot — fiche d'information (IA, conformité, souveraineté) | odocpilot.com",
    description:
      "Fiche de référence OdocPilot : copilote IA français de facturation et de conformité. Factur-X EN 16931, lecture IA, export FEC. Données et IA hébergées en France (Mistral), conforme RGPD, aligné AI Act, démarche Numérique Responsable. L'IA prépare, vous validez.",
  },
  // Lexique — title suffixé « | OdocPilot » comme dans LexiquePage.tsx (SEOHead title={`${SEO_TITLE} | OdocPilot`}).
  {
    path: "lexique",
    title:
      "Lexique de la facturation électronique : tous les termes (PA, Factur-X, e-reporting…) | OdocPilot",
    description:
      "PA, PDP, PPF, Factur-X, EN 16931, CII, UBL, e-reporting… Le lexique clair de la facturation électronique 2026/2027 pour les dirigeants de TPE/PME, sans jargon.",
  },
  // Livre blanc — title suffixé « | OdocPilot », description = WHITE_PAPER.subtitle (LivreBlancPage.tsx).
  {
    path: "livre-blanc",
    title:
      "Facturation électronique 2026/2027 : le guide honnête pour les TPE/PME | OdocPilot",
    description:
      "Tout ce qu'un dirigeant doit comprendre pour être prêt — le calendrier, les formats, la plateforme agréée, les sanctions et un plan d'action concret. Sans jargon, sans survente, et en disant ce qui est encore mouvant.",
  },
  {
    path: "roadmap",
    title: "Roadmap OdocPilot — ce qui est disponible, en cours et à venir",
    description:
      "Notre feuille de route en toute transparence : génération Factur-X et lecture IA disponibles aujourd'hui ; raccordement à une plateforme agréée et rapprochement bancaire en cours avant les échéances 2026/2027.",
  },
  {
    path: "changelog",
    title: "Changelog OdocPilot — nouveautés et mises à jour",
    description:
      "Suivez l'évolution d'OdocPilot, mois par mois : génération Factur-X, lecture IA des factures, export FEC, copilote Brain, diagnostic de conformité. Données et IA hébergées en France.",
  },
  {
    path: "a-propos",
    title: "À propos — OdocPilot | Le copilote IA des dirigeants de TPE",
    description:
      "OdocPilot prépare la conformité à la facturation électronique 2026/2027 et l'administratif des dirigeants de TPE, PME et indépendants sans expert-comptable. L'IA prépare, vous validez. Données et IA hébergées en France.",
  },
  // /blog (index) — valeurs par défaut de BlogSEOHead.tsx (les articles sont gérés par prerender-blog.ts).
  {
    path: "blog",
    title:
      "Blog OdocPilot — Conformité, facturation électronique & gestion sereine",
    description:
      "Guides clairs et à jour sur la réforme 2026/2027, la Factur-X et les plateformes agréées — pour les dirigeants de TPE qui veulent se mettre en règle sans jargon.",
  },
  {
    path: "contact",
    title: "Contact — OdocPilot | Demandez une démo",
    description:
      "Contactez l'équipe OdocPilot pour une démonstration personnalisée de notre solution de facturation et de conformité.",
  },
  {
    path: "mentions-legales",
    title: "Mentions Légales — OdocPilot | Logix Solutions SASU",
    description:
      "Mentions légales d'OdocPilot : éditeur, hébergeur, propriété intellectuelle. Site édité par Logix Solutions SASU, 89-91 Av. de la République, 75011 Paris.",
  },
  {
    path: "cgu",
    title: "CGU — OdocPilot | Conditions Générales d'Utilisation",
    description: "Conditions générales d'utilisation de la plateforme OdocPilot.",
  },
  // /artisans — ArtisansPage.tsx (PAS MetierPage), SEOHead propre.
  {
    path: "artisans",
    title:
      "Logiciel de gestion pour artisans & BTP — devis, factures, relances | OdocPilot",
    description:
      "OdocPilot gère vos devis de chantier, vos factures, vos relances d'impayés et la facture électronique 2026 — pendant que vous êtes sur le terrain. Hébergé en France, palier Conformité gratuit, sans carte bancaire.",
  },
  // Métiers servis par MetierPage.tsx (data inline ci-dessous, = METIERS[slug].seoTitle/seoDesc).
  {
    path: "commerce",
    title: "Logiciel de gestion pour commerçants & TPE de services | OdocPilot",
    description:
      "OdocPilot réunit facturation, fichier clients et trésorerie pour les commerces et prestataires, avec un assistant IA qui gère l'administratif. Hébergé en France, palier Conformité gratuit, sans carte bancaire.",
  },
  {
    path: "professions-liberales",
    title: "Logiciel de gestion pour professions libérales | OdocPilot",
    description:
      "OdocPilot gère notes d'honoraires, factures, documents et rendez-vous pour les professions libérales, avec un assistant IA. Hébergé en France, conforme RGPD, palier Conformité gratuit, sans carte bancaire.",
  },
  {
    path: "cabinets-comptables",
    title: "OdocPilot pour les cabinets comptables — données clients propres",
    description:
      "OdocPilot aide vos clients TPE/PME à centraliser leurs pièces, et vous récupérez des données propres et à jour. Moins de relances, export FEC, conforme facture 2026. Hébergé en France.",
  },
];

// ── /guide/<slug> — GuidePillarPage.tsx : title={`${guide.seoTitle} | OdocPilot`}, desc=guide.seoDesc ──
const GUIDE_ROUTES: RouteMeta[] = GUIDES.map((g) => ({
  path: `guide/${g.slug}`,
  title: `${g.seoTitle} | OdocPilot`,
  description: g.seoDesc,
}));

// ── /comparatif/<slug> — ComparePage.tsx : title={`${c.seoTitle} | OdocPilot`}, desc=c.seoDesc ──
const COMPARE_ROUTES: RouteMeta[] = COMPARISONS.map((c) => ({
  path: `comparatif/${c.slug}`,
  title: `${c.seoTitle} | OdocPilot`,
  description: c.seoDesc,
}));

const ROUTES: RouteMeta[] = [...STATIC_ROUTES, ...GUIDE_ROUTES, ...COMPARE_ROUTES];

// ── Construit le HTML d'une route : swap <title>/description/canonical/OG/Twitter ─
function buildPage(shell: string, route: RouteMeta): string {
  const title = route.title;
  const desc = route.description;
  const canonical = `${BASE_URL}${route.canonical ?? `/${route.path}`}`;
  let html = shell;

  // <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  // <meta name="description">
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${attr(desc)}" />`,
  );
  // OpenGraph title/description (présents dans le shell)
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${attr(title)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${attr(desc)}" />`,
  );
  // Twitter title/description (présents dans le shell)
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${attr(title)}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${attr(desc)}" />`,
  );
  // Canonical : remplacer s'il existe, sinon en ajouter un avant </head>.
  if (/<link\s+rel="canonical"[^>]*>/i.test(html)) {
    html = html.replace(
      /<link\s+rel="canonical"[^>]*>/i,
      `<link rel="canonical" href="${attr(canonical)}" />`,
    );
  } else {
    html = html.replace(
      /<\/head>/i,
      `    <link rel="canonical" href="${attr(canonical)}" />\n  </head>`,
    );
  }
  return html;
}

function run() {
  if (!existsSync(SHELL)) {
    console.warn(
      "[prerender-marketing] dist/index.html absent — lancer `vite build` d'abord. Skip (build non cassé).",
    );
    return;
  }

  const shell = readFileSync(SHELL, "utf-8");
  let ok = 0;
  for (const route of ROUTES) {
    try {
      const page = buildPage(shell, route);
      const dir = resolve(DIST, ...route.path.split("/"));
      mkdirSync(dir, { recursive: true });
      writeFileSync(resolve(dir, "index.html"), page, "utf-8");
      ok++;
    } catch (e) {
      console.warn(
        `[prerender-marketing] skip /${route.path} :`,
        e instanceof Error ? e.message : e,
      );
    }
  }
  console.log(
    `[prerender-marketing] ✓ ${ok}/${ROUTES.length} marketing page(s) pre-rendered dans dist/<route>/index.html`,
  );
}

try {
  run();
} catch (e) {
  console.warn("[prerender-marketing] erreur non bloquante :", e);
}
