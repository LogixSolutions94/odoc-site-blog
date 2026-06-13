import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { Target, Shield, Rocket, Building2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";

function AnimatedCounter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1400;
    const step = Math.max(1, Math.floor(end / (duration / 16)));
    const interval = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [isInView, end]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <motion.span
        className="text-4xl sm:text-5xl font-bold text-primary"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        {count}{suffix}
      </motion.span>
      <span className="text-sm text-muted-foreground text-center font-medium">{label}</span>
    </div>
  );
}

const values = [
  { icon: <Target className="h-7 w-7 text-primary" />, title: "Simplicité", description: "Un outil que vos équipes adoptent en moins d'une journée." },
  { icon: <Shield className="h-7 w-7 text-primary" />, title: "Sécurité", description: "Vos données hébergées en Europe, chiffrées, jamais revendues." },
  { icon: <Rocket className="h-7 w-7 text-primary" />, title: "Innovation", description: "Chaque semaine, de nouvelles fonctionnalités IA pour aller plus loin." },
];

const kpis = [
  { end: 10, suffix: "+", label: "outils intégrés" },
  { end: 1000, suffix: "", label: "entreprises visées en 2026" },
  { end: 8, suffix: "h", label: "/ semaine économisées en moyenne" },
  { end: 99, suffix: ".9%", label: "uptime garanti" },
];

export default function AProposPage() {
  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="À propos — OdocPilot | L'OS d'entreprise next-gen"
        description="OdocPilot est né pour libérer les TPE/PME des tâches répétitives. Découvrez notre vision, notre mission et l'équipe qui construit le futur OS des entreprises françaises."
        canonical="/a-propos"
      />

      {/* Hero */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-14 text-center">
        <MotionDiv>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">L'IA au service de votre entreprise</h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            OdocPilot est né d'un constat simple : les PME perdent en moyenne 8h/semaine à gérer des tâches répétitives. Nous avons créé le copilot IA qui change la donne.
          </p>
        </MotionDiv>
      </section>

      {/* Vision & Mission */}
      <section className="w-full py-20 sm:py-28 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <MotionDiv>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Notre vision</h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Rendre accessible à chaque entreprise un copilot IA qui était jusqu'ici réservé aux grandes corporations. Nous croyons que chaque PME mérite des outils intelligents pour se concentrer sur ce qui crée vraiment de la valeur.
              </p>
              <h3 className="mt-8 text-xl font-bold text-foreground">Notre mission</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Automatiser les tâches répétitives pour que les équipes se concentrent sur ce qui crée vraiment de la valeur. Fondée en 2025 en Île-de-France, OdocPilot a été pensée par des entrepreneurs pour des entrepreneurs.
              </p>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="relative w-full max-w-sm aspect-square rounded-2xl bg-secondary border border-border flex items-center justify-center shadow-card">
                <Building2 className="h-24 w-24 text-primary/30" />
                <div className="absolute -bottom-3 -right-3 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg">
                  Depuis 2025
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="w-full py-20 sm:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Nos valeurs</h2>
          </MotionDiv>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {values.map((v, i) => (
              <MotionDiv
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-8 bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 text-center border border-border"
              >
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 mx-auto mb-5">{v.icon}</div>
                <h3 className="text-xl font-bold text-foreground">{v.title}</h3>
                <p className="mt-3 text-muted-foreground">{v.description}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="w-full py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
            {kpis.map((kpi) => (
              <AnimatedCounter key={kpi.label} {...kpi} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="w-full py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-card rounded-2xl p-10 sm:p-14 shadow-elevated border border-border">
            <MotionDiv>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Votre copilot d'entreprise vous attend.</h2>
              <p className="mt-4 text-lg text-muted-foreground">Démarrez gratuitement et découvrez comment OdocPilot peut transformer votre quotidien.</p>
              <div className="mt-8">
                <a href={`${APP_URL}/auth`} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Démarrer gratuitement</Button>
                </a>
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>
    </div>
  );
}
