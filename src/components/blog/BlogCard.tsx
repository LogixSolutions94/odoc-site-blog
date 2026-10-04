import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getSilo, resolveSiloSlug } from "@/lib/blogTaxonomy";
import { BlogCategoryBadge } from "./BlogCategoryBadge";

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    /** Colonne `silo` du pipeline (prod) : prioritaire sur category pour le badge. */
    silo?: string | null;
    author_name?: string | null;
    published_at: string | null;
    featured?: boolean | null;
    /** Image de couverture, affichée en vignette. */
    cover_image_url?: string | null;
    /** Sert à estimer le temps de lecture quand il n'est pas stocké. */
    content?: string | null;
    read_time_minutes?: number | null;
    /** Colonne présente en production (hors types générés). */
    word_count?: number | null;
  };
  /**
   * default : ligne de la liste (date à gauche, titre, chapeau).
   * featured : article à la une, en tête de liste.
   * compact : colonne étroite (« À lire aussi »).
   */
  variant?: "default" | "featured" | "compact";
  /** h2 dans la liste du blog, h3 sous un titre de section. */
  headingLevel?: 2 | 3;
}

const WORDS_PER_MINUTE = 200;

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/** Temps de lecture : valeur stockée, sinon nombre de mots stocké, sinon calcul sur le texte. */
function readingMinutes(post: BlogCardProps["post"]): number | null {
  if (post.read_time_minutes && post.read_time_minutes > 0) return Math.round(post.read_time_minutes);
  const words =
    post.word_count && post.word_count > 0
      ? post.word_count
      : post.content
        ? post.content.split(/\s+/).filter(Boolean).length
        : 0;
  return words > 0 ? Math.max(1, Math.round(words / WORDS_PER_MINUTE)) : null;
}

/** Vignette recadrée : Pexels redimensionne côté serveur (w, h, fit=crop) ; autre hôte : image telle quelle. */
function thumb(url: string, w: number, h: number, dpr = 1): string {
  try {
    const u = new URL(url);
    if (u.hostname !== "images.pexels.com") return url;
    u.search = new URLSearchParams({ auto: "compress", cs: "tinysrgb", fit: "crop", w: String(w), h: String(h), dpr: String(dpr) }).toString();
    return u.toString();
  } catch {
    return url;
  }
}

/** Image de l'article : décorative (alt vide), le titre voisin porte le lien et le sens. */
function Cover({ url, w, h, className = "", eager = false }: { url: string; w: number; h: number; className?: string; eager?: boolean }) {
  return (
    <img
      src={thumb(url, w, h)}
      srcSet={`${thumb(url, w, h)} 1x, ${thumb(url, w, h, 2)} 2x`}
      width={w}
      height={h}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`w-full rounded-[3px] bg-muted object-cover ${className}`}
    />
  );
}

/**
 * Article de blog présenté comme dans un sommaire de revue : texte, filets et
 * image de couverture. Tout le bloc est cliquable (lien étiré), le titre reste
 * l'unique lien et son nom accessible.
 */
export function BlogCard({ post, variant = "default", headingLevel = 3 }: BlogCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const minutes = useMemo(() => readingMinutes(post), [post]);
  const silo = getSilo(resolveSiloSlug(post));
  const href = `/blog/${post.slug}`;
  const titleLink = (
    <Link
      to={href}
      className="decoration-1 underline-offset-[0.18em] after:absolute after:inset-0 group-hover:underline"
    >
      {post.title}
    </Link>
  );
  const date = post.published_at ? <time dateTime={post.published_at}>{formatDate(post.published_at)}</time> : null;

  if (variant === "featured") {
    return (
      <article className="group relative border-b border-foreground/80 pb-10">
        {post.cover_image_url && <Cover url={post.cover_image_url} w={1200} h={560} eager className="mb-7 aspect-[15/7]" />}
        <p className="text-sm font-bold text-muted-foreground">
          À la une
          {silo && <span className="font-normal"> · {silo.label}</span>}
        </p>
        <Heading className="mt-3 font-display display-tight text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold leading-[1.06]">
          {titleLink}
        </Heading>
        {post.excerpt && (
          <p className="mt-4 max-w-[44rem] text-[1.125rem] leading-relaxed text-muted-foreground">{post.excerpt}</p>
        )}
        <p className="mt-4 text-sm text-muted-foreground">
          {date}
          {minutes && (
            <>
              <span aria-hidden="true"> · </span>
              {minutes} min de lecture
            </>
          )}
        </p>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group relative border-b border-border py-6 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
        {post.cover_image_url && <Cover url={post.cover_image_url} w={480} h={320} className="mb-4 aspect-[3/2]" />}
        <p className="font-data text-[0.8125rem] text-muted-foreground">{date}</p>
        <Heading className="mt-2 font-display text-[1.25rem] font-bold leading-snug tracking-[-0.02em]">{titleLink}</Heading>
        {minutes && <p className="mt-3 text-sm text-muted-foreground">{minutes} min de lecture</p>}
      </article>
    );
  }

  return (
    <article
      className={`group relative grid gap-x-5 gap-y-2 border-b border-border py-7 sm:gap-x-8 ${
        post.cover_image_url ? "grid-cols-[minmax(0,1fr)_5.5rem] sm:grid-cols-[8.5rem_minmax(0,1fr)_12rem]" : "sm:grid-cols-[8.5rem_minmax(0,1fr)]"
      }`}
    >
      <p className="col-span-full font-data text-[0.8125rem] text-muted-foreground sm:col-span-1 sm:pt-1.5">{date}</p>
      <div className="min-w-0">
        {silo && <BlogCategoryBadge category={silo.slug} className="mb-1.5 block" />}
        <Heading className="font-display text-[1.375rem] font-bold leading-[1.18] tracking-[-0.02em] sm:text-[1.5rem]">
          {titleLink}
        </Heading>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 max-w-[44rem] leading-relaxed text-muted-foreground">{post.excerpt}</p>
        )}
        {minutes && <p className="mt-3 text-sm text-muted-foreground">{minutes} min de lecture</p>}
      </div>
      {post.cover_image_url && <Cover url={post.cover_image_url} w={240} h={160} className="aspect-square self-start sm:aspect-[3/2]" />}
    </article>
  );
}
