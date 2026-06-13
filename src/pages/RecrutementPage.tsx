import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { Rocket, Brain, Flag, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Rocket,
    emoji: "🚀",
    title: "Mouvement rapide",
    description: "On ship, on teste, on apprend. L'itération rapide est dans notre ADN.",
  },
  {
    icon: Brain,
    emoji: "🧠",
    title: "IA-first",
    description: "On intègre l'IA dans tout ce qu'on construit. Chaque feature est pensée copilot.",
  },
  {
    icon: Flag,
    emoji: "🇫🇷",
    title: "Made in France",
    description: "Fiers de construire un produit souverain pour les entreprises françaises.",
  },
];

export default function RecrutementPage() {
  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Recrutement OdocPilot — Rejoignez l'équipe qui réinvente l'OS d'entreprise"
        description="Rejoignez l'équipe OdocPilot et construisez le futur OS d'entreprise IA pour les TPE et PME françaises. Postes ouverts en ingénierie, design et growth."
        canonical="/recrutement"
      />

      <section className="w-full py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              On construit OdocPilot.{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Rejoins-nous.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
              Nous sommes une startup française ambitieuse qui construit le futur OS
              des entreprises. Petit budget, grande vision, impact réel.
            </p>
          </MotionDiv>

          {/* Valeurs */}
          <div className="grid gap-6 sm:grid-cols-3 mb-16">
            {values.map((v, i) => (
              <MotionDiv
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-card border border-border shadow-card text-center"
              >
                <span className="text-3xl mb-4 block">{v.emoji}</span>
                <h3 className="text-lg font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </MotionDiv>
            ))}
          </div>

          {/* Pas de poste ouvert */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-xl bg-secondary border border-border text-center"
          >
            <h3 className="text-xl font-bold text-foreground">Pas de poste ouvert actuellement</h3>
            <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Nous n'avons pas de poste ouvert en ce moment, mais on adore rencontrer
              des personnes talentueuses et motivées.
            </p>
            <div className="mt-6">
              <Link to="/contact">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Candidature spontanée <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </MotionDiv>
        </div>
      </section>
    </div>
  );
}
