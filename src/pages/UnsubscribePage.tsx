import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

/**
 * Page de désinscription newsletter (RGPD — droit à l'oubli).
 * Audit sécu 2026-06-16, finding M5/M7.
 *
 * Flux : /unsubscribe?email=<x>&token=<hmac>
 *   → POST EF unsubscribe-newsletter qui valide le HMAC et DELETE.
 */
export default function UnsubscribePage() {
  const [params] = useSearchParams();
  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!email || !token) {
      setStatus("error");
      setErrorMsg("Lien de désinscription invalide.");
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.functions.invoke<{ success: boolean; error?: string }>(
        "unsubscribe-newsletter",
        { body: { email, token } },
      );
      if (cancelled) return;
      if (error || data?.success === false) {
        setStatus("error");
        setErrorMsg(data?.error ?? "La désinscription n'a pas pu être confirmée.");
        return;
      }
      setStatus("ok");
    })();
    return () => { cancelled = true; };
  }, [email, token]);

  return (
    <div className="mx-auto max-w-xl py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Désinscription newsletter — OdocPilot"
        description="Désinscription de la newsletter OdocPilot."
        canonical="/unsubscribe"
        noindex
      />
      <div className="text-center">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">Désinscription en cours…</h1>
          </>
        )}
        {status === "ok" && (
          <>
            <CheckCircle className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">C'est fait.</h1>
            <p className="mt-3 text-muted-foreground">
              Vous ne recevrez plus aucun email de notre newsletter.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Pour exercer vos autres droits RGPD (accès, rectification, portabilité), contactez{" "}
              <a href="mailto:privacy@odocpilot.com" className="text-primary underline">privacy@odocpilot.com</a>.
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">Lien invalide</h1>
            <p className="mt-3 text-muted-foreground">{errorMsg}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Si vous n'arrivez pas à vous désinscrire, envoyez un email à{" "}
              <a href="mailto:privacy@odocpilot.com" className="text-primary underline">privacy@odocpilot.com</a>.
            </p>
          </>
        )}
        <div className="mt-10">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
