import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MotionDiv } from "@/components/MotionDiv";
import { BlogSEOHead } from "@/components/blog/BlogSEOHead";
import { BlogCard } from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BLOG_CATEGORY_FILTERS } from "@/lib/blogTaxonomy";
import { BASE_URL, PUBLISHER_NAME, PUBLISHER_LOGO } from "@/lib/blogContent";
import { Search, Sparkles, ClipboardCheck, FileCheck2, BookOpen, ArrowRight } from "lucide-react";

const PAGE_SIZE = 12;

const LIST_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      "@id": `${BASE_URL}/blog`,
      name: "Blog OdocPilot",
      description:
        "Guides clairs sur la facturation électronique 2026/2027, la Factur-X et les plateformes agréées pour les dirigeants de TPE.",
      url: `${BASE_URL}/blog`,
      inLanguage: "fr-FR",
      publisher: { "@id": `${BASE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: PUBLISHER_NAME,
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: PUBLISHER_LOGO },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      ],
    },
  ],
};

const TOOLS = [
  {
    to: "/diagnostic",
    icon: ClipboardCheck,
    title: "Diagnostic de conformité",
    desc: "3 minutes pour savoir ce que la réforme 2026/2027 change concrètement pour vous.",
    umami: "blog-tool-diagnostic",
  },
  {
    to: "/generateur-factur-x",
    icon: FileCheck2,
    title: "Générateur Factur-X",
    desc: "Créez une facture au format Factur-X conforme (EN 16931), gratuitement et sans compte.",
    umami: "blog-tool-generateur",
  },
  {
    to: "/guide/facturation-electronique-2026",
    icon: BookOpen,
    title: "Le guide e-facture 2026",
    desc: "La page de référence : calendrier, formats, plateformes agréées, sanctions.",
    umami: "blog-tool-guide",
  },
];

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [page, setPage] = useState(1);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) {
        console.error("[Blog] Error fetching posts:", error.message);
        throw error;
      }
      return data;
    },
  });

  const isDefaultView = activeCategory === "all" && !search.trim();

  // En vue par défaut, un seul article vedette ouvre la page comme une « une » éditoriale.
  const featuredPost = isDefaultView ? posts.find((p) => p.featured) ?? null : null;

  const filtered = useMemo(() => {
    let list = posts;
    if (activeCategory !== "all") list = list.filter((p) => p.category === activeCategory);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || (p.excerpt ?? "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [posts, activeCategory, search]);

  const gridSource = featuredPost ? filtered.filter((p) => p.slug !== featuredPost.slug) : filtered;
  const paginated = gridSource.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < gridSource.length;

  const resetFilters = () => {
    setActiveCategory("all");
    setSearch("");
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <BlogSEOHead jsonLd={LIST_JSON_LD} />

      {/* Hero */}
      <MotionDiv className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Le blog OdocPilot</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Comprendre la facturation électronique, sans jargon
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Des guides clairs et à jour sur la réforme 2026/2027, la Factur-X et les plateformes agréées —
          écrits pour les dirigeants de TPE qui veulent se mettre en règle l'esprit tranquille.
        </p>
        <div className="relative mx-auto mt-8 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un article…"
            aria-label="Rechercher un article"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-11 rounded-full pl-10"
          />
        </div>
      </MotionDiv>

      {/* Filtres par silo */}
      <div
        role="group"
        aria-label="Filtrer par thème"
        className="scrollbar-hide mt-10 flex gap-2 overflow-x-auto pb-2"
      >
        {BLOG_CATEGORY_FILTERS.map((cat) => {
          const active = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setActiveCategory(cat.value);
                setPage(1);
              }}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-xl bg-card" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Article vedette */}
          {featuredPost && (
            <MotionDiv className="mt-12">
              <BlogCard post={featuredPost} variant="featured" />
            </MotionDiv>
          )}

          {/* Grille */}
          {paginated.length > 0 ? (
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              {paginated.map((post, i) => (
                <MotionDiv
                  key={post.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 6) * 0.05, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                >
                  <BlogCard post={post} />
                </MotionDiv>
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center">
              <p className="text-muted-foreground">Aucun article ne correspond à votre recherche.</p>
              <Button variant="ghost" className="mt-4" onClick={resetFilters}>
                Voir tous les articles
              </Button>
            </div>
          )}

          {hasMore && (
            <div className="mt-12 text-center">
              <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>
                Charger plus d'articles
              </Button>
            </div>
          )}
        </>
      )}

      {/* Outils & guides gratuits (maillage produit, sans gating) */}
      <ToolsModule />
    </div>
  );
}

function ToolsModule() {
  return (
    <MotionDiv className="mt-20 rounded-2xl border border-border bg-secondary/50 p-8 sm:p-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Outils &amp; guides gratuits</h2>
        <p className="mt-2 text-muted-foreground">
          Pour passer de la théorie à l'action — sans compte, sans carte bancaire.
        </p>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {TOOLS.map(({ to, icon: Icon, title, desc, umami }) => (
          <Link
            key={to}
            to={to}
            data-umami-event={umami}
            className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-bold tracking-tight text-foreground">{title}</h3>
            <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Ouvrir <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </MotionDiv>
  );
}

function EmptyState() {
  return (
    <MotionDiv className="mx-auto mt-20 max-w-md text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Sparkles className="h-7 w-7" />
      </span>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
        Les premiers guides arrivent bientôt
      </h2>
      <p className="mt-2 text-muted-foreground">
        Nous préparons des guides clairs sur la réforme de la facturation électronique 2026/2027.
      </p>
      <Link to="/diagnostic" className="mt-6 inline-block" data-umami-event="blog-empty-diagnostic">
        <Button>En attendant, vérifiez votre conformité en 3 min</Button>
      </Link>
    </MotionDiv>
  );
}
