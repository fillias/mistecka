import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';
import { cacheLife, cacheTag } from 'next/cache';

export async function getAllMisteckaTypes() {
    'use cache';
    cacheTag('mistecka-types');
    cacheLife('hours');

    const supabase = createAdminClient();

    type MisteckaType = string;

    const { data, error } = await supabase
        .from('place_mistecka_types')
        .select('type')
        .order('type', { ascending: true });

    if (error) throw error;

    const misteckaTypes: MisteckaType[] = data.map((row) => row.type);

    if (error) throw error;
    return misteckaTypes ?? [];
}

export async function getAllMisteckaCountryNames() {
    'use cache';
    cacheTag('mistecka-all-countries');
    cacheLife('hours');

    const supabase = createAdminClient();

    type MisteckaCountry = string;

    const { data, error } = await supabase
        .from('country_mistecka_names')
        .select('name')
        .order('name', { ascending: true });

    if (error) throw error;

    const misteckaCountryNames: MisteckaCountry[] = data.map((row) => row.name);

    if (error) throw error;
    return misteckaCountryNames ?? [];
}

export async function getMisteckaByType(type: string) {
    const supabase = createAdminClient();

    const { data, error } = await supabase.from('place_mistecka').select('*').eq('type', type);

    if (error) throw error;
    return data ?? [];
}

async function getCountryById(id: number) {
    const supabase = createAdminClient();

    const { data, error } = await supabase.from('country_mistecka').select('name').eq('id', id);

    if (error) throw error;
    return data[0].name || null;
}

export async function getSearchedMisteckaByCountryAndType(countryId: number, type: string) {
    const supabase = createAdminClient();

    const countryName: string = await getCountryById(countryId);

    const { data, error } = await supabase
        .from('place_mistecka')
        .select('*')
        .eq('country_mistecka_id', countryId)
        .eq('type', type);

    if (error) throw error;

    return [countryName, data];
}

export async function getSearchedMisteckaByCountryName(countryName: string) {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('place_mistecka')
        .select(
            `
                *,
                country_mistecka!inner (
                    id,
                    name
                )
                `
        )
        .eq('country_mistecka.name', countryName);

    if (error) throw error;

    return data;
}

export async function getSearchedMisteckaByTypeAndCountryName(type: string, countryName: string) {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('place_mistecka')
        .select(
            `
                *,
                country_mistecka!inner (
                    id,
                    name
                )
                `
        )
        .eq('type', type)
        .eq('country_mistecka.name', countryName);

    if (error) throw error;

    return [countryName, data];
}

export async function getCountryNamesByType(type: string) {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('place_mistecka')
        .select(
            `
      country_mistecka!inner (
        name
      )
    `
        )
        .eq('type', type);

    if (error) throw error;

    const countryNames = [
        ...new Set(
            data?.map((item) => item.country_mistecka?.name).filter((name): name is string => Boolean(name)) ?? []
        )
    ];

    return countryNames;
}
