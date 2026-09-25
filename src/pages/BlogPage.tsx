import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BlogSEOHead } from "@/components/blog/BlogSEOHead";
import { BlogCard } from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { BLOG_CATEGORY_FILTERS } from "@/lib/blogTaxonomy";
import { BASE_URL, PUBLISHER_NAME, PUBLISHER_LOGO } from "@/lib/blogContent";
import { fr } from "@/lib/typo";

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
    title: "Diagnostic en 3 minutes",
    desc: "Ce que la réforme 2026-2027 change pour votre entreprise, date par date.",
    umami: "blog-tool-diagnostic",
  },
  {
    to: "/generateur-factur-x",
    title: "Générateur de facture Factur-X",
    desc: "Le fichier XML de votre facture et un PDF à imprimer, sans compte.",
    umami: "blog-tool-generateur",
  },
  {
    to: "/verificateur",
    title: "Vérificateur de facture",
    desc: "Les mentions obligatoires d'une facture Factur-X, contrôlées une à une.",
    umami: "blog-tool-verificateur",
  },
  {
    to: "/e-facture",
    title: "Le guide de la réforme",
    desc: "Calendrier, formats, plateformes agréées : l'essentiel sur une page.",
    umami: "blog-tool-guide",
  },
];

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [page, setPage] = useState(1);

  const { data: posts = [], isLoading, isError, refetch } = useQuery({
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

  // Un filtre qui ne mène à aucun article est masqué (pas de cul-de-sac « aucun résultat »).
  // Les slugs restent ceux de blogTaxonomy (synchronisés avec SEOBlog.md) : un silo
  // réapparaît dès qu'un article publié porte sa catégorie.
  const visibleFilters = useMemo(() => {
    const present = new Set(posts.map((p) => p.category));
    return BLOG_CATEGORY_FILTERS.filter((c) => c.value === "all" || present.has(c.value));
  }, [posts]);

  const gridSource = featuredPost ? filtered.filter((p) => p.slug !== featuredPost.slug) : filtered;
  const paginated = gridSource.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < gridSource.length;

  const resetFilters = () => {
    setActiveCategory("all");
    setSearch("");
    setPage(1);
  };

  const query = search.trim();
  const countLabel =
    filtered.length === 0 ? "Aucun article" : `${filtered.length} article${filtered.length > 1 ? "s" : ""}`;

  return (
    <div>
      <BlogSEOHead
        title="Blog facture électronique : guides 2026-2027 | OdocPilot"
        description="Guides pratiques sur la facture électronique obligatoire : calendrier 2026-2027, format Factur-X, plateformes agréées, cas des TPE et des auto-entrepreneurs."
        canonical="/blog"
        jsonLd={LIST_JSON_LD}
      />

      {/* ─── En-tête ─────────────────────────────────────────── */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-20">
          <p className="text-sm font-bold text-muted-foreground">Blog OdocPilot</p>
          <h1 className="mt-4 max-w-[52rem] font-display display-tight text-[clamp(2.4rem,5.2vw,4.25rem)] font-bold leading-[1.02]">
            Le blog de la facture électronique
          </h1>
          <p className="mt-6 max-w-[42rem] text-[1.1875rem] leading-relaxed text-muted-foreground">
            Des guides pratiques pour les TPE, les PME, les indépendants et les auto-entrepreneurs&nbsp;: le calendrier
            2026-2027, le format Factur-X, les plateformes agréées et vos obligations, expliqués simplement.
          </p>
          <div className="relative mt-8 max-w-md">
            <Search
              size={18}
              strokeWidth={1.75}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Rechercher un article…"
              aria-label="Rechercher un article"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-12 rounded-lg pl-11 text-base"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1240px] gap-16 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20 lg:py-16">
        {/* ─── Articles ──────────────────────────────────────── */}
        <div className="min-w-0">
          {visibleFilters.length > 1 && (
            <div
              role="group"
              aria-label="Filtrer par thème"
              className="scrollbar-hide -mx-1 mb-6 flex gap-x-6 overflow-x-auto px-1 pb-1 pt-1"
            >
              {visibleFilters.map((cat) => {
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
                    className={`min-h-10 whitespace-nowrap border-b-2 text-[0.9375rem] transition-colors duration-200 focus-visible:outline-offset-2 ${
                      active
                        ? "border-foreground font-bold text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          )}

          {isLoading ? (
            <div aria-busy="true" aria-label="Chargement des articles" className="border-t border-foreground/80">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="grid gap-3 border-b border-border py-7 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-8">
                  <div className="h-4 w-24 animate-pulse rounded-[3px] bg-muted motion-reduce:animate-none" />
                  <div className="space-y-3">
                    <div className="h-6 w-4/5 animate-pulse rounded-[3px] bg-muted motion-reduce:animate-none" />
                    <div className="h-4 w-full animate-pulse rounded-[3px] bg-muted motion-reduce:animate-none" />
                    <div className="h-4 w-2/3 animate-pulse rounded-[3px] bg-muted motion-reduce:animate-none" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="border-t border-foreground/80 pt-8">
              <p className="font-display text-xl font-bold">{fr("Les articles n'ont pas pu être chargés.")}</p>
              <p className="mt-2 text-muted-foreground">{fr("Le problème vient de notre côté. Réessayez dans un instant.")}</p>
              <button type="button" onClick={() => refetch()} className="btn-ink btn-ink-sm mt-5">
                Réessayer
              </button>
            </div>
          ) : posts.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <p aria-live="polite" className="pb-3 text-sm text-muted-foreground">
                {fr(query ? `${countLabel} pour « ${query} »` : `${countLabel}, du plus récent au plus ancien`)}
              </p>

              {featuredPost && (
                <div className="border-t border-foreground/80 pt-8">
                  <BlogCard post={featuredPost} variant="featured" headingLevel={2} />
                </div>
              )}

              {paginated.length > 0 ? (
                <div className={featuredPost ? "" : "border-t border-foreground/80"}>
                  {paginated.map((post) => (
                    <BlogCard key={post.slug} post={post} headingLevel={2} />
                  ))}
                </div>
              ) : (
                <div className="border-t border-foreground/80 pt-8">
                  <p className="text-muted-foreground">Aucun article ne correspond à votre recherche.</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-4 inline-flex min-h-10 items-center font-bold link-underline"
                  >
                    Voir tous les articles
                  </button>
                </div>
              )}

              {hasMore && (
                <div className="mt-10">
                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    className="inline-flex min-h-12 items-center rounded-lg border border-foreground/30 px-5 font-bold transition-colors duration-200 hover:border-foreground active:scale-[0.97]"
                  >
                    {"Charger plus d'articles"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ─── Outils gratuits (maillage produit, sans compte) ─── */}
        <ToolsModule />
      </div>
    </div>
  );
}

function ToolsModule() {
  return (
    <aside aria-labelledby="outils-gratuits" className="lg:sticky lg:top-24 lg:self-start">
      <h2 id="outils-gratuits" className="font-display text-xl font-bold">
        Outils gratuits
      </h2>
      <p className="mt-1.5 text-[0.9375rem] text-muted-foreground">
        {fr("Pour passer de la lecture à l'action. Sans compte.")}
      </p>
      <ul className="mt-5 border-t border-foreground/80">
        {TOOLS.map(({ to, title, desc, umami }) => (
          <li key={to} className="border-b border-border">
            <Link to={to} data-umami-event={umami} className="group block py-4">
              <span className="flex items-center justify-between gap-3 font-bold">
                {title}
                <ArrowRight
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </span>
              <span className="mt-1 block text-[0.9375rem] leading-snug text-muted-foreground">{fr(desc)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[0.9375rem] leading-relaxed text-muted-foreground">
        {fr("OdocPilot crée vos factures au format Factur-X. Le palier Conformité est gratuit.")}{" "}
        <Link to="/pricing" className="text-foreground link-underline" data-umami-event="blog-tool-pricing">
          Voir les tarifs
        </Link>
      </p>
    </aside>
  );
}

function EmptyState() {
  return (
    <div className="border-t border-foreground/80 pt-8">
      <p className="font-display text-xl font-bold">Les premiers guides arrivent bientôt.</p>
      <p className="mt-2 max-w-[40rem] text-muted-foreground">
        {fr("Nous préparons des guides clairs sur la facture électronique 2026-2027.")}
      </p>
      <Link
        to="/diagnostic"
        className="mt-5 inline-flex items-center gap-2 font-bold link-underline"
        data-umami-event="blog-empty-diagnostic"
      >
        En attendant, faites le diagnostic en 3 minutes <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
      </Link>
    </div>
  );
}
