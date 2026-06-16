import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { BlogCategoryBadge } from "./BlogCategoryBadge";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    cover_image_url?: string | null;
    category: string;
    author_name: string;
    published_at: string | null;
    featured?: boolean;
  };
  variant?: "default" | "featured";
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function CoverImage({
  src,
  alt,
  className,
  iconClassName,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <FileText className={cn("text-primary/40", iconClassName)} />
        </div>
      )}
    </div>
  );
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  if (variant === "featured") {
    return (
      <Link to={`/blog/${post.slug}`} className="group block">
        <article className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow hover:shadow-card-hover md:grid-cols-2">
          <CoverImage
            src={post.cover_image_url}
            alt={post.title}
            className="aspect-[16/10] md:aspect-auto md:h-full"
            iconClassName="h-16 w-16"
          />
          <div className="flex flex-col justify-center p-7 sm:p-9">
            <BlogCategoryBadge category={post.category} accent className="w-fit" />
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">
              {post.title}
            </h2>
            <p className="mt-3 line-clamp-3 text-muted-foreground">{post.excerpt}</p>
            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{post.author_name}</span>
              <span aria-hidden>·</span>
              <span>{formatDate(post.published_at)}</span>
            </div>
            <span className="mt-5 text-sm font-semibold text-primary">
              Lire le guide <span aria-hidden>→</span>
            </span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-card-hover">
        <CoverImage src={post.cover_image_url} alt={post.title} className="aspect-[16/9]" iconClassName="h-10 w-10" />
        <div className="flex flex-1 flex-col p-5">
          <BlogCategoryBadge category={post.category} className="w-fit" />
          <h3 className="mt-3 line-clamp-2 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{post.author_name}</span>
            <span aria-hidden>·</span>
            <span>{formatDate(post.published_at)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
