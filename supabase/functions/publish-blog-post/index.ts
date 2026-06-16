import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, preflight, timingSafeEqual } from "../_shared/cors.ts";

interface PublishBlogPostPayload {
  action: "create" | "update" | "publish" | "unpublish";
  slug: string;
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  cover_image_url?: string;
  author_name?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  og_image_url?: string;
  featured?: boolean;
  read_time_minutes?: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight(req);
  const cors = corsHeaders(req);
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  try {
    // Auth check (constant-time, audit 2026-06-16, finding M3).
    const authHeader = req.headers.get("Authorization") ?? "";
    const secret = Deno.env.get("BLOG_WEBHOOK_SECRET");
    if (!secret) {
      console.error("[publish-blog-post] BLOG_WEBHOOK_SECRET missing");
      return json(500, { success: false, error: "Server misconfiguration" });
    }
    if (!timingSafeEqual(authHeader, `Bearer ${secret}`)) {
      return json(401, { success: false, error: "Unauthorized" });
    }

    const payload: PublishBlogPostPayload = await req.json();
    if (!payload.slug || !payload.action) {
      return json(400, { success: false, error: "Missing slug or action" });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let readTime = payload.read_time_minutes;
    if (!readTime && payload.content) {
      readTime = Math.ceil(payload.content.split(/\s+/).length / 200);
    }

    const { action, slug } = payload;

    if (action === "create") {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          slug,
          title: payload.title || "Sans titre",
          excerpt: payload.excerpt || "",
          content: payload.content || "",
          category: payload.category || "general",
          tags: payload.tags || [],
          cover_image_url: payload.cover_image_url,
          author_name: payload.author_name || "Équipe Odoc",
          seo_title: payload.seo_title,
          seo_description: payload.seo_description,
          seo_keywords: payload.seo_keywords,
          og_image_url: payload.og_image_url,
          featured: payload.featured || false,
          read_time_minutes: readTime || 5,
          status: "draft",
        })
        .select("id")
        .single();

      if (error) throw error;
      return json(200, { success: true, action, slug, id: data.id });
    }

    if (action === "update") {
      const updateData: Record<string, unknown> = {};
      if (payload.title) updateData.title = payload.title;
      if (payload.excerpt) updateData.excerpt = payload.excerpt;
      if (payload.content) updateData.content = payload.content;
      if (payload.category) updateData.category = payload.category;
      if (payload.tags) updateData.tags = payload.tags;
      if (payload.cover_image_url !== undefined) updateData.cover_image_url = payload.cover_image_url;
      if (payload.author_name) updateData.author_name = payload.author_name;
      if (payload.seo_title !== undefined) updateData.seo_title = payload.seo_title;
      if (payload.seo_description !== undefined) updateData.seo_description = payload.seo_description;
      if (payload.seo_keywords !== undefined) updateData.seo_keywords = payload.seo_keywords;
      if (payload.og_image_url !== undefined) updateData.og_image_url = payload.og_image_url;
      if (payload.featured !== undefined) updateData.featured = payload.featured;
      if (readTime) updateData.read_time_minutes = readTime;

      const { data, error } = await supabase
        .from("blog_posts")
        .update(updateData)
        .eq("slug", slug)
        .select("id")
        .single();

      if (error) throw error;
      if (!data) return json(404, { success: false, error: "Article not found", slug });
      return json(200, { success: true, action, slug, id: data.id });
    }

    if (action === "publish") {
      const { data: existing } = await supabase
        .from("blog_posts")
        .select("id, published_at")
        .eq("slug", slug)
        .single();

      if (!existing) return json(404, { success: false, error: "Article not found", slug });

      const updateObj: Record<string, unknown> = { status: "published" };
      if (!existing.published_at) updateObj.published_at = new Date().toISOString();

      const { error } = await supabase
        .from("blog_posts")
        .update(updateObj)
        .eq("slug", slug);

      if (error) throw error;

      fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent("https://odocpilot.com/sitemap.xml")}`).catch(() => {});
      return json(200, { success: true, action, slug, id: existing.id });
    }

    if (action === "unpublish") {
      const { data, error } = await supabase
        .from("blog_posts")
        .update({ status: "draft" })
        .eq("slug", slug)
        .select("id")
        .single();

      if (error) throw error;
      if (!data) return json(404, { success: false, error: "Article not found", slug });
      return json(200, { success: true, action, slug, id: data.id });
    }

    return json(400, { success: false, error: "Invalid action" });
  } catch (err) {
    console.error("[publish-blog-post] uncaught:", err);
    return json(500, { success: false, error: "Internal error" });
  }
});
