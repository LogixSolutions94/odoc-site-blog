@AGENTS.md

<!-- Règles communes : AGENTS.md (source unique, lu aussi par Codex). Ne rien dupliquer ici. -->

## Spécifique à Claude Code

- Les références `@fichier.md` (ci-dessus `@AGENTS.md`, et `@SEOBlog.md` à l'intérieur d'`AGENTS.md`) sont un mécanisme **propre à Claude Code** : leur contenu est chargé automatiquement dans le contexte dès l'ouverture de session. Un autre agent (Codex, etc.) lira `AGENTS.md` comme du texte normal et ne suivra pas ces références tout seul — le lui rappeler explicitement au besoin (ex. « lis aussi SEOBlog.md avant de rédiger l'article »).
- Convention de commit **spécifique à Claude Code** (ne pas réutiliser pour un commit fait par un autre agent — cf. template générique dans `docs/agents/taches-courantes.md`) :
  ```
  Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
  ```
- Pas d'autre spécificité connue à ce jour. Toute règle de fond (architecture, identité légale, conventions, blog, tâches) vient uniquement d'`AGENTS.md` et de `docs/agents/` — ne rien dupliquer ici.
