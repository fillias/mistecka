// lib/db/nav.ts
import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { sleep } from '../utils';

export async function getNavigationData() {
    'use cache';

    cacheTag('navigation-data');
    cacheLife('hours');

    // const fetchedAt = new Date().toISOString();
    // console.log('[nav] DB fetch at:', fetchedAt);

    const supabase = createAdminClient();

    const [loupenickaRes, misteckaRes, countryMisteckaRes, areaMisteckaRes] = await Promise.all([
        supabase.from('loupenicka').select('id, name, slug, sort_order').order('sort_order', { ascending: true }),
        supabase.from('mistecka').select('id, name, slug, sort_order').order('sort_order', { ascending: true }),
        supabase
            .from('country_mistecka')
            .select('id, mistecka_id, name, slug, code')
            .order('name', { ascending: true }),
        supabase
            .from('area_mistecka')
            .select('id, mistecka_id, country_mistecka_id, name, slug')
            .order('name', { ascending: true })
    ]);

    if (loupenickaRes.error) throw loupenickaRes.error;
    if (misteckaRes.error) throw misteckaRes.error;
    if (countryMisteckaRes.error) throw countryMisteckaRes.error;
    if (areaMisteckaRes.error) throw areaMisteckaRes.error;

    return {
        loupenicka: loupenickaRes.data ?? [],
        mistecka: misteckaRes.data ?? [],
        countryMistecka: countryMisteckaRes.data ?? [],
        areaMistecka: areaMisteckaRes.data ?? []
        // __debugFetchedAt: fetchedAt
    };
}

// ============================================================
// ROOT NAV
// ============================================================

export async function getAllRootNav() {
    const data = await getNavigationData();

    return [
        ...data.loupenicka.map((item) => ({
            ...item,
            kind: 'loupenicka' as const
        })),
        ...data.mistecka.map((item) => ({
            ...item,
            kind: 'mistecka' as const
        }))
    ].sort((a, b) => a.sort_order - b.sort_order);
}

export async function getLoupenicka() {
    await sleep(2000);
    const data = await getNavigationData();
    return data.loupenicka;
}

export async function getMistecka() {
    const data = await getNavigationData();
    return data.mistecka;
}

export async function getLoupenickaBySlug(slug: string) {
    await sleep(2000);
    const data = await getNavigationData();
    return data.loupenicka.find((item) => item.slug === slug) ?? null;
}

export async function getMisteckaBySlug(slug: string) {
    const data = await getNavigationData();
    return data.mistecka.find((item) => item.slug === slug) ?? null;
}

// ============================================================
// LOUPENICKA
// ============================================================

export async function getPlacesByLoupenickaId(loupenickaId: number | string) {
    await sleep(2000);
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('place_loupenicka')
        .select('*')
        .eq('loupenicka_id', loupenickaId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
}

// ============================================================
// MISTECKA
// ============================================================

export async function getCountriesByMisteckaId(misteckaId: number | string) {
    const data = await getNavigationData();
    return data.countryMistecka.filter((item) => String(item.mistecka_id) === String(misteckaId));
}

export async function getCountryMisteckaBySlug(misteckaId: number | string, slug: string) {
    const data = await getNavigationData();
    return (
        data.countryMistecka.find((item) => String(item.mistecka_id) === String(misteckaId) && item.slug === slug) ??
        null
    );
}

export async function getAreasByCountryMisteckaId(countryMisteckaId: number | string) {
    const data = await getNavigationData();
    return data.areaMistecka.filter((item) => String(item.country_mistecka_id) === String(countryMisteckaId));
}

export async function getAreaMisteckaBySlug(countryMisteckaId: number | string, slug: string) {
    const data = await getNavigationData();
    return (
        data.areaMistecka.find(
            (item) => String(item.country_mistecka_id) === String(countryMisteckaId) && item.slug === slug
        ) ?? null
    );
}

export async function getPlacesByAreaMisteckaId(areaMisteckaId: number | string) {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('place_mistecka')
        .select('*')
        .eq('area_mistecka_id', areaMisteckaId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
}
