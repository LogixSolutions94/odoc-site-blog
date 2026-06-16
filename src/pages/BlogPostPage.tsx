import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { MotionDiv } from "@/components/MotionDiv";
import { BlogSEOHead } from "@/components/blog/BlogSEOHead";
import { BlogCategoryBadge } from "@/components/blog/BlogCategoryBadge";
import { BlogCard } from "@/components/blog/BlogCard";
import { ArticleTOC } from "@/components/blog/ArticleTOC";
import { ArticleFAQ } from "@/components/blog/ArticleFAQ";
import { AuthorBio } from "@/components/blog/AuthorBio";
import { ShareLink } from "@/components/blog/ShareLink";
import { NewsletterInline } from "@/components/blog/NewsletterInline";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  splitFaq,
  extractHeadings,
  buildArticleGraph,
  BASE_URL,
  DEFAULT_AUTHOR,
} from "@/lib/blogContent";
import { categoryLongLabel, categoryGuideSlug } from "@/lib/blogTaxonomy";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

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
  useEffect(() => {
    if (slug && post) supabase.rpc("increment_view_count", { post_slug: slug });
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

  useEffect(() => {
    if (error || (!isLoading && !post)) {
      toast({ title: "Article introuvable", variant: "destructive" });
      navigate("/blog");
    }
  }, [error, isLoading, post]);

  // Sépare la FAQ du corps, extrait les titres pour le sommaire, scinde pour le CTA.
  const { body, faq } = useMemo(() => splitFaq(post?.content || ""), [post?.content]);
  const headings = useMemo(() => extractHeadings(body), [body]);
  const showTOC = headings.filter((h) => h.depth === 2).length >= 4;
  const { before, after } = useMemo(() => {
    const paragraphs = body.split(/\n\n+/);
    const mid = Math.max(1, Math.floor(paragraphs.length / 2));
    return {
      before: paragraphs.slice(0, mid).join("\n\n"),
      after: paragraphs.slice(mid).join("\n\n"),
    };
  }, [body]);

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
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded bg-card" />
          <div className="h-12 w-2/3 rounded bg-card" />
          <div className="h-64 rounded-xl bg-card" />
        </div>
      </div>
    );
  }
  if (!post) return null;

  const articleUrl = `${BASE_URL}/blog/${post.slug}`;
  const authorName = (post.author_name || "").trim() || DEFAULT_AUTHOR;
  const showUpdated =
    post.updated_at && post.published_at && post.updated_at.slice(0, 10) !== post.published_at.slice(0, 10);
  const guideSlug = categoryGuideSlug(post.category);

  // Ids des titres consommés EN ORDRE par les renderers → ancres identiques au sommaire.
  const headingIds = headings.map((h) => h.id);
  let idCursor = 0;
  const nextHeadingId = () => headingIds[idCursor++];

  const mdComponents: Components = {
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
  };

  const proseClass =
    "prose prose-lg max-w-none prose-headings:tracking-tight prose-a:text-primary prose-strong:text-foreground prose-li:marker:text-primary";

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <BlogSEOHead
        title={`${post.seo_title || post.title} — Blog OdocPilot`}
        description={post.seo_description || post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogImage={post.og_image_url || post.cover_image_url || undefined}
        ogType="article"
        jsonLd={graph}
      />

      {/* En-tête (animé) — le corps reste hors MotionDiv pour rester lisible même sans JS. */}
      <MotionDiv className="mx-auto max-w-[68ch]">
        <nav className="mb-8 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/blog" className="transition-colors hover:text-foreground">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <BlogCategoryBadge category={post.category} accent />
        </nav>

        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {post.author_avatar_url && (
              <img
                src={post.author_avatar_url}
                alt={authorName}
                className="h-8 w-8 rounded-full object-cover"
                loading="lazy"
              />
            )}
            <span className="font-medium text-foreground">{authorName}</span>
            <span aria-hidden>·</span>
            <span>{formatDate(post.published_at)}</span>
            {showUpdated && (
              <>
                <span aria-hidden>·</span>
                <span>Mis à jour le {formatDate(post.updated_at)}</span>
              </>
            )}
          </div>
        </header>

        {post.cover_image_url && (
          <div className="mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-muted">
            <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
          </div>
        )}
      </MotionDiv>

      {/* Corps + sommaire */}
      <div className={showTOC ? "mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12" : "mt-12"}>
        <div className="min-w-0">
          <div className="mx-auto max-w-[68ch]">
            {showTOC && (
              <details className="mb-8 rounded-lg border border-border bg-secondary/50 p-4 lg:hidden">
                <summary className="cursor-pointer text-sm font-semibold text-foreground">Sommaire</summary>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {headings.map((h) => (
                    <li key={h.id} className={h.depth === 3 ? "ml-3" : ""}>
                      <a href={`#${h.id}`} className="text-muted-foreground hover:text-foreground">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <div className={proseClass}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {before}
              </ReactMarkdown>
            </div>

            {/* CTA inline désaturé — accent porté par le seul bouton */}
            <div className="my-10 rounded-xl border border-border bg-secondary/60 p-6 text-center sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Conformité 2026/2027</p>
              <p className="mt-2 text-lg font-bold tracking-tight text-foreground">
                L'IA prépare vos factures électroniques, vous validez en un clic.
              </p>
              <a href={SIGNUP} data-umami-event="blog-cta-article" className="mt-4 inline-block">
                <Button className="bg-gradient-cta text-primary-foreground">
                  Essayer OdocPilot — 14 jours gratuits
                </Button>
              </a>
              <Link
                to="/diagnostic"
                className="mt-3 block text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Ou vérifiez votre conformité en 3 min
              </Link>
            </div>

            {after.trim() && (
              <div className={proseClass}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {after}
                </ReactMarkdown>
              </div>
            )}

            <ArticleFAQ items={faq} />

            <ShareLink url={articleUrl} title={post.title} />

            <AuthorBio name={authorName} avatarUrl={post.author_avatar_url} />

            <NewsletterInline source="blog-article" />

            {/* Lien vers la page pilier du silo (maillage interne) */}
            {guideSlug && (
              <Link
                to={`/guide/${guideSlug}`}
                className="group mt-12 flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <span className="text-sm">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Guide complet
                  </span>
                  <span className="mt-0.5 block font-bold tracking-tight text-foreground">
                    {categoryLongLabel(post.category)}
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}

            <div className="mt-12">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au blog
              </Link>
            </div>
          </div>
        </div>

        {showTOC && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <ArticleTOC headings={headings} />
            </div>
          </aside>
        )}
      </div>

      {/* À lire dans le même silo */}
      {relatedPosts.length > 0 && (
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-foreground">
            À lire dans « {categoryLongLabel(post.category)} »
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {relatedPosts.map((rp) => (
              <BlogCard key={rp.slug} post={rp} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
