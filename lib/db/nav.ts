// lib/db/nav.ts
import 'server-only';
import { unstable_cache } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';

async function fetchNavigationData() {
    const supabase = createAdminClient();

    const [mainNavRes, countriesRes, areasRes] = await Promise.all([
        supabase.from('main_nav').select('id, name, slug, sort_order').order('sort_order', { ascending: true }),
        supabase.from('country').select('id, name, code, slug, nav_id').order('name'),
        supabase.from('area').select('id, name, slug, nav_id, country_id').order('name')
    ]);

    if (mainNavRes.error) throw mainNavRes.error;
    if (countriesRes.error) throw countriesRes.error;
    if (areasRes.error) throw areasRes.error;

    return {
        mainNav: mainNavRes.data ?? [],
        countries: countriesRes.data ?? [],
        areas: areasRes.data ?? []
    };
}

// hlavni navigaci zacachujem at se furt nedoptava db
export const getNavigationData = unstable_cache(fetchNavigationData, ['navigation-data'], {
    revalidate: 3600,
    tags: ['navigation-data']
});

// Volitelné helpery nad jedním společným zdrojem

export async function getAreasById(navId: string, countryId: string | null) {
    const data = await getNavigationData();
    if (countryId) {
        return data.areas.filter((item) => item.nav_id === navId && item.country_id === countryId);
    } else {
        return data.areas.filter((item) => item.nav_id === navId);
    }
}

export async function getNavBySlug(slug: string) {
    const data = await getNavigationData();
    return data.mainNav.find((item) => item.id === getLeadingNumber(slug)) ?? null;
}

export async function getCountryBySlug(slug: string) {
    const data = await getNavigationData();
    return data.countries.find((item) => item.id === getLeadingNumber(slug)) ?? null;
}

export async function getAreaBySlug(slug: string) {
    const data = await getNavigationData();
    return data.areas.find((item) => item.id === getLeadingNumber(slug)) ?? null;
}

export async function getCountriesByNavId(navId: string) {
    const data = await getNavigationData();
    return data.countries.filter((item) => item.nav_id === navId);
}

export async function getPlacesById(navId: number, countryId: number | null, areaId: number) {
    const supabase = await createAdminClient();

    let query = supabase.from('place').select('*').eq('nav_id', navId).eq('area_id', areaId);

    query = countryId === null ? query.is('country_id', null) : query.eq('country_id', countryId);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
}

function getLeadingNumber(str) {
    const match = str.match(/^(\d+)-/);
    return match ? parseInt(match[1], 10) : null;
}
