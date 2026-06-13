import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { MotionDiv } from "@/components/MotionDiv";
import { BlogSEOHead } from "@/components/blog/BlogSEOHead";
import { BlogCategoryBadge } from "@/components/blog/BlogCategoryBadge";
import { BlogCard } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, Eye, Clock, ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  // Increment view count
  useEffect(() => {
    if (slug && post) {
      supabase.rpc("increment_view_count", { post_slug: slug });
    }
  }, [slug, post?.id]);

  // Related posts
  const { data: relatedPosts = [] } = useQuery({
    queryKey: ["related-posts", post?.category, slug],
    queryFn: async () => {
      // First try same category
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

  // Insert CTA after ~50% of content
  const contentWithCTA = useMemo(() => {
    if (!post?.content) return { before: "", after: "" };
    const paragraphs = post.content.split(/\n\n+/);
    const mid = Math.max(1, Math.floor(paragraphs.length / 2));
    return {
      before: paragraphs.slice(0, mid).join("\n\n"),
      after: paragraphs.slice(mid).join("\n\n"),
    };
  }, [post?.content]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl py-16 sm:py-24 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-card rounded w-1/3" />
          <div className="h-12 bg-card rounded w-2/3" />
          <div className="h-64 bg-card rounded-xl" />
        </div>
      </div>
    );
  }

  if (!post) return null;

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const markdownComponents = {
    a: ({ ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a {...props} target="_blank" rel="noopener noreferrer" />
    ),
  };

  return (
    <article className="mx-auto max-w-3xl py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <BlogSEOHead
        title={`${post.seo_title || post.title} — Blog OdocPilot`}
        description={post.seo_description || post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogImage={post.og_image_url || post.cover_image_url || undefined}
        ogType="article"
        publishedTime={post.published_at ?? undefined}
        modifiedTime={post.updated_at ?? post.published_at ?? undefined}
      />

      <MotionDiv>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <BlogCategoryBadge category={post.category} />
        </nav>

        {/* Header */}
        <header>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground italic">{post.excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {post.author_avatar_url && (
              <img
                src={post.author_avatar_url}
                alt={post.author_name}
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            <span className="font-medium text-foreground">{post.author_name}</span>
            <span>·</span>
            <span>{publishedDate}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.read_time_minutes} min de lecture
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {post.view_count} vues
            </span>
          </div>
        </header>

        {/* Cover image */}
        {post.cover_image_url && (
          <div className="mt-8 rounded-xl overflow-hidden max-h-[400px]">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Content part 1 */}
        <div className="mt-12 prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-strong:text-foreground prose-li:marker:text-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={markdownComponents}>
            {contentWithCTA.before}
          </ReactMarkdown>
        </div>

        {/* Inline CTA */}
        <div className="my-10 bg-gradient-to-r from-primary/20 to-ring/20 border border-primary/30 rounded-xl p-6 sm:p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Essayez OdocPilot gratuitement — 14 jours, sans CB
            </span>
          </div>
          <p className="text-foreground font-medium">
            Automatisez vos factures avec l'IA d'Odoc
          </p>
          <Link to="/pricing" className="inline-block mt-4" data-umami-event="blog-cta-article">
            <Button>Démarrer l'essai gratuit →</Button>
          </Link>
        </div>

        {/* Content part 2 */}
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-strong:text-foreground prose-li:marker:text-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={markdownComponents}>
            {contentWithCTA.after}
          </ReactMarkdown>
        </div>

        {/* Back to blog */}
        <div className="mt-12">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour au blog
          </Link>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Articles similaires
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((rp) => (
                <BlogCard key={rp.slug} post={rp} />
              ))}
            </div>
          </section>
        )}
      </MotionDiv>
    </article>
  );
}
