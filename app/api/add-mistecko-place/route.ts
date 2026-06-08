import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import userInfo from '@/lib/userInfo';
import { createAdminClient } from '@/lib/supabase/admin';
import { s3, S3_BUCKET_UPLOAD, S3_BUCKET_RESIZED } from '@/lib/s3';
import { slugify } from '@/lib/utils';

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

export async function POST(req: NextRequest) {
    try {
        const user = await userInfo();

        if (!user.isAdmin && !user.isEditor) {
            return NextResponse.json({ error: 'Nemáte oprávnění.' }, { status: 403 });
        }

        const formData = await req.formData();

        const name = String(formData.get('name') ?? '').trim();
        const type = String(formData.get('type') ?? '').trim();
        const gps = String(formData.get('gps') ?? '').trim();
        const description = String(formData.get('description') ?? '').trim();
        const misteckaId = Number(formData.get('misteckaId'));
        const countryId = Number(formData.get('countryId'));
        const areaId = Number(formData.get('areaId'));
        const image = formData.get('image');

        if (!name || !misteckaId) {
            return NextResponse.json({ error: 'Chybí povinná data.' }, { status: 400 });
        }

        let smallImageUrl: string, largeImageUrl: string;

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
            const uploadKey = `mistecka/M-${misteckaId}/C-${countryId}/A-${areaId}/${fileId}.${ext}`;
            const buffer = Buffer.from(await image.arrayBuffer());

            await s3.send(
                new PutObjectCommand({
                    Bucket: S3_BUCKET_UPLOAD,
                    Key: uploadKey,
                    Body: buffer,
                    ContentType: image.type
                })
            );

            const resizedBase = `mistecka/M-${misteckaId}/C-${countryId}/A-${areaId}/resized`;
            const smallKey = `${resizedBase}/small/${fileId}.webp`;
            const largeKey = `${resizedBase}/large/${fileId}.webp`;

            const resizedReady = await waitForResizedImages(S3_BUCKET_RESIZED, [smallKey, largeKey], 20000, 1000);

            if (!resizedReady) {
                return NextResponse.json({ error: 'Obrázek se neresizoval včas. Zkuste to znovu.' }, { status: 504 });
            }

            largeImageUrl = `https://${S3_BUCKET_RESIZED}.s3.${process.env.MISTECKA_AWS_REGION}.amazonaws.com/${largeKey}`;
            smallImageUrl = `https://${S3_BUCKET_RESIZED}.s3.${process.env.MISTECKA_AWS_REGION}.amazonaws.com/${smallKey}`;
        } else {
            largeImageUrl = `https://placehold.co/1600x900/1d4ed8/ffffff.webp?text=${slugify(name)}`;
            smallImageUrl = `https://placehold.co/400x225/2563eb/ffffff.webp?text=${slugify(name)}`;
        }

        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('place_mistecka')
            .insert({
                name: name,
                type: type,
                description: description,
                gps_coords: gps,
                mistecka_id: misteckaId,
                country_mistecka_id: countryId,
                area_mistecka_id: areaId,
                large_image_url: largeImageUrl,
                small_image_url: smallImageUrl
            })
            .select()
            .single();

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
