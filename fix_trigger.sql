-- Trigger Postgres → ping de l'EF sitemap-refresh quand un article passe published.
--
-- ⚠️ Sécurité (audit 2026-06-16, finding C3) : l'EF exige désormais le header
-- X-Webhook-Secret. Le trigger DOIT le passer.
--
-- Pré-requis avant d'appliquer ce fichier en prod :
--   1. Choisir un secret fort : openssl rand -hex 32
--   2. Le poser dans les Secrets Supabase de l'EF sitemap-refresh :
--        supabase secrets set SITEMAP_WEBHOOK_SECRET=<secret>
--   3. Le poser AUSSI comme GUC Postgres pour que le trigger le lise :
--        ALTER DATABASE postgres SET app.sitemap_webhook_secret = '<secret>';
--      (équivalent côté session SQL : SET app.sitemap_webhook_secret = '<secret>';)
--   4. Puis exécuter ce fichier.

CREATE OR REPLACE FUNCTION public.notify_sitemap_refresh()
RETURNS trigger AS $$
DECLARE
  v_secret text := current_setting('app.sitemap_webhook_secret', true);
BEGIN
  IF NEW.status = 'published' THEN
    BEGIN
      PERFORM net.http_post(
        url := 'https://api.odocpilot.com/functions/v1/sitemap-refresh',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'X-Webhook-Secret', COALESCE(v_secret, '')
        ),
        body := json_build_object('type', TG_OP, 'table', TG_TABLE_NAME, 'record', row_to_json(NEW))::text
      );
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

DROP TRIGGER IF EXISTS on_blog_post_published ON public.blog_posts;
CREATE TRIGGER on_blog_post_published
AFTER INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.notify_sitemap_refresh();
