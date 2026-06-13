import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MotionDiv } from "@/components/MotionDiv";
import { BlogSEOHead } from "@/components/blog/BlogSEOHead";
import { BlogCard } from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Search, Rocket } from "lucide-react";

// Silos SEO alignés sur le wedge conformité (source de vérité : SEOBlog.md §2.2).
const CATEGORIES = [
  { value: "all", label: "Tous" },
  { value: "facturation-electronique", label: "Facturation électronique" },
  { value: "obligations-2026-2027", label: "Obligations 2026/2027" },
  { value: "plateforme-agreee", label: "Plateforme agréée" },
  { value: "factur-x", label: "Factur-X & formats" },
  { value: "tpe-sans-comptable", label: "TPE sans comptable" },
] as const;

const PAGE_SIZE = 12;

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

  const featuredPost = posts.find((p) => p.featured);

  const filtered = useMemo(() => {
    let result = posts.filter((p) => !p.featured || posts.filter((x) => x.featured).length === 0);
    // Actually show all posts in grid (featured is shown separately above)
    let list = posts;
    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
      );
    }
    return list;
  }, [posts, activeCategory, search]);

  const paginatedPosts = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginatedPosts.length < filtered.length;

  return (
    <div className="mx-auto max-w-6xl py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <BlogSEOHead />

      {/* Hero */}
      <MotionDiv className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Le blog OdocPilot</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Conformité, facturation électronique & gestion sereine
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Guides clairs et à jour sur la réforme 2026/2027, la Factur-X et les plateformes agréées — pour les dirigeants de TPE qui veulent comprendre et se mettre en règle sans jargon.
        </p>
        <div className="mt-8 max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un article…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>
      </MotionDiv>

      {/* Category filters */}
      <div className="mt-10 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setActiveCategory(cat.value);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-card rounded-xl animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        /* Empty state */
        <MotionDiv className="mt-24 text-center">
          <Rocket className="h-16 w-16 text-primary/50 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground">
            Les premiers guides arrivent bientôt
          </h2>
          <p className="mt-2 text-muted-foreground">
            Nous préparons des guides clairs sur la réforme de la facturation électronique 2026/2027.
          </p>
        </MotionDiv>
      ) : (
        <>
          {/* Featured post */}
          {featuredPost && !search && activeCategory === "all" && (
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10"
            >
              <BlogCard post={featuredPost} variant="featured" />
            </MotionDiv>
          )}

          {/* Grid */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post, i) => (
              <MotionDiv
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.05,
                  duration: 0.4,
                  ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
                }}
              >
                <BlogCard post={post} />
              </MotionDiv>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-12 text-center text-muted-foreground">
              Aucun article ne correspond à votre recherche.
            </p>
          )}

          {hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-colors font-medium"
              >
                Charger plus d'articles
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
