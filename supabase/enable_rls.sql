-- ============================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & POLICIES
-- ============================================================
-- Tento skript lze bezpečně spustit v Supabase SQL editoru 
-- na existující databázi. Je idempotentní (lze spustit opakovaně).

-- 1. Zapnutí RLS na všech tabulkách
ALTER TABLE IF EXISTS loupenicka ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS place_loupenicka ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mistecka ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS country_mistecka ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS area_mistecka ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS place_mistecka ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shared_places ENABLE ROW LEVEL SECURITY;

-- 2. Pomocné funkce pro čtení rolí z JWT app_metadata
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(
        (auth.jwt() -> 'app_metadata' -> 'roles')::jsonb ? required_role,
        false
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.has_role('admin') OR public.has_role('editor');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================
-- 3. POLICIES PRO LOUPENICKA
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view loupenicka" ON loupenicka;
CREATE POLICY "Authenticated users can view loupenicka"
    ON loupenicka FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Admin and editors can insert loupenicka" ON loupenicka;
CREATE POLICY "Admin and editors can insert loupenicka"
    ON loupenicka FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Admin and editors can update loupenicka" ON loupenicka;
CREATE POLICY "Admin and editors can update loupenicka"
    ON loupenicka FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Only admin can delete loupenicka" ON loupenicka;
CREATE POLICY "Only admin can delete loupenicka"
    ON loupenicka FOR DELETE
    TO authenticated
    USING (public.has_role('admin'));

-- ============================================================
-- 4. POLICIES PRO PLACE_LOUPENICKA
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view place_loupenicka" ON place_loupenicka;
CREATE POLICY "Authenticated users can view place_loupenicka"
    ON place_loupenicka FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Anon can view shared place_loupenicka" ON place_loupenicka;
CREATE POLICY "Anon can view shared place_loupenicka"
    ON place_loupenicka FOR SELECT
    TO anon
    USING (
        EXISTS (
            SELECT 1 FROM shared_places
            WHERE shared_places.place_loupenicka_id = place_loupenicka.id
              AND shared_places.expires_at > NOW()
        )
    );

DROP POLICY IF EXISTS "Admin and editors can insert place_loupenicka" ON place_loupenicka;
CREATE POLICY "Admin and editors can insert place_loupenicka"
    ON place_loupenicka FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Admin and editors can update place_loupenicka" ON place_loupenicka;
CREATE POLICY "Admin and editors can update place_loupenicka"
    ON place_loupenicka FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Admin and editors can delete place_loupenicka" ON place_loupenicka;
CREATE POLICY "Admin and editors can delete place_loupenicka"
    ON place_loupenicka FOR DELETE
    TO authenticated
    USING (public.is_admin_or_editor());

-- ============================================================
-- 5. POLICIES PRO MISTECKA
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view mistecka" ON mistecka;
CREATE POLICY "Authenticated users can view mistecka"
    ON mistecka FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Admin and editors can insert mistecka" ON mistecka;
CREATE POLICY "Admin and editors can insert mistecka"
    ON mistecka FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Admin and editors can update mistecka" ON mistecka;
CREATE POLICY "Admin and editors can update mistecka"
    ON mistecka FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Only admin can delete mistecka" ON mistecka;
CREATE POLICY "Only admin can delete mistecka"
    ON mistecka FOR DELETE
    TO authenticated
    USING (public.has_role('admin'));

-- ============================================================
-- 6. POLICIES PRO COUNTRY_MISTECKA
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view country_mistecka" ON country_mistecka;
CREATE POLICY "Authenticated users can view country_mistecka"
    ON country_mistecka FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Admin and editors can insert country_mistecka" ON country_mistecka;
CREATE POLICY "Admin and editors can insert country_mistecka"
    ON country_mistecka FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Admin and editors can update country_mistecka" ON country_mistecka;
CREATE POLICY "Admin and editors can update country_mistecka"
    ON country_mistecka FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Admin and editors can delete country_mistecka" ON country_mistecka;
CREATE POLICY "Admin and editors can delete country_mistecka"
    ON country_mistecka FOR DELETE
    TO authenticated
    USING (public.is_admin_or_editor());

-- ============================================================
-- 7. POLICIES PRO AREA_MISTECKA
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view area_mistecka" ON area_mistecka;
CREATE POLICY "Authenticated users can view area_mistecka"
    ON area_mistecka FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Admin and editors can insert area_mistecka" ON area_mistecka;
CREATE POLICY "Admin and editors can insert area_mistecka"
    ON area_mistecka FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Admin and editors can update area_mistecka" ON area_mistecka;
CREATE POLICY "Admin and editors can update area_mistecka"
    ON area_mistecka FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Admin and editors can delete area_mistecka" ON area_mistecka;
CREATE POLICY "Admin and editors can delete area_mistecka"
    ON area_mistecka FOR DELETE
    TO authenticated
    USING (public.is_admin_or_editor());

-- ============================================================
-- 8. POLICIES PRO PLACE_MISTECKA
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view place_mistecka" ON place_mistecka;
CREATE POLICY "Authenticated users can view place_mistecka"
    ON place_mistecka FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Anon can view shared place_mistecka" ON place_mistecka;
CREATE POLICY "Anon can view shared place_mistecka"
    ON place_mistecka FOR SELECT
    TO anon
    USING (
        EXISTS (
            SELECT 1 FROM shared_places
            WHERE shared_places.place_mistecka_id = place_mistecka.id
              AND shared_places.expires_at > NOW()
        )
    );

DROP POLICY IF EXISTS "Admin and editors can insert place_mistecka" ON place_mistecka;
CREATE POLICY "Admin and editors can insert place_mistecka"
    ON place_mistecka FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Admin and editors can update place_mistecka" ON place_mistecka;
CREATE POLICY "Admin and editors can update place_mistecka"
    ON place_mistecka FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Admin and editors can delete place_mistecka" ON place_mistecka;
CREATE POLICY "Admin and editors can delete place_mistecka"
    ON place_mistecka FOR DELETE
    TO authenticated
    USING (public.is_admin_or_editor());

-- ============================================================
-- 9. POLICIES PRO SHARED_PLACES
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view shared_places" ON shared_places;
CREATE POLICY "Authenticated users can view shared_places"
    ON shared_places FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Anon can view valid shared_places" ON shared_places;
CREATE POLICY "Anon can view valid shared_places"
    ON shared_places FOR SELECT
    TO anon
    USING (expires_at > NOW());

DROP POLICY IF EXISTS "Authenticated users can create shared_places" ON shared_places;
CREATE POLICY "Authenticated users can create shared_places"
    ON shared_places FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admin and editors can delete shared_places" ON shared_places;
CREATE POLICY "Admin and editors can delete shared_places"
    ON shared_places FOR DELETE
    TO authenticated
    USING (public.is_admin_or_editor());
