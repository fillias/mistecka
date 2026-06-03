import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import userInfo from '@/lib/userInfo';
import { createAdminClient } from '@/lib/supabase/admin';
import { s3, S3_BUCKET_UPLOAD } from '@/lib/s3';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

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
        const loupenickaId = Number(formData.get('loupenickaId'));
        const image = formData.get('image');

        if (!name || !loupenickaId) {
            return NextResponse.json({ error: 'Chybí povinná data.' }, { status: 400 });
        }

        if (!(image instanceof File)) {
            return NextResponse.json({ error: 'Soubor chybí.' }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(image.type)) {
            return NextResponse.json({ error: 'Povoleny jsou jen JPG, PNG a WEBP.' }, { status: 400 });
        }

        if (image.size > MAX_SIZE) {
            return NextResponse.json({ error: 'Soubor je větší než 5 MB.' }, { status: 400 });
        }

        // Upload do S3
        const ext = image.name.split('.').pop()?.toLowerCase() ?? 'jpg';
        const key = `loupenicka/${loupenickaId}/${crypto.randomUUID()}.${ext}`;
        const buffer = Buffer.from(await image.arrayBuffer());

        await s3.send(
            new PutObjectCommand({
                Bucket: S3_BUCKET_UPLOAD,
                Key: key,
                Body: buffer,
                ContentType: image.type
            })
        );

        const imageUrl = `https://${S3_BUCKET_UPLOAD}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        // Zápis do Supabase
        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('place_loupenicka')
            .insert({
                name,
                type,
                description,
                gps_coords: gps,
                image_url: imageUrl,
                loupenicka_id: loupenickaId
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        revalidateTag('navigation-data', 'max');

        return NextResponse.json(data, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Nepodařilo se vytvořit místo.' }, { status: 500 });
    }
}
