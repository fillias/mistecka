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
