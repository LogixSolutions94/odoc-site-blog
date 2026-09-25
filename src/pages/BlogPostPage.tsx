import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import NotFound from "./NotFound";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { BlogSEOHead } from "@/components/blog/BlogSEOHead";
import { BlogCard } from "@/components/blog/BlogCard";
import { ArticleTOC } from "@/components/blog/ArticleTOC";
import { ArticleFAQ } from "@/components/blog/ArticleFAQ";
import { AuthorBio } from "@/components/blog/AuthorBio";
import { ShareLink } from "@/components/blog/ShareLink";
import { NewsletterInline } from "@/components/blog/NewsletterInline";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import {
  splitFaq,
  extractHeadings,
  buildArticleGraph,
  BASE_URL,
  DEFAULT_AUTHOR,
} from "@/lib/blogContent";
import { categoryLongLabel, categoryGuideSlug } from "@/lib/blogTaxonomy";
import { SIGNUP_URL, TRIAL } from "@/lib/marketing";
import { fr } from "@/lib/typo";

const WORDS_PER_MINUTE = 200;

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/** Temps de lecture : valeur stockée, sinon nombre de mots stocké, sinon calcul sur le texte. */
function readingMinutes(post: { content?: string | null; read_time_minutes?: number | null; word_count?: number | null }) {
  if (post.read_time_minutes && post.read_time_minutes > 0) return Math.round(post.read_time_minutes);
  const words =
    post.word_count && post.word_count > 0
      ? post.word_count
      : post.content
        ? post.content.split(/\s+/).filter(Boolean).length
        : 0;
  return words > 0 ? Math.max(1, Math.round(words / WORDS_PER_MINUTE)) : null;
}

/**
 * Typographie de lecture : mesure de 68 caractères (posée par le conteneur), interlignage
 * généreux, titres en Bricolage. Les liens gardent le pétrole du thème, les puces l'encre
 * diluée (l'orange est réservé à ce que l'IA prépare). scroll-mt : les ancres du sommaire
 * ne passent pas sous l'en-tête collant.
 */
const PROSE_CLASS = [
  "prose prose-lg max-w-none",
  "prose-headings:font-display prose-headings:font-bold prose-headings:tracking-[-0.02em]",
  "prose-h2:mb-5 prose-h2:mt-14 prose-h2:scroll-mt-24 prose-h2:text-[1.75rem] prose-h2:leading-[1.15] sm:prose-h2:text-[2rem]",
  "prose-h3:mt-10 prose-h3:scroll-mt-24 prose-h3:text-[1.3rem] prose-h3:leading-snug",
  "prose-p:leading-[1.78] prose-li:leading-[1.7] prose-li:marker:text-muted-foreground",
  "prose-strong:text-foreground prose-img:rounded-[3px] prose-hr:my-12",
  "prose-blockquote:border-l-2 prose-blockquote:border-foreground/30 prose-blockquote:font-normal",
].join(" ");

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .eq("status", "published")
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Compteur de vues : conservé en logique interne (analytics admin), JAMAIS affiché.
  // Une seule fois par article (dépendance sur l'id, pas sur l'objet re-créé à chaque requête).
  useEffect(() => {
    if (slug && post) supabase.rpc("increment_view_count", { post_slug: slug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, post?.id]);

  const { data: relatedPosts = [] } = useQuery({
    queryKey: ["related-posts", post?.category, slug],
    queryFn: async () => {
      const { data: sameCat } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .eq("category", post!.category)
        .neq("slug", slug!)
        .order("published_at", { ascending: false })
        .limit(3);
      const results = sameCat || [];
      if (results.length < 3) {
        const existingSlugs = [slug!, ...results.map((r) => r.slug)];
        const { data: others } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("status", "published")
          .not("slug", "in", `(${existingSlugs.join(",")})`)
          .order("published_at", { ascending: false })
          .limit(3 - results.length);
        if (others) results.push(...others);
      }
      return results;
    },
    enabled: !!post,
  });

  // Sépare la FAQ du corps, extrait les titres pour le sommaire, scinde pour le rappel.
  const { body, faq } = useMemo(() => splitFaq(post?.content || ""), [post?.content]);
  const headings = useMemo(() => extractHeadings(body), [body]);
  const showTOC = headings.filter((h) => h.depth === 2).length >= 4;
  // Affichage seulement : la plupart des articles répètent leur titre en « # » sur la
  // première ligne. La page a déjà son <h1> (post.title), on ne l'affiche pas deux fois.
  const displayBody = useMemo(() => body.replace(/^\s*#[ \t][^\n]*\n*/, ""), [body]);
  const { before, after } = useMemo(() => {
    const blocks = displayBody.split(/\n\n+/);
    const mid = Math.max(1, Math.floor(blocks.length / 2));
    // Le rappel du milieu tombe entre deux sections : coupure juste avant le H2 le plus
    // proche du milieu (sinon au milieu, comme avant).
    let cut = mid;
    let best = Number.POSITIVE_INFINITY;
    blocks.forEach((block, i) => {
      if (i > 0 && /^##[ \t]/.test(block) && Math.abs(i - mid) < best) {
        best = Math.abs(i - mid);
        cut = i;
      }
    });
    return {
      before: blocks.slice(0, cut).join("\n\n"),
      after: blocks.slice(cut).join("\n\n"),
    };
  }, [displayBody]);

  const graph = useMemo(() => {
    if (!post) return undefined;
    return buildArticleGraph({
      slug: post.slug,
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      authorName: post.author_name,
      image: post.cover_image_url || post.og_image_url,
      datePublished: post.published_at,
      dateModified: post.updated_at,
      category: post.category,
      keywords: post.seo_keywords || (post.tags?.length ? post.tags.join(", ") : null),
      faq,
    });
  }, [post, faq]);

  if (isLoading) {
    return (
      <div aria-busy="true" aria-label="Chargement de l'article" className="mx-auto max-w-[68ch] px-5 py-14 sm:py-20">
        <div className="space-y-5">
          <div className="h-4 w-40 animate-pulse rounded-[3px] bg-muted motion-reduce:animate-none" />
          <div className="h-10 w-full animate-pulse rounded-[3px] bg-muted motion-reduce:animate-none" />
          <div className="h-10 w-3/4 animate-pulse rounded-[3px] bg-muted motion-reduce:animate-none" />
          <div className="h-4 w-1/2 animate-pulse rounded-[3px] bg-muted motion-reduce:animate-none" />
        </div>
      </div>
    );
  }
  // Slug supprimé/inexistant : on rend une vraie 404 noindex (cf. NotFound) plutôt
  // qu'un redirect JS vers /blog, sinon Google reste sur un 200 « soft-404 »
  // (statuts GSC « doublon sans canonique » / « explorée, non indexée »).
  if (error || !post) return <NotFound />;

  const articleUrl = `${BASE_URL}/blog/${post.slug}`;
  const authorName = (post.author_name || "").trim() || DEFAULT_AUTHOR;
  const showUpdated =
    post.updated_at && post.published_at && post.updated_at.slice(0, 10) !== post.published_at.slice(0, 10);
  const guideSlug = categoryGuideSlug(post.category);
  const minutes = readingMinutes(post);

  // Ids des titres consommés EN ORDRE par les renderers → ancres identiques au sommaire.
  const headingIds = headings.map((h) => h.id);
  let idCursor = 0;
  const nextHeadingId = () => headingIds[idCursor++];

  const mdComponents: Components = {
    // Un « # » restant dans le corps devient un intertitre : un seul <h1> par page.
    // Il ne consomme pas d'ancre (extractHeadings ne lit que ## et ###).
    h1: ({ children }) => <h2>{children}</h2>,
    h2: ({ children }) => <h2 id={nextHeadingId()}>{children}</h2>,
    h3: ({ children }) => <h3 id={nextHeadingId()}>{children}</h3>,
    a: ({ href, children }) => {
      const h = href || "";
      // Interne = chemin « / » (mais pas « // » protocol-relative) ou host odocpilot.com exact.
      const internal =
        (h.startsWith("/") && !h.startsWith("//")) ||
        /^https?:\/\/(www\.)?odocpilot\.com(?=[/?#]|$)/i.test(h);
      if (internal) {
        const to = h.replace(/^https?:\/\/(www\.)?odocpilot\.com/i, "") || "/";
        return <Link to={to}>{children}</Link>;
      }
      return (
        <a href={h} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
    img: ({ node: _node, alt, ...props }) => <img {...props} alt={alt ?? ""} loading="lazy" decoding="async" />,
    // Tableaux larges : défilement horizontal dans la colonne plutôt que débordement de page.
    table: ({ children }) => (
      <div className="overflow-x-auto">
        <table>{children}</table>
      </div>
    ),
  };

  return (
    <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
      <BlogSEOHead
        title={`${post.seo_title || post.title} — Blog OdocPilot`}
        description={post.seo_description || post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogImage={post.og_image_url || post.cover_image_url || undefined}
        ogType="article"
        jsonLd={graph}
      />

      <div className={showTOC ? "lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16" : undefined}>
        <article className="min-w-0 py-10 sm:py-14">
          <div className="mx-auto max-w-[68ch]">
            <nav aria-label="Fil d'Ariane" className="text-sm text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <li>
                  <Link to="/" className="transition-colors duration-200 hover:text-foreground">
                    Accueil
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} strokeWidth={1.75} />
                </li>
                <li>
                  <Link to="/blog" className="transition-colors duration-200 hover:text-foreground">
                    Blog
                  </Link>
                </li>
                {guideSlug && (
                  <>
                    <li aria-hidden="true">
                      <ChevronRight size={14} strokeWidth={1.75} />
                    </li>
                    <li>
                      <Link to={`/guide/${guideSlug}`} className="transition-colors duration-200 hover:text-foreground">
                        {categoryLongLabel(post.category)}
                      </Link>
                    </li>
                  </>
                )}
              </ol>
            </nav>

            <header className="mt-8">
              <h1 className="font-display display-tight text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08]">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-5 text-[1.1875rem] leading-relaxed text-muted-foreground">{post.excerpt}</p>
              )}
              <p className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-border pt-4 text-[0.9375rem] text-muted-foreground">
                {post.author_avatar_url && (
                  <img
                    src={post.author_avatar_url}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <span className="font-bold text-foreground">{authorName}</span>
                {post.published_at && (
                  <>
                    <span aria-hidden="true">·</span>
                    <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                  </>
                )}
                {showUpdated && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>
                      Mis à jour le <time dateTime={post.updated_at ?? undefined}>{formatDate(post.updated_at)}</time>
                    </span>
                  </>
                )}
                {minutes && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{minutes} min de lecture</span>
                  </>
                )}
              </p>
            </header>

            {post.cover_image_url && (
              <div className="mt-8 aspect-[16/9] overflow-hidden rounded-[3px] bg-muted">
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}

            {/* Sommaire replié (mobile et tablette) */}
            {showTOC && (
              <details className="group mt-10 border-y border-border lg:hidden">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 font-display font-bold [&::-webkit-details-marker]:hidden">
                  Sommaire
                  <span
                    aria-hidden="true"
                    className="font-display text-[1.5rem] font-normal leading-none transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </summary>
                <ul className="space-y-1 pb-5 text-[0.9375rem]">
                  {headings.map((h) => (
                    <li key={h.id} className={h.depth === 3 ? "ml-4" : ""}>
                      <a href={`#${h.id}`} className="block py-1 text-muted-foreground transition-colors duration-200 hover:text-foreground">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <div className="mt-10">
              <div className={PROSE_CLASS}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {before}
                </ReactMarkdown>
              </div>

              {/* Rappel discret au milieu de l'article : un outil gratuit, pas une publicité. */}
              <aside aria-label="Diagnostic gratuit" className="my-12 border-y border-border py-6">
                <p className="font-display text-[1.25rem] font-bold leading-snug">
                  {fr("Où en est votre entreprise avec la facture électronique ?")}
                </p>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {fr("Le diagnostic gratuit vous dit en 3 minutes ce que la réforme change pour vous, date par date.")}
                </p>
                <Link
                  to="/diagnostic"
                  className="mt-4 inline-flex min-h-10 items-center gap-2 font-bold link-underline"
                  data-umami-event="blog-cta-mid-diagnostic"
                >
                  Faire le diagnostic <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </aside>

              {after.trim() && (
                <div className={PROSE_CLASS}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                    {after}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            <ArticleFAQ items={faq} />

            {/* Encadré de fin : passer à l'action */}
            <aside aria-label="Passer à l'action" className="mt-16 rounded-lg border border-border bg-desk p-6 sm:p-8">
              <p className="font-display text-[1.5rem] font-bold leading-tight sm:text-[1.75rem]">
                {fr("Facture électronique : votre entreprise est-elle prête ?")}
              </p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {fr("Le diagnostic gratuit vous dit en 3 minutes ce qui vous concerne, date par date. Et OdocPilot crée vos factures au format Factur-X, gratuitement.")}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a href={SIGNUP_URL} className="btn-ink" data-umami-event="blog-cta-article">
                  Commencer gratuitement <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
                </a>
                <Link
                  to="/diagnostic"
                  className="inline-flex min-h-12 items-center gap-2 font-bold link-underline"
                  data-umami-event="blog-cta-end-diagnostic"
                >
                  Faire le diagnostic <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </div>
              <p className="mt-5 text-[0.9375rem] text-muted-foreground">
                {fr(`Palier Conformité gratuit. Essai de l'offre ${TRIAL.plan} pendant ${TRIAL.days} jours, sans carte bancaire.`)}
              </p>
              <p className="mt-4 border-t border-border pt-4 text-[0.9375rem] text-muted-foreground">
                {fr("Aussi gratuits, sans compte : ")}
                <Link to="/generateur-factur-x" className="text-foreground link-underline" data-umami-event="blog-cta-end-generateur">
                  le générateur Factur-X
                </Link>
                {" et "}
                <Link to="/verificateur" className="text-foreground link-underline" data-umami-event="blog-cta-end-verificateur">
                  le vérificateur de facture
                </Link>
                .
              </p>
            </aside>

            <div className="mt-14 space-y-6 border-t border-border pt-8">
              <AuthorBio name={authorName} avatarUrl={post.author_avatar_url} />
              <ShareLink url={articleUrl} title={post.title} />
            </div>

            <NewsletterInline source="blog-article" />

            {/* Page pilier du silo (maillage interne) ; à défaut, le guide de la réforme. */}
            <Link
              to={guideSlug ? `/guide/${guideSlug}` : "/e-facture"}
              className="group mt-12 flex items-center justify-between gap-4 border-y border-border py-5"
            >
              <span>
                <span className="block text-sm font-bold text-muted-foreground">Le guide complet</span>
                <span className="mt-1 block font-display text-xl font-bold leading-snug">
                  {guideSlug ? categoryLongLabel(post.category) : "La facture électronique 2026-2027"}
                </span>
              </span>
              <ArrowRight
                size={20}
                strokeWidth={1.75}
                aria-hidden="true"
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>

            <Link
              to="/blog"
              className="mt-10 inline-flex min-h-10 items-center gap-2 text-muted-foreground link-underline"
            >
              <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
              Tous les articles
            </Link>
          </div>
        </article>

        {showTOC && (
          <aside className="hidden py-14 lg:block">
            <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto pb-4">
              <ArticleTOC headings={headings} />
            </div>
          </aside>
        )}
      </div>

      {/* À lire ensuite */}
      {relatedPosts.length > 0 && (
        <section aria-labelledby="a-lire-aussi" className="border-t border-border pb-6 pt-12">
          <h2
            id="a-lire-aussi"
            className="font-display text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-[2.2rem]"
          >
            {guideSlug ? fr(`À lire aussi sur « ${categoryLongLabel(post.category)} »`) : "À lire aussi"}
          </h2>
          <div className="mt-8 grid border-t border-foreground/80 md:grid-cols-3">
            {relatedPosts.map((rp) => (
              <BlogCard key={rp.slug} post={rp} variant="compact" headingLevel={3} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
