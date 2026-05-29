import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight,
  FileText,
  Receipt,
  Brain,
  BarChart3,
  Users,
  UserCog,
  KanbanSquare,
  MessageSquare,
  Link2,
  Cloud,
  CheckCircle,
  Shield,
  Lock,
  BadgeCheck,
  Zap,
  Building2,
  Briefcase,
  Scale,
  UserCheck,
  AlertTriangle,
  Clock,
  TrendingDown,
  Calendar,
  Sparkles,
  Timer,
  Globe,
  TrendingUp,
} from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";

const ORANGE = "hsl(30 100% 50%)";
const PETRIOL = "hsl(201 85% 22%)";

const tools = [
  {
    icon: FileText,
    emoji: "📄",
    title: "Gestion Documentaire",
    description:
      "Uploadez, classez et retrouvez n'importe quel document en secondes. L'IA extrait les données clés automatiquement.",
  },
  {
    icon: Receipt,
    emoji: "🧾",
    title: "Factures IA",
    description:
      "Extraction automatique, workflow de validation, empreinte SHA-256 + journal d'événements, détection automatique par règles métier.",
  },
  {
    icon: Brain,
    emoji: "🧠",
    title: "Odoc Brain (Copilot IA)",
    description:
      "Posez n'importe quelle question sur vos documents. Obtenez des réponses précises avec sources, en langage naturel.",
  },
  {
    icon: BarChart3,
    emoji: "📊",
    title: "Analytics Multi-Métiers",
    description:
      "Tableaux de bord Général, Comptable, Juridique et Administratif. Export PDF et CSV en un clic.",
  },
  {
    icon: Users,
    emoji: "👥",
    title: "Gestion d'Équipe",
    description:
      "Invitez vos collaborateurs, assignez des rôles (comptable, juriste, admin), gérez les accès par profil.",
  },
  {
    icon: UserCog,
    emoji: "🧑‍💼",
    title: "Module RH",
    description:
      "Gestion des employés, suivi des congés, approbations automatiques, export des données RH.",
  },
  {
    icon: KanbanSquare,
    emoji: "📋",
    title: "Projets Kanban",
    description:
      "Créez vos projets, assignez des tâches avec priorités, suivez l'avancement en vue Kanban ou liste.",
  },
  {
    icon: MessageSquare,
    emoji: "💬",
    title: "Messagerie Interne",
    description:
      "Canaux d'équipe, messages temps réel, @mentions, pièces jointes. Tout en un, sans quitter Odoc.",
  },
  {
    icon: Link2,
    emoji: "🔗",
    title: "Portail Fournisseur",
    description:
      "Envoyez un lien sécurisé à vos fournisseurs pour qu'ils déposent leurs factures directement dans Odoc.",
  },
  {
    icon: Cloud,
    emoji: "☁️",
    title: "Smart Connectors",
    description:
      "Connectez Google Drive et Dropbox pour synchroniser vos documents automatiquement dans Odoc.",
  },
  {
    icon: Calendar,
    emoji: "📅",
    title: "Calendrier Partagé",
    description:
      "Planifiez, synchronisez et partagez vos événements d'équipe. Rappels automatiques, vue agenda et intégration Google Calendar.",
  },
];

const audiences = [
  {
    icon: Building2,
    title: "TPE & PME",
    description:
      "De 1 à 50 employés, centralisez tout sans infrastructure complexe.",
    bullets: [
      "Documents centralisés",
      "Factures automatisées",
      "Gain de temps immédiat",
    ],
  },
  {
    icon: Briefcase,
    title: "Cabinets Comptables",
    description:
      "Gérez vos clients, leurs factures et votre conformité depuis un seul endroit.",
    bullets: ["Multi-clients", "Archivage SHA-256 horodaté", "Export FEC natif"],
  },
  {
    icon: Scale,
    title: "Services Juridiques",
    description:
      "Suivi des contrats, alertes de renouvellement, conformité légale intégrée.",
    bullets: ["Suivi contrats", "Alertes échéances", "Recherche IA"],
  },
  {
    icon: UserCheck,
    title: "Équipes RH & Admin",
    description:
      "Congés, projets, messagerie, documents — tout dans un seul outil.",
    bullets: ["Gestion congés", "Projets Kanban", "Messagerie intégrée"],
  },
];

const trustBadges = [
  { icon: "🇫🇷", label: "Données hébergées en France" },
  { icon: <Lock className="h-4 w-4" />, label: "TLS 1.3 + hébergement chiffré OVH France" },
  { icon: <BadgeCheck className="h-4 w-4" />, label: "Conforme RGPD" },
  { icon: <Shield className="h-4 w-4" />, label: "Empreinte SHA-256 + journal d'événements" },
  { icon: <Zap className="h-4 w-4" />, label: "Bêta active — SLA en cours de mise en place" },
];

const pricingTeaser = [
  {
    name: "Essential",
    price: "49€",
    label: "/mois",
    accounts: "👤 1 compte",
    highlight: false,
  },
  {
    name: "Pro",
    price: "89€",
    label: "/mois",
    accounts: "👥 3 comptes",
    highlight: true,
  },
  {
    name: "Manager",
    price: "149€",
    label: "/mois",
    accounts: "👥 5 comptes et plus",
    highlight: false,
  },
  {
    name: "Entreprise",
    price: "Sur mesure",
    label: "",
    accounts: "👥 Sur mesure",
    highlight: false,
  },
];

const bentoCards = [
  {
    icon: Brain,
    emoji: "🧠",
    title: "Copilot IA",
    description: "Réponses instantanées sur tous vos documents",
    accent: true,
  },
  {
    icon: Receipt,
    emoji: "🧾",
    title: "Factures automatisées",
    description: "Extraction & validation sans saisie manuelle",
    accent: false,
  },
  {
    icon: BarChart3,
    emoji: "📊",
    title: "Dashboards temps réel",
    description: "Pilotez votre activité d'un seul regard",
    accent: false,
  },
  {
    icon: Users,
    emoji: "👥",
    title: "Collaboration équipe",
    description: "Rôles, accès, messagerie & projets intégrés",
    accent: false,
  },
  {
    icon: Shield,
    emoji: "🔒",
    title: "Sécurité enterprise",
    description: "TLS 1.3, SHA-256, hébergé en France",
    accent: false,
  },
  {
    icon: Zap,
    emoji: "⚡",
    title: "Setup en 2 minutes",
    description: "Aucune carte bancaire — commencez maintenant",
    accent: false,
  },
];

const stats = [
  { value: 11, suffix: "", label: "Modules intégrés", icon: KanbanSquare },
  { value: 2, suffix: "h", label: "Gagnées / jour (estimé)", icon: Timer },
  { value: 100, suffix: "%", label: "Hébergé en France", icon: Globe },
  { value: 0, suffix: "€", label: "Pour démarrer", icon: Zap },
];

const ROTATING_MODULES = [
  { word: "factures", emoji: "🧾" },
  { word: "documents", emoji: "📄" },
  { word: "projets", emoji: "📋" },
  { word: "équipes", emoji: "👥" },
  { word: "finances", emoji: "📊" },
  { word: "contrats", emoji: "⚖️" },
  { word: "congés RH", emoji: "🗓️" },
  { word: "fournisseurs", emoji: "🔗" },
];

function useRotatingModule(interval = 2400) {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ROTATING_MODULES.length);
        setShow(true);
      }, 380);
    }, interval);
    return () => clearInterval(t);
  }, [interval]);

  return { module: ROTATING_MODULES[index], show };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Odoc",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Odoc centralise documents, factures, RH, projets et messagerie dans un OS IA intelligent. Comme un employé en plus — sans les charges.",
  offers: [
    {
      "@type": "Offer",
      name: "Essential",
      price: "49",
      priceCurrency: "EUR",
      billingIncrement: "P1M",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "89",
      priceCurrency: "EUR",
      billingIncrement: "P1M",
    },
    {
      "@type": "Offer",
      name: "Manager",
      price: "149",
      priceCurrency: "EUR",
      billingIncrement: "P1M",
    },
    {
      "@type": "Offer",
      name: "Entreprise",
      price: "0",
      priceCurrency: "EUR",
      description: "Sur mesure",
    },
  ],
};

function useCounterAnimation(
  target: number,
  duration: number = 1800,
  startTrigger: boolean = false
): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const animate = useCallback(
    (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    },
    [target, duration]
  );

  useEffect(() => {
    if (!startTrigger) return;
    startTimeRef.current = null;
    setCount(0);
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [startTrigger, animate]);

  return count;
}

interface StatCounterProps {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  delay?: number;
}

function StatCounter({ value, suffix, label, icon: Icon, delay = 0 }: StatCounterProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const count = useCounterAnimation(value, 1800 + delay * 200, hasStarted);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setTimeout(() => setHasStarted(true), delay * 120);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, hasStarted]);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-2 px-6 py-4">
      <div
        className="flex items-center justify-center h-10 w-10 rounded-xl mb-1"
        style={{
          background: `linear-gradient(135deg, ${ORANGE}22, ${PETRIOL}22)`,
          border: `1px solid ${ORANGE}33`,
        }}
      >
        <Icon className="h-5 w-5" style={{ color: ORANGE }} />
      </div>
      <p
        className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums"
        style={{
          background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {count}
        {suffix}
      </p>
      <p className="text-sm text-muted-foreground font-medium text-center">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const { toast } = useToast();
  const { module, show } = useRotatingModule();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: newsletterEmail.trim(), source: "landing" });

      if (error && error.code === "23505") {
        toast({
          title: "✓ Vous êtes déjà inscrit !",
          description: "Cette adresse est déjà dans notre liste.",
        });
      } else if (error) {
        throw error;
      } else {
        toast({
          title: "✓ Merci ! Vous êtes inscrit.",
          description: "Vous recevrez nos prochaines actualités.",
        });
      }
      setNewsletterEmail("");
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setNewsletterLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <SEOHead
        title="Odoc — OS d'entreprise IA | Copilot pour TPE/PME"
        description="Odoc centralise documents, factures, projets, RH et équipe dans un OS IA intelligent. Comme un employé en plus — sans les charges. Essai gratuit."
        canonical="/"
        jsonLd={jsonLd}
      />

      {/* HERO */}
      <section className="w-full relative overflow-hidden">
        {/* Fond dégradé flou */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-32 left-1/3 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
            style={{ background: ORANGE }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] opacity-15"
            style={{ background: PETRIOL }}
          />
        </div>

        {/* Contenu du hero */}
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 text-center z-10">
          <MotionDiv
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold mb-8"
              style={{
                border: `1px solid ${ORANGE}44`,
                background: `${ORANGE}12`,
                color: ORANGE,
              }}
            >
              <span className="animate-pulse">●</span>
              Nouveau — OS d'entreprise IA · Accès anticipé ouvert
            </span>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-[1.05] text-foreground">
              Automatisez vos{" "}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35em",
                  minWidth: "260px",
                  transition: "opacity 0.35s ease, transform 0.35s ease",
                  opacity: show ? 1 : 0,
                  transform: show ? "translateY(0px)" : "translateY(-12px)",
                }}
              >
                <span style={{ WebkitTextFillColor: "initial" }}>{module.emoji}</span>
                <span
                  style={{
                    background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {module.word}
                </span>
              </span>
              <br />
              avec l'IA.
            </h1>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Odoc remplace <strong>10 outils éparpillés</strong> par un seul OS IA.
              Documents, factures, RH, projets, équipe — <strong>tout en un</strong>,
              disponible <strong>24h/24 sans charges</strong>.
            </p>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground font-medium">
              {["🔐 Empreinte SHA-256 + journal d'événements", "🔒 Hébergé en France", "⚡ Setup 2 min", "🎯 11 modules", "🛡️ RGPD conforme"].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`${APP_URL}/auth`}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="cta-essai-gratuit"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base px-10 py-6 font-bold text-white transition-all duration-200 hover:scale-[1.03]"
                  style={{
                    background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                    boxShadow: `0 0 32px rgba(249,115,22,0.45)`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 48px rgba(249,115,22,0.65)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 32px rgba(249,115,22,0.45)";
                  }}
                >
                  Essayer gratuitement <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a
                href="/pricing"
                rel="noopener noreferrer"
                data-umami-event="cta-tarifs"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base px-8 py-6 border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-200"
                >
                  Voir les tarifs
                </Button>
              </a>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              <CheckCircle className="inline h-3 w-3 mr-1 text-green-500" />
              Gratuit pour commencer ·{" "}
              <CheckCircle className="inline h-3 w-3 mr-1 text-green-500" />
              Setup en 2 min ·{" "}
              <CheckCircle className="inline h-3 w-3 mr-1 text-green-500" />
              Annulation à tout moment
            </p>
          </MotionDiv>

          {/* Bento Grid */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {bentoCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <MotionDiv
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className="group relative rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02]"
                  style={
                    card.accent
                      ? {
                          background: `linear-gradient(135deg, ${ORANGE}18, ${PETRIOL}18)`,
                          border: `1.5px solid ${ORANGE}55`,
                          boxShadow: `0 4px 32px rgba(249,115,22,0.12)`,
                        }
                      : {
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                        }
                  }
                >
                  {card.accent && (
                    <span
                      className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                        color: "white",
                      }}
                    >
                      IA
                    </span>
                  )}
                  <div
                    className="flex items-center justify-center h-11 w-11 rounded-xl mb-4"
                    style={
                      card.accent
                        ? {
                            background: `linear-gradient(135deg, ${ORANGE}33, ${PETRIOL}33)`,
                          }
                        : {
                            background: "hsl(var(--primary)/0.08)",
                          }
                    }
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: card.accent ? ORANGE : undefined }}
                    />
                  </div>
                  <h3 className="text-sm font-bold text-foreground leading-snug">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section
        className="w-full py-10 border-y border-border"
        style={{
          background: `linear-gradient(90deg, ${ORANGE}08, ${PETRIOL}08)`,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {stats.map((stat, i) => (
              <StatCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                icon={stat.icon}
                delay={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="w-full py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotionDiv>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold mb-6"
              style={{
                border: "1px solid hsl(var(--destructive)/0.25)",
                background: "hsl(var(--destructive)/0.06)",
                color: "hsl(var(--destructive))",
              }}
            >
              ⚠ Le vrai problème des TPE/PME
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Vos outils sont partout.
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Votre temps, nulle part.
              </span>
            </h2>
            <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
              La majorité des petites entreprises jonglent entre 6 à 10 outils
              différents, perdent des heures à chercher des documents, oublient
              des échéances et n'ont aucune visibilité sur leur activité réelle.
            </p>
          </MotionDiv>

          <div className="mt-14 grid gap-6 grid-cols-1 sm:grid-cols-3">
            {[
              {
                icon: AlertTriangle,
                title: "Informations éparpillées",
                body: "Emails, Drive, WhatsApp, Excel… vos données critiques se perdent entre 5 outils différents.",
                color: "hsl(var(--destructive))",
                bg: "hsl(var(--destructive)/0.08)",
              },
              {
                icon: Clock,
                title: "Temps gaspillé",
                body: "2h par jour perdues à chercher des fichiers, relancer des fournisseurs, ressaisir des données à la main.",
                color: ORANGE,
                bg: `${ORANGE}15`,
              },
              {
                icon: TrendingDown,
                title: "Zéro visibilité",
                body: "Sans tableau de bord unifié, impossible de piloter votre activité et d'anticiper les problèmes avant qu'ils coûtent cher.",
                color: PETRIOL,
                bg: `${PETRIOL}18`,
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <MotionDiv
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 rounded-xl bg-card border border-border shadow-sm text-left hover:scale-[1.01] transition-transform duration-300"
                >
                  <div
                    className="flex items-center justify-center h-11 w-11 rounded-xl mb-4"
                    style={{ background: card.bg }}
                  >
                    <Icon className="h-5 w-5" style={{ color: card.color }} />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {card.body}
                  </p>
                </MotionDiv>
              );
            })}
          </div>

          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10"
          >
            <p
              className="text-base font-semibold"
              style={{ color: ORANGE }}
            >
              Odoc centralise tout. Un seul outil. Un seul copilot IA.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* MODULES */}
      <section
        className="w-full py-24 sm:py-32"
        style={{ background: `${PETRIOL}06` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <MotionDiv>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                L'OS de votre entreprise.
                <br />
                <span
                  style={{
                    background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Onze modules. Zéro compromis.
                </span>
              </h2>
              <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground">
                Odoc remplace une dizaine d'outils éparpillés par un seul OS IA
                qui centralise, automatise et pilote votre entreprise — comme un
                employé supplémentaire qui ne dort jamais.
              </p>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="mt-14 mx-auto w-48 h-48 sm:w-56 sm:h-56 relative"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${ORANGE}18, ${PETRIOL}12)`,
                  border: `1.5px solid ${ORANGE}30`,
                  boxShadow: `0 0 48px rgba(249,115,22,0.15)`,
                }}
              />
              <Brain
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12"
                style={{ color: ORANGE }}
              />
              {tools.slice(0, 8).map((t, i) => {
                const angle = (i * 360) / 8 - 90;
                const rad = (angle * Math.PI) / 180;
                const r = 85;
                return (
                  <div
                    key={i}
                    className="absolute h-9 w-9 rounded-full bg-card flex items-center justify-center text-sm"
                    style={{
                      top: `calc(50% + ${Math.sin(rad) * r}px - 18px)`,
                      left: `calc(50% + ${Math.cos(rad) * r}px - 18px)`,
                      border: `1px solid ${ORANGE}33`,
                      boxShadow: `0 2px 12px rgba(249,115,22,0.10)`,
                      animation: `float ${3 + i * 0.4}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  >
                    <span>{t.emoji}</span>
                  </div>
                );
              })}
            </MotionDiv>
          </div>

          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {tools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <MotionDiv
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="group p-5 rounded-xl border border-border bg-card hover:scale-[1.02] transition-all duration-300"
                  style={{
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border = `1.5px solid ${ORANGE}55`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px rgba(249,115,22,0.14)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border =
                      "1px solid hsl(var(--border))";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 1px 4px rgba(0,0,0,0.06)";
                  }}
                >
                  <div
                    className="flex items-center justify-center h-10 w-10 rounded-lg mb-3 transition-all duration-300"
                    style={{ background: `${ORANGE}14` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: ORANGE }} />
                  </div>
                  <h3 className="text-sm font-bold text-foreground leading-snug">
                    {tool.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* AUDIENCES */}
      <section className="w-full py-24 sm:py-32 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Un OS taillé pour{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                les entreprises modernes
              </span>
            </h2>
          </MotionDiv>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a, i) => {
              const Icon = a.icon;
              return (
                <MotionDiv
                  key={a.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 rounded-xl bg-card border border-border hover:scale-[1.01] transition-all duration-300"
                  style={{
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border = `1.5px solid ${PETRIOL}44`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px rgba(8,93,124,0.12)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border =
                      "1px solid hsl(var(--border))";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 1px 4px rgba(0,0,0,0.06)";
                  }}
                >
                  <div
                    className="flex items-center justify-center h-12 w-12 rounded-xl mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${ORANGE}18, ${PETRIOL}18)`,
                    }}
                  >
                    <Icon className="h-6 w-6" style={{ color: PETRIOL }} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {a.description}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {a.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <CheckCircle
                          className="h-3.5 w-3.5 flex-shrink-0"
                          style={{ color: ORANGE }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* BÊTA & TRUST */}
      <section className="w-full py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto rounded-2xl bg-card border border-border p-10 sm:p-14 text-center"
            style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.08)" }}
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold mb-6"
              style={{
                border: `1px solid ${ORANGE}44`,
                background: `${ORANGE}12`,
                color: ORANGE,
              }}
            >
              <span className="animate-pulse">●</span>
              Bêta privée ouverte
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Rejoignez les premiers utilisateurs
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              OdocPilot est en bêta active. Testez gratuitement et façonnez
              le produit avec nous — votre retour compte.
            </p>
            <div className="mt-8">
              <a
                href={`${APP_URL}/auth`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="px-8 font-bold text-white transition-all duration-200 hover:scale-[1.03]"
                  style={{
                    background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                    boxShadow: `0 0 24px rgba(249,115,22,0.35)`,
                  }}
                >
                  Demander l'accès gratuit →
                </Button>
              </a>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-8 rounded-xl border border-border"
            style={{ background: `${ORANGE}06` }}
          >
            {trustBadges.map((b, i) => (
              <span
                key={i}
                className="flex items-center gap-2 text-sm text-muted-foreground font-medium"
              >
                <span style={{ color: ORANGE }}>
                  {typeof b.icon === "string" ? b.icon : b.icon}
                </span>
                {b.label}
              </span>
            ))}
          </MotionDiv>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section
        id="demo"
        className="w-full py-24 sm:py-32"
        style={{ background: `${PETRIOL}06` }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotionDiv className="mb-14">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold mb-6"
              style={{
                border: `1px solid ${ORANGE}33`,
                background: `${ORANGE}10`,
                color: ORANGE,
              }}
            >
              <Sparkles className="h-3 w-3" /> Tarifs simples et transparents
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Un tarif pour chaque étape
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                de votre croissance
              </span>
            </h2>
          </MotionDiv>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {pricingTeaser.map((plan, i) => (
              <MotionDiv
                key={plan.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className={`relative p-6 rounded-xl bg-card transition-all duration-300 hover:scale-[1.02] ${
                  plan.highlight ? "scale-[1.03]" : ""
                }`}
                style={
                  plan.highlight
                    ? {
                        border: `2px solid ${ORANGE}`,
                        boxShadow: `0 0 32px rgba(249,115,22,0.25), 0 4px 24px rgba(0,0,0,0.08)`,
                      }
                    : {
                        border: "1px solid hsl(var(--border))",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      }
                }
              >
                {plan.highlight && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full text-white whitespace-nowrap"
                    style={{
                      background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                    }}
                  >
                    ⭐ Plus populaire
                  </span>
                )}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {plan.name}
                </p>
                <p
                  className="mt-3 text-3xl sm:text-4xl font-extrabold"
                  style={
                    plan.highlight
                      ? {
                          background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }
                      : { color: "hsl(var(--foreground))" }
                  }
                >
                  {plan.price}
                </p>
                {plan.label && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {plan.label}
                  </p>
                )}
                {plan.accounts && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {plan.accounts}
                  </p>
                )}
              </MotionDiv>
            ))}
          </div>

          <div className="mt-12">
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="text-base px-8">
                Voir tous les plans <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="w-full py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="rounded-2xl p-10 sm:p-16"
            style={{
              background: `linear-gradient(135deg, ${ORANGE}, ${PETRIOL})`,
              boxShadow: `0 8px 64px rgba(249,115,22,0.35)`,
            }}
          >
            <MotionDiv>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                Votre employé IA vous attend.
                <br />
                Il commence dès aujourd'hui.
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Setup en 2 minutes. Aucune carte bancaire. Annulation à tout
                moment.
              </p>
              <div className="mt-8">
                <a
                  href={`${APP_URL}/auth`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-umami-event="cta-essai-gratuit"
                >
                  <Button
                    size="lg"
                    className="px-10 py-6 text-base font-bold transition-all duration-200 hover:scale-[1.04]"
                    style={{
                      background: "white",
                      color: PETRIOL,
                      boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 8px 40px rgba(0,0,0,0.26)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 4px 24px rgba(0,0,0,0.18)";
                    }}
                  >
                    Créer mon compte gratuit{" "}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
              <p className="mt-4 text-xs text-white/60">
                <CheckCircle className="inline h-3 w-3 mr-1" />
                Gratuit pour toujours ·{" "}
                <CheckCircle className="inline h-3 w-3 mr-1" />
                Setup en 2 min ·{" "}
                <CheckCircle className="inline h-3 w-3 mr-1" />
                Annulation à tout moment
              </p>
            </MotionDiv>

            <div className="mt-10 pt-8 border-t border-white/15">
              <p className="text-sm font-medium text-white">
                Restez informé des nouveautés Odoc
              </p>
              <p className="text-xs text-white/60 mt-1">
                Conseils IA, nouvelles fonctionnalités, études de cas —
                directement dans votre boîte mail.
              </p>
              <form
                onSubmit={handleNewsletter}
                className="mt-4 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto"
              >
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15"
                />
                <Button
                  type="submit"
                  disabled={newsletterLoading}
                  className="sm:w-auto bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-colors"
                >
                  {newsletterLoading ? "…" : "Je m'abonne"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
