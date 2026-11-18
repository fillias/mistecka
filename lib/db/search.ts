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
