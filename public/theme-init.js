// Initialisation du thème (clair/sombre), exécutée de façon synchrone avant React
// pour éviter le flash. Défaut CLAIR. Fichier externe (pas inline) : la CSP de
// nginx.conf n'autorise que script-src 'self', sans 'unsafe-inline' ni hash.
(function () {
  var theme = 'light';
  try { theme = localStorage.getItem('theme') || 'light'; } catch (e) {}
  if (theme !== 'dark') theme = 'light';
  document.documentElement.setAttribute('data-theme', theme);
})();
