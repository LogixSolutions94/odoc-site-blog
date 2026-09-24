/**
 * Typographie française : on écrit le texte avec des espaces ordinaires,
 * `fr()` pose les bonnes espaces insécables.
 *   · espace fine insécable avant ? ! ; : et %, et entre les milliers (1 248)
 *   · espace insécable à l'intérieur des guillemets « » et avant €
 */
const NNBSP = " ";
const NBSP = " ";

export function fr(text: string): string {
  return text
    .replace(/ :/g, `${NBSP}:`)
    .replace(/ ([?!;%])/g, `${NNBSP}$1`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/ »/g, `${NBSP}»`)
    .replace(/(\d) (?=\d{3}(\D|$))/g, `$1${NNBSP}`)
    .replace(/ €/g, `${NBSP}€`);
}
