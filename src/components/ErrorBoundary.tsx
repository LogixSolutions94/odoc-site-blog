import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Garde-fou défensif : empêche qu'une erreur de rendu (ou de hydratation) dans
 * une page ne laisse un écran blanc — la cause du « site noir » remontée par
 * l'audit. Affiche un repli sobre à la charte + un bouton de rechargement.
 *
 * Sans dépendance (ni provider, ni router requis) : peut envelopper l'app entière.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Aucun service d'erreurs branché ici : on trace en console (logs navigateur / VPS).
    console.error("[ErrorBoundary] erreur de rendu:", error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-cta text-2xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Une erreur est survenue</h1>
          <p className="max-w-md text-muted-foreground">
            Désolé, cette page n'a pas pu s'afficher correctement. Rechargez la page —
            si le problème persiste, revenez à l'accueil.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-lg bg-gradient-cta px-5 py-2.5 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Recharger la page
          </button>
          <a
            href="/"
            className="rounded-lg border border-border px-5 py-2.5 font-medium text-foreground transition hover:bg-muted"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }
}
