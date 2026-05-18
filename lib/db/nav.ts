// src/lib/db/nav.ts
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/supabase';

export type MainNav = Tables<'main_nav'>;
export type Country = Tables<'country'>;
export type Area = Tables<'area'>;
export type Place = Tables<'place'>;

export async function getMainNav(): Promise<MainNav[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('main_nav').select('*').order('sort_order');

    if (error) {
        console.error('getMainNav:', error.message);
        return [];
    }
    return data ?? [];
}

export async function getNavBySlug(slug: string): Promise<MainNav | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('main_nav').select('*').eq('slug', slug).single();

    if (error) {
        console.error('getNavBySlug:', error.message);
        return null;
    }
    return data;
}

export async function getCountriesByNavId(navId: number): Promise<Country[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('country').select('*').eq('nav_id', navId).order('sort_order');

    if (error) {
        console.error('getCountriesByNavId:', error.message);
        return [];
    }
    return data ?? [];
}

export async function getCountryBySlug(slug: string): Promise<Country | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('country').select('*').eq('slug', slug).single();

    if (error) {
        console.error('getCountryBySlug:', error.message);
        return null;
    }
    return data;
}

export async function getAreasByNavId(navId: number): Promise<Area[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('area').select('*').eq('nav_id', navId).order('sort_order');

    if (error) {
        console.error('getAreasByNavId:', error.message);
        return [];
    }
    return data ?? [];
}

export async function getAreasByCountryId(countryId: number): Promise<Area[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('area').select('*').eq('country_id', countryId).order('sort_order');

    if (error) {
        console.error('getAreasByCountryId:', error.message);
        return [];
    }
    return data ?? [];
}

export async function getAreaBySlug(slug: string): Promise<Area | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('area').select('*').eq('slug', slug).single();

    if (error) {
        console.error('getAreaBySlug:', error.message);
        return null;
    }
    return data;
}

export async function getPlacesByAreaId(areaId: number): Promise<Place[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('place').select('*').eq('area_id', areaId).order('place_name');

    if (error) {
        console.error('getPlacesByAreaId:', error.message);
        return [];
    }
    return data ?? [];
}
