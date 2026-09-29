import { Fragment, useEffect, useState } from "react";

/** Mots clés du site repérés automatiquement dans un titre venu des données (`auto`). */
const SITE_KEYWORDS = [
  "Factur-X",
  "plateforme agréée",
  "auto-entrepreneurs",
  "e-reporting",
  "facturation électronique",
  "facture électronique",
];

/**
 * Surligneur orange sous un mot clé d'un titre (classes .marker .marker-title de index.css) :
 * le trait se pose de gauche à droite peu après l'affichage, un trait par mot pour que le
 * titre puisse passer à la ligne sur mobile.
 *
 * - <KeyMark>en règle</KeyMark> : tout le texte est surligné ;
 * - <KeyMark mark="lequel choisir">{c.h1}</KeyMark> : seul ce passage l'est ;
 * - <KeyMark auto>{guide.h1}</KeyMark> : le premier mot clé du site trouvé (SITE_KEYWORDS).
 *
 * Les enfants restent du texte : le prérendu (scripts/lib/page-source.ts) lit le <h1> sans
 * exécuter ce composant.
 */
export function KeyMark({ children, mark, auto = false, delay = 350 }: { children: string; mark?: string; auto?: boolean; delay?: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), delay);
    return () => window.clearTimeout(t);
  }, [delay]);

  const text = children;
  const lower = text.toLowerCase();
  const target = auto ? SITE_KEYWORDS.find((k) => lower.includes(k.toLowerCase())) : mark;
  if (auto && !target) return <>{text}</>;
  const start = target ? lower.indexOf(target.toLowerCase()) : 0;
  if (start < 0) return <>{text}</>;
  let end = target ? start + target.length : text.length;
  // Texte entier surligné : la ponctuation finale reste hors du trait.
  if (!target) while (end > 0 && /[\s.,;:!?…\u00A0\u202F]/.test(text[end - 1])) end--;

  const words = text.slice(start, end).split(" ");
  return (
    <>
      {text.slice(0, start)}
      {words.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="marker marker-title" data-on={on}>{w}</span>
        </Fragment>
      ))}
      {text.slice(end)}
    </>
  );
}
