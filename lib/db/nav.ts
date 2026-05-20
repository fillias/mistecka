// lib/db/nav.ts
import 'server-only';
import { unstable_cache } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';

async function fetchNavigationData() {
    const supabase = createAdminClient();

    const [mainNavRes, countriesRes, areasRes] = await Promise.all([
        supabase.from('main_nav').select('id, name, slug, sort_order').order('sort_order', { ascending: true }),
        supabase.from('country').select('id, name, slug, nav_id').order('name'),
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
export async function getMainNav() {
    const data = await getNavigationData();
    return data.mainNav;
}

export async function getCountries() {
    const data = await getNavigationData();
    return data.countries;
}

export async function getAreas() {
    const data = await getNavigationData();
    return data.areas;
}

export async function getNavBySlug(slug: string) {
    const data = await getNavigationData();
    return data.mainNav.find((item) => item.slug === slug) ?? null;
}

export async function getCountryBySlug(slug: string) {
    const data = await getNavigationData();
    return data.countries.find((item) => item.slug === slug) ?? null;
}

export async function getAreaBySlug(slug: string) {
    const data = await getNavigationData();
    return data.areas.find((item) => item.slug === slug) ?? null;
}

export async function getCountriesByNavId(navId: string) {
    const data = await getNavigationData();
    return data.countries.filter((item) => item.nav_id === navId);
}

export async function getAreasByNavId(navId: string) {
    const data = await getNavigationData();
    return data.areas.filter((item) => item.nav_id === navId);
}

export async function getAreasByCountryId(countryId: string) {
    const data = await getNavigationData();
    return data.areas.filter((item) => item.country_id === countryId);
}

export async function getPlacesByAreaId(areaId: number) {
    const supabase = await createAdminClient();
    const { data, error } = await supabase.from('place').select('*').eq('area_id', areaId).order('place_name');

    if (error) throw error;
    return data ?? [];
}
