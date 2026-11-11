import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import userInfo from '@/lib/userInfo';
import { S3_BUCKET_RESIZED, keyFromUrl, deleteS3Objects, processAndUploadPlaceImage } from '@/lib/s3';

function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Missing Supabase admin environment variables');
    }

    return createAdminClient(supabaseUrl, serviceRoleKey);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await userInfo();

        if (!user.isAdmin && !user.isEditor) {
            return NextResponse.json({ error: 'Nemáte oprávnění.' }, { status: 403 });
        }

        const { id: placeId } = await params;

        const formData = await req.formData();

        const name = String(formData.get('name') ?? '').trim();
        const type = String(formData.get('type') ?? '').trim();
        const gps_coords = String(formData.get('gps_coords') ?? '').trim();
        const kind = String(formData.get('kind'));
        const description = String(formData.get('description') ?? '').trim();
        const image = formData.get('image');

        const loupenicka_id = String(formData.get('loupenicka_id'));
        const mistecka_id = String(formData.get('mistecka_id'));
        const country_mistecka_id = String(formData.get('country_mistecka_id'));
        const area_mistecka_id = String(formData.get('area_mistecka_id'));

        const updatePlaceObject: Record<string, string> = {
            name,
            type,
            description,
            gps_coords
        };

        if (image) {
            const folderPath =
                kind === 'loupenicka'
                    ? `loupenicka/A-${loupenicka_id}`
                    : `mistecka/M-${mistecka_id}/C-${country_mistecka_id}/A-${area_mistecka_id}`;

            const result = await processAndUploadPlaceImage({ file: image, name, folderPath });
            updatePlaceObject.large_image_url = result.largeImageUrl;
            updatePlaceObject.small_image_url = result.smallImageUrl;
        }

        if (kind === 'loupenicka') {
            updatePlaceObject.loupenicka_id = loupenicka_id;
        }

        if (kind === 'mistecka') {
            updatePlaceObject.mistecka_id = mistecka_id;
            updatePlaceObject.country_mistecka_id = country_mistecka_id;
            updatePlaceObject.area_mistecka_id = area_mistecka_id;
        }

        const admin = getSupabaseAdmin();

        if (image) {
            const { data: existing } = await admin
                .from(`place_${kind}`)
                .select('small_image_url, large_image_url')
                .eq('id', placeId)
                .single();

            if (existing) {
                const oldKeys = [
                    existing.small_image_url ? keyFromUrl(existing.small_image_url) : null,
                    existing.large_image_url ? keyFromUrl(existing.large_image_url) : null
                ].filter((k): k is string => k !== null);

                await deleteS3Objects(S3_BUCKET_RESIZED, oldKeys);
            }
        }

        const { data, error } = await admin
            .from(`place_${kind}`)
            .update(updatePlaceObject)
            .eq('id', placeId)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
        }

        revalidateTag('navigation-data', { expire: 0 });

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Nepodařilo se vytvořit místo.' },
            { status: 500 }
        );
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: placeId } = await params;
    const body = await _req.json().catch(() => null);

    const kind = body?.kind;

    if (!kind) {
        return NextResponse.json({ ok: false, error: 'Missing kind' }, { status: 400 });
    }

    const user = await userInfo();

    if (!user.isAdmin && !user.isEditor) {
        return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    const admin = getSupabaseAdmin();

    // Načteme URLs obrázků před smazáním záznamu
    const { data: existing } = await admin
        .from(`place_${kind}`)
        .select('small_image_url, large_image_url')
        .eq('id', placeId)
        .single();

    const { error } = await admin.from(`place_${kind}`).delete().eq('id', placeId);

    // Smazat resized obrázky z S3
    if (existing) {
        const oldKeys = [
            existing.small_image_url ? keyFromUrl(existing.small_image_url) : null,
            existing.large_image_url ? keyFromUrl(existing.large_image_url) : null
        ].filter((k): k is string => k !== null);

        await deleteS3Objects(S3_BUCKET_RESIZED, oldKeys);
    }

    if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
}
