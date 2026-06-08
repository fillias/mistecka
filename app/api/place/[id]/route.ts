// import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient as createUserClient } from '@/lib/supabase/server';

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import userInfo from '@/lib/userInfo';

import { s3, S3_BUCKET_UPLOAD, S3_BUCKET_RESIZED } from '@/lib/s3';
import { slugify } from '@/lib/utils';

function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Missing Supabase admin environment variables');
    }

    return createAdminClient(supabaseUrl, serviceRoleKey);
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function objectExists(bucket: string, key: string) {
    try {
        await s3.send(
            new HeadObjectCommand({
                Bucket: bucket,
                Key: key
            })
        );
        return true;
    } catch {
        return false;
    }
}

// Poll S3 with HeadObject until both small and large exist.
async function waitForResizedImages(bucket: string, keys: string[], timeoutMs = 15000, intervalMs = 500) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
        const results = await Promise.all(keys.map((key) => objectExists(bucket, key)));

        if (results.every(Boolean)) {
            return true;
        }

        await sleep(intervalMs);
    }

    return false;
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

        console.log('kind: ', kind);
        console.log('formData: ', formData);
        console.log('placeId: ', placeId);

        const updatePlaceObject: Record<string, string> = {
            name,
            type,
            description,
            gps_coords
        };

        if (image) {
            if (!(image instanceof File)) {
                return NextResponse.json({ error: 'Soubor chybí.' }, { status: 400 });
            }

            if (!ALLOWED_TYPES.includes(image.type)) {
                return NextResponse.json({ error: 'Povoleny jsou jen JPG, PNG a WEBP.' }, { status: 400 });
            }

            if (image.size > MAX_SIZE) {
                return NextResponse.json({ error: 'Soubor je větší než 5 MB.' }, { status: 400 });
            }

            const ext = image.name.split('.').pop()?.toLowerCase() ?? 'jpg';
            const fileId = `${slugify(name)}-${crypto.randomUUID()}`;

            const uploadLoupenickaKey = `loupenicka/A-${loupenicka_id}/${fileId}.${ext}`;
            const uploadMisteckaKey = `mistecka/M-${mistecka_id}/C-${country_mistecka_id}/A-${area_mistecka_id}/${fileId}.${ext}`;

            const uploadKey = kind === 'loupenicka' ? uploadLoupenickaKey : uploadMisteckaKey;

            const buffer = Buffer.from(await image.arrayBuffer());

            await s3.send(
                new PutObjectCommand({
                    Bucket: S3_BUCKET_UPLOAD,
                    Key: uploadKey,
                    Body: buffer,
                    ContentType: image.type
                })
            );

            const resizedMisteckaBase = `mistecka/M-${mistecka_id}/C-${country_mistecka_id}/A-${area_mistecka_id}/resized`;
            const resizedLoupenickaBase = `loupenicka/A-${loupenicka_id}/resized`;

            const resizedBase = kind === 'loupenicka' ? resizedLoupenickaBase : resizedMisteckaBase;

            const smallKey = `${resizedBase}/small/${fileId}.webp`;
            const largeKey = `${resizedBase}/large/${fileId}.webp`;

            const resizedReady = await waitForResizedImages(S3_BUCKET_RESIZED, [smallKey, largeKey], 20000, 1000);

            if (!resizedReady) {
                return NextResponse.json({ error: 'Obrázek se neresizoval včas. Zkuste to znovu.' }, { status: 504 });
            }

            updatePlaceObject.large_image_url = placeId.largeIm;
            updatePlaceObject.small_image_url = `https://${S3_BUCKET_RESIZED}.s3.${process.env.MISTECKA_AWS_REGION}.amazonaws.com/${smallKey}`;
        }

        kind === 'loupenicka' && (updatePlaceObject.loupenicka_id = loupenicka_id);

        if (kind === 'mistecka') {
            updatePlaceObject.mistecka_id = mistecka_id;
            updatePlaceObject.country_mistecka_id = country_mistecka_id;
            updatePlaceObject.area_mistecka_id = area_mistecka_id;
        }

        console.log('updatePlaceObject: ', updatePlaceObject);

        const admin = getSupabaseAdmin();

        const { data, error } = await admin
            .from(`place_${kind}`)
            .update(updatePlaceObject)
            .eq('id', placeId)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
        }

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        revalidateTag('navigation-data', 'max');

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Nepodařilo se vytvořit místo.' },
            { status: 500 }
        );
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // TODO delete file z aws

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
