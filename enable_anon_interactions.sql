-- This script creates secure functions that allow anyone visiting the site
-- to like, save, or share an article, and updates the database securely
-- without needing a secret admin key on the client side.

-- 1. Create a secure function for Article interactions
CREATE OR REPLACE FUNCTION increment_article_interaction(p_article_id bigint, p_interaction_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_interaction_type = 'like' THEN
    UPDATE articles SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = p_article_id;
  ELSIF p_interaction_type = 'save' THEN
    UPDATE articles SET saves_count = COALESCE(saves_count, 0) + 1 WHERE id = p_article_id;
  ELSIF p_interaction_type = 'share' THEN
    UPDATE articles SET shares_count = COALESCE(shares_count, 0) + 1 WHERE id = p_article_id;
  END IF;
END;
$$;

-- 2. Create a secure function for Homepage Shares
CREATE OR REPLACE FUNCTION increment_homepage_share()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO site_settings (id, homepage_shares_count)
  VALUES (1, 1)
  ON CONFLICT (id) DO UPDATE
  SET homepage_shares_count = COALESCE(site_settings.homepage_shares_count, 0) + 1;
END;
$$;
