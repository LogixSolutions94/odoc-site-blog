-- ╔════════════════════════════════════════════════════════════════════════╗
-- ║  Security hardening — audit 2026-06-16                                 ║
-- ║  Findings adressés : C1, M1, M4, H1, M5/M7 (RGPD unsubscribe)         ║
-- ║                                                                        ║
-- ║  ⚠️ ORDRE D'APPLICATION (idempotent, safe à rejouer) :                 ║
-- ║     1) Vérifier en staging d'abord                                     ║
-- ║     2) Appliquer en prod via psql (cf. docs/SECURITY_AUDIT_*.md)       ║
-- ║                                                                        ║
-- ║  Pré-requis prod : extension pgcrypto disponible (digest HMAC).        ║
-- ╚════════════════════════════════════════════════════════════════════════╝

-- ────────────────────────────────────────────────────────────────────────────
-- C1 — RLS blog_posts : restaurer la policy "anon = published only"
-- (le drift prod expose les drafts → preuve dans le rapport d'audit)
-- ────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published posts" ON public.blog_posts;
CREATE POLICY "Public can read published posts" ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Aucune policy INSERT/UPDATE/DELETE pour anon → seul service_role peut écrire.
DROP POLICY IF EXISTS "Service role can manage all posts" ON public.blog_posts;
CREATE POLICY "Service role can manage all posts" ON public.blog_posts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- ────────────────────────────────────────────────────────────────────────────
-- M4 — Aligner la contrainte CHECK(category) sur la taxonomie 2026
-- (wedge conformité — cf. SEOBlog.md). Sans ça, les INSERTs avec
-- 'facturation-electronique' échouent.
-- ────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_category_check;

ALTER TABLE public.blog_posts
  ADD CONSTRAINT blog_posts_category_check
  CHECK (category IN (
    'facturation-electronique',
    'obligations-2026-2027',
    'plateforme-agreee',
    'factur-x',
    'tpe-sans-comptable',
    -- Anciennes catégories conservées pour ne pas casser les articles existants :
    'facturation',
    'comptabilite',
    'ia-documents',
    'gestion-pme',
    'tutoriel',
    'general'
  ));


-- ────────────────────────────────────────────────────────────────────────────
-- M1 — increment_view_count : retirer EXECUTE à anon
-- L'EF SECURITY DEFINER reste utilisable par service_role (publish-blog-post),
-- mais plus exposée à n'importe quel anon → fini l'inflation triviale des stats.
-- ────────────────────────────────────────────────────────────────────────────

REVOKE EXECUTE ON FUNCTION public.increment_view_count(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_view_count(text) FROM authenticated;
-- Service role et postgres conservent EXECUTE par défaut.


-- ────────────────────────────────────────────────────────────────────────────
-- H1 — newsletter_subscribers : durcir le WITH CHECK + ajouter colonnes
-- nécessaires à l'unsubscribe RGPD (M5/M7)
-- ────────────────────────────────────────────────────────────────────────────

-- 1) Créer la table si elle n'existe pas (drift constaté en prod : 42P01).
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'landing',
  -- Token d'unsubscribe : HMAC(email, server_secret) côté EF (cf. unsubscribe-newsletter).
  unsubscribe_token TEXT
);

-- 2) Activer RLS (idempotent).
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 3) Remplacer "Anyone can subscribe / WITH CHECK (true)" par un check email valide
--    + un check de longueur. Le rate-limit reste à la charge de l'EF subscribe-newsletter.
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anon can subscribe with valid email" ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  -- Regex email simple (anti-bot trivial) + longueur raisonnable.
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND char_length(email) BETWEEN 5 AND 254
  AND char_length(COALESCE(source, '')) <= 50
);

-- 4) Service role lit/manage tout (utilisé par les EF subscribe / unsubscribe).
DROP POLICY IF EXISTS "Service role can read subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Service role can manage subscribers" ON public.newsletter_subscribers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 5) Anon NE PEUT PAS lire la table (pas de policy SELECT pour anon → deny).
--    L'unsubscribe se fait via une EF qui valide le token côté serveur.


-- ────────────────────────────────────────────────────────────────────────────
-- Index utiles pour la perf des EF subscribe/unsubscribe
-- ────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_unsub_token
  ON public.newsletter_subscribers(unsubscribe_token)
  WHERE unsubscribe_token IS NOT NULL;


-- ────────────────────────────────────────────────────────────────────────────
-- Vérification (commenté — décommenter pour debug)
-- ────────────────────────────────────────────────────────────────────────────
-- SELECT polname, polcmd, polqual::text AS using_clause, polwithcheck::text AS check_clause
-- FROM pg_policy
-- WHERE polrelid IN ('public.blog_posts'::regclass, 'public.newsletter_subscribers'::regclass)
-- ORDER BY polname;
