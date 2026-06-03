import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient as createUserClient } from '@/lib/supabase/server';

function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Missing Supabase admin environment variables');
    }

    return createAdminClient(supabaseUrl, serviceRoleKey);
}

async function requireEditorOrAdmin() {
    const supabase = await createUserClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    const roles: string[] = user?.app_metadata?.roles ?? [];

    if (!user || (!roles.includes('admin') && !roles.includes('editor'))) {
        return null;
    }

    return user;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await requireEditorOrAdmin();

    if (!user) {
        return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => null);

    const name = body?.name?.trim();
    const type = body?.type ?? null;
    const description = body?.description ?? null;
    const image_url = body?.image_url ?? null;
    const gps_coords = body?.gps_coords ?? null;
    const kind = body?.kind;

    if (!kind) {
        return NextResponse.json({ ok: false, error: 'Missing kind' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();

    const { data, error } = await admin
        .from(`place_${kind}`)
        .update({
            name,
            type,
            description,
            image_url,
            gps_coords
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, place: data });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const body = await _req.json().catch(() => null);

    const kind = body?.kind;

    if (!kind) {
        return NextResponse.json({ ok: false, error: 'Missing kind' }, { status: 400 });
    }

    const supabase = await createUserClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    const roles: string[] = user?.app_metadata?.roles ?? [];

    if (!user || (!roles.includes('admin') && !roles.includes('editor'))) {
        return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const admin = getSupabaseAdmin();
    const { error } = await admin.from(`place_${kind}`).delete().eq('id', id);

    if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
}
