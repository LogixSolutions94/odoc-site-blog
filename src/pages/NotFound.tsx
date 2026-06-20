import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";

const NotFound = () => {
  return (
    <div className="flex min-h-[70svh] items-center justify-center px-4">
      <SEOHead
        title="Page introuvable — OdocPilot"
        description="La page que vous recherchez n'existe pas ou a été déplacée."
      />
      <div className="text-center max-w-lg">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[8rem] sm:text-[10rem] font-bold leading-none bg-gradient-to-br from-primary to-primary-glow bg-clip-text text-transparent select-none">
            404
          </span>
        </MotionDiv>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-foreground">Cette page a pris congé.</h1>
          <p className="mt-3 text-muted-foreground">
            Elle est peut-être en train de traiter des factures avec OdocPilot.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Retour à l'accueil</Button>
            </Link>
            <Link to="/fonctionnalites">
              <Button size="lg" variant="outline">Voir nos fonctionnalités</Button>
            </Link>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};

export default NotFound;
