/**
 * page-source.ts — Lit, dans le SOURCE d'une page React (.tsx), ce qu'elle affiche en tête :
 * les props de <SEOHead> (title, description, canonical), le texte du premier <h1> et le
 * premier paragraphe d'introduction qui le suit.
 *
 * POURQUOI : le prérendu des pages marketing doit reprendre EXACTEMENT les textes des
 * composants. Une copie tenue à la main finit toujours par dériver (titres de juin encore
 * servis en septembre). On parse donc le TSX avec le compilateur TypeScript (déjà en
 * devDependencies, zéro dépendance nouvelle) et on évalue un sous-ensemble minimal
 * d'expressions : littéraux, gabarits `${…}`, constantes du module, accès `a.b` / `a[b]`
 * sur des données fournies par l'appelant (guide, c, m, wp…).
 *
 * FAIL-CLOSED : tout ce qui sort de ce sous-ensemble lève une erreur qui cite le fichier et
 * la ligne. Le build échoue plutôt que de publier un titre faux ou vide.
 */
import ts from "typescript";
import { readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/** Valeurs connues des variables locales du composant (ex. { guide: GUIDE_BY_SLUG[slug] }). */
export type Scope = Record<string, unknown>;

export type PageMeta = {
  title: string;
  description: string;
  canonical: string;
  h1: string;
  intro: string;
};

/** Composants qui posent le <head> ; valeur = fichier où lire leurs props par défaut. */
const SEO_COMPONENTS = new Map<string, string | null>([
  ["SEOHead", null],
  ["BlogSEOHead", "src/components/blog/BlogSEOHead.tsx"],
]);

/** En dessous, un <p> est un badge ou une date, pas une introduction. */
const MIN_INTRO_LENGTH = 40;

const UNRESOLVED = Symbol("non évaluable");

type JsxNode = ts.JsxElement | ts.JsxSelfClosingElement;

const ENTITIES: Record<string, string> = {
  nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
  laquo: "«", raquo: "»", hellip: "…", mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘",
};

/** Décode les entités HTML que JSX interprète dans le texte et les attributs chaîne. */
export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

/**
 * Règle d'espacement du texte JSX (identique à Babel) : on retire les blancs qui touchent
 * un saut de ligne et les lignes vides ; les lignes restantes sont jointes par une espace.
 */
function cleanJsxText(raw: string): string {
  const lines = decodeEntities(raw).split(/\r\n|\n|\r/);
  let lastNonEmpty = 0;
  lines.forEach((line, i) => { if (/[^ \t]/.test(line)) lastNonEmpty = i; });
  let out = "";
  lines.forEach((line, i) => {
    let t = line.replace(/\t/g, " ");
    if (i !== 0) t = t.replace(/^[ ]+/, "");
    if (i !== lines.length - 1) t = t.replace(/[ ]+$/, "");
    if (t) out += i === lastNonEmpty ? t : `${t} `;
  });
  return out;
}

/** Espaces ASCII consécutives → une seule (les espaces insécables sont conservées). */
function normalize(s: string): string {
  return s.replace(/[ \t\r\n]+/g, " ").replace(/^ +| +$/g, "");
}

function propValue(base: unknown, key: string): unknown {
  if (base === null || typeof base !== "object" || base === (UNRESOLVED as unknown)) return UNRESOLVED;
  return Object.prototype.hasOwnProperty.call(base, key) ? (base as Record<string, unknown>)[key] : UNRESOLVED;
}

function tagName(el: JsxNode): string {
  return (ts.isJsxElement(el) ? el.openingElement.tagName : el.tagName).getText();
}

export class PageSource {
  readonly sf: ts.SourceFile;
  private readonly consts = new Map<string, ts.Expression>();

  constructor(readonly file: string) {
    const code = readFileSync(resolve(ROOT, file), "utf-8");
    this.sf = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    for (const st of this.sf.statements) {
      if (!ts.isVariableStatement(st) || !(st.declarationList.flags & ts.NodeFlags.Const)) continue;
      for (const d of st.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.initializer) this.consts.set(d.name.text, d.initializer);
      }
    }
  }

  private where(node: ts.Node): string {
    const { line } = this.sf.getLineAndCharacterOfPosition(node.getStart());
    return `${relative(ROOT, resolve(ROOT, this.file)).replace(/\\/g, "/")}:${line + 1}`;
  }

  private text(value: unknown, node: ts.Node): string {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    throw new Error(`${this.where(node)} : « ${node.getText()} » n'est pas évaluable au build (texte attendu)`);
  }

  /** Valeur d'une constante de niveau module (ex. METIERS, SEO_TITLE). */
  constValue(name: string): unknown {
    const init = this.consts.get(name);
    if (!init) throw new Error(`${this.file} : constante de module « ${name} » introuvable`);
    return this.evaluate(init, {});
  }

  /** Évaluation statique d'un sous-ensemble d'expressions ; UNRESOLVED sinon. */
  evaluate(node: ts.Expression, scope: Scope, depth = 0): unknown {
    if (depth > 40) return UNRESOLVED;
    const next = (e: ts.Expression) => this.evaluate(e, scope, depth + 1);

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (node.kind === ts.SyntaxKind.NullKeyword) return null;
    if (
      ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node) ||
      ts.isNonNullExpression(node) || ts.isTypeAssertionExpression(node)
    ) {
      return next(node.expression);
    }
    if (ts.isTemplateExpression(node)) {
      let out = node.head.text;
      for (const span of node.templateSpans) {
        const v = next(span.expression);
        if (typeof v !== "string" && typeof v !== "number") return UNRESOLVED;
        out += String(v) + span.literal.text;
      }
      return out;
    }
    if (ts.isIdentifier(node)) {
      if (Object.prototype.hasOwnProperty.call(scope, node.text)) return scope[node.text];
      const init = this.consts.get(node.text);
      // Une constante de module ne voit pas les variables locales du composant.
      return init ? this.evaluate(init, {}, depth + 1) : UNRESOLVED;
    }
    if (ts.isPropertyAccessExpression(node)) return propValue(next(node.expression), node.name.text);
    if (ts.isElementAccessExpression(node)) {
      const key = next(node.argumentExpression);
      return typeof key === "string" || typeof key === "number" ? propValue(next(node.expression), String(key)) : UNRESOLVED;
    }
    if (ts.isObjectLiteralExpression(node)) {
      const obj: Record<string, unknown> = {};
      for (const p of node.properties) {
        if (ts.isPropertyAssignment(p) && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name))) {
          obj[p.name.text] = next(p.initializer);
        } else if (ts.isShorthandPropertyAssignment(p)) {
          obj[p.name.text] = next(p.name);
        }
      }
      return obj;
    }
    if (ts.isArrayLiteralExpression(node)) return node.elements.map((e) => next(e));
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      const l = next(node.left);
      const r = next(node.right);
      const ok = (v: unknown) => typeof v === "string" || typeof v === "number";
      return ok(l) && ok(r) ? String(l) + String(r) : UNRESOLVED;
    }
    return UNRESOLVED;
  }

  /** Texte affiché par un nœud JSX (enfants compris), comme React le rendrait. */
  jsxText(node: ts.JsxChild, scope: Scope): string {
    if (ts.isJsxText(node)) return cleanJsxText(node.text);
    if (ts.isJsxExpression(node)) {
      return node.expression ? this.text(this.evaluate(node.expression, scope), node.expression) : "";
    }
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      return node.children.map((c) => this.jsxText(c, scope)).join("");
    }
    if (ts.isJsxSelfClosingElement(node)) return tagName(node) === "br" ? " " : "";
    return "";
  }

  /** Tous les éléments JSX du fichier, dans l'ordre du source. */
  private elements(): JsxNode[] {
    const out: JsxNode[] = [];
    const visit = (n: ts.Node) => {
      if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) out.push(n);
      ts.forEachChild(n, visit);
    };
    visit(this.sf);
    return out;
  }

  private attribute(el: JsxNode, name: string, scope: Scope): string | undefined {
    const attrs = (ts.isJsxElement(el) ? el.openingElement : el).attributes.properties;
    for (const a of attrs) {
      if (!ts.isJsxAttribute(a) || a.name.getText() !== name) continue;
      const init = a.initializer;
      // Chaîne d'attribut JSX : pas d'échappements JS, mais les entités HTML sont décodées.
      if (init && ts.isStringLiteral(init)) return decodeEntities(init.text);
      if (init && ts.isJsxExpression(init) && init.expression) {
        return this.text(this.evaluate(init.expression, scope), init.expression);
      }
      throw new Error(`${this.where(a)} : valeur de « ${name} » non évaluable`);
    }
    return undefined;
  }

  /** Valeurs par défaut des props déstructurées de la fonction `name` (ex. BlogSEOHead). */
  propDefaults(name: string): Record<string, string> {
    const out: Record<string, string> = {};
    const visit = (n: ts.Node) => {
      if (ts.isFunctionDeclaration(n) && n.name?.text === name) {
        const param = n.parameters[0];
        if (param && ts.isObjectBindingPattern(param.name)) {
          for (const el of param.name.elements) {
            if (ts.isIdentifier(el.name) && el.initializer) {
              const v = this.evaluate(el.initializer, {});
              if (typeof v === "string") out[el.name.text] = v;
            }
          }
        }
      }
      ts.forEachChild(n, visit);
    };
    visit(this.sf);
    return out;
  }

  /**
   * Métadonnées de la page : props du premier <SEOHead>/<BlogSEOHead>, texte du premier
   * <h1> qui le SUIT (on ignore ainsi un <h1> « introuvable » de branche d'erreur placé
   * avant), puis premier <p> évaluable d'au moins MIN_INTRO_LENGTH caractères après ce <h1>.
   */
  readMeta(scope: Scope = {}): PageMeta {
    const all = this.elements();
    const seoIndex = all.findIndex((e) => SEO_COMPONENTS.has(tagName(e)));
    if (seoIndex < 0) throw new Error(`${this.file} : aucun <SEOHead> trouvé`);
    const seo = all[seoIndex];
    const defaultsFile = SEO_COMPONENTS.get(tagName(seo));
    const defaults = defaultsFile ? new PageSource(defaultsFile).propDefaults(tagName(seo)) : {};
    const prop = (name: string) => this.attribute(seo, name, scope) ?? defaults[name];

    const title = normalize(prop("title") ?? "");
    const description = normalize(prop("description") ?? "");
    const canonical = prop("canonical") ?? "";
    if (!title || !description || !canonical) {
      throw new Error(`${this.where(seo)} : title, description et canonical sont requis sur <${tagName(seo)}>`);
    }

    const h1Index = all.findIndex((e, i) => i > seoIndex && tagName(e) === "h1");
    if (h1Index < 0) throw new Error(`${this.file} : aucun <h1> après <${tagName(seo)}>`);
    const h1 = normalize(this.jsxText(all[h1Index], scope));
    if (!h1) throw new Error(`${this.where(all[h1Index])} : <h1> vide`);

    let intro = "";
    for (const el of all.slice(h1Index + 1)) {
      if (tagName(el) !== "p") continue;
      let text: string;
      try {
        text = normalize(this.jsxText(el, scope));
      } catch {
        continue; // paragraphe alimenté par une donnée d'exécution : on passe au suivant
      }
      if (text.length >= MIN_INTRO_LENGTH) {
        intro = text;
        break;
      }
    }
    if (!intro) throw new Error(`${this.file} : aucun paragraphe d'introduction après le <h1>`);

    return { title, description, canonical, h1, intro };
  }
}
