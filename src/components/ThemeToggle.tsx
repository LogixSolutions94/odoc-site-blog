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

  return (
    <button
      onClick={toggle}
      type="button"
      aria-label={`Passer en mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
      className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
      title={`Mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
    >
      {theme === 'dark' ? (
        <Sun size={18} className="stroke-current" />
      ) : (
        <Moon size={18} className="stroke-current" />
      )}
    </button>
  );
}
