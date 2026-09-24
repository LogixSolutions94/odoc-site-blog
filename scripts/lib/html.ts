/**
 * html.ts — Échappement pour le prérendu (même discipline que scripts/prerender-blog.ts).
 * Tout texte injecté dans le HTML brut passe par esc() (contenu) ou attr() (attribut).
 */
export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function attr(s: string): string {
  return esc(s).replace(/\n/g, " ");
}

/**
 * Allowlist d'URL (identique à safeUrl de prerender-blog.ts) : relatif « / » (pas « // »),
 * ancre, « ./ » « ../ », http(s), mailto, tel. Tout le reste (javascript:, data:…) → « # ».
 */
export function safeHref(u: string): string {
  const t = u.trim();
  if (/^\/(?!\/)/.test(t) || t.startsWith("#") || /^\.\.?\//.test(t)) return t;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(t)) return t;
  return "#";
}

/**
 * Bloc JSON-LD. « < » et « > » échappés (JSON toujours valide) : un « </script> » présent
 * dans une donnée ne peut pas sortir du <script>. Sérialisation identique à SEOHead, et
 * data-rh="true" : react-helmet-async reconnaît le bloc au montage (pas de doublon).
 */
export function jsonLdScript(data: unknown): string {
  const json = JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
  return `<script type="application/ld+json" data-rh="true">${json}</script>`;
}
