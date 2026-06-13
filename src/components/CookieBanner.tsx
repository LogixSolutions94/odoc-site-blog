import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { loadAnalytics } from "@/lib/analytics";

const STORAGE_KEY = "odoc_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleChoice(accepted: boolean) {
    localStorage.setItem(STORAGE_KEY, accepted ? "accepted" : "refused");
    setVisible(false);
    // RGPD : la mesure d'audience ne démarre QUE si l'utilisateur accepte (refus = aucun tracking).
    if (accepted) loadAnalytics();
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl"
        >
          <div className="rounded-xl border border-border bg-card p-5 shadow-elevated">
            <p className="text-sm text-foreground leading-relaxed">
              Nous utilisons une <strong>mesure d'audience anonyme</strong> (Umami, hébergée en France) pour améliorer le site.
              Aucune donnée n'est collectée sans votre accord. Voir notre{" "}
              <Link to="/politique-confidentialite" className="text-primary font-medium underline underline-offset-2 hover:text-primary-glow">
                politique de confidentialité
              </Link>.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Button
                size="sm"
                onClick={() => handleChoice(true)}
                className="w-full sm:w-auto bg-gradient-cta text-primary-foreground hover:opacity-95"
              >
                Accepter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleChoice(false)}
                className="w-full sm:w-auto"
              >
                Refuser
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
