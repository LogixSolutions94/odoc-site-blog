import { useLayoutEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Init : lire localStorage et appliquer immédiatement (useLayoutEffect = synchrone)
  useLayoutEffect(() => {
    const html = document.documentElement;

    // Chercher le thème : localStorage > data-theme > défaut CLAIR
    const stored = localStorage.getItem('theme') || html.getAttribute('data-theme');
    const initial = (stored as 'light' | 'dark') || 'light';

    setTheme(initial);
    html.setAttribute('data-theme', initial);
    localStorage.setItem('theme', initial);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);

    // Force reflow pour s'assurer que les changements CSS sont appliqués
    void document.documentElement.offsetHeight;
  };

  if (!mounted) return null;

  // Présentation « Papeterie » : un lien texte parmi les autres (pied de page),
  // l'icône ne fait que signaler l'action. Le libellé visible est contenu dans
  // l'aria-label (« Passer en mode sombre » contient « mode sombre »).
  return (
    <button
      onClick={toggle}
      type="button"
      aria-label={`Passer en mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
      className="inline-flex min-h-10 items-center gap-1.5 rounded-md text-muted-foreground transition-colors duration-200 hover:text-foreground"
      title={`Mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
    >
      {theme === 'dark' ? (
        <Sun size={16} strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Moon size={16} strokeWidth={1.75} aria-hidden="true" />
      )}
      <span>{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
    </button>
  );
}
