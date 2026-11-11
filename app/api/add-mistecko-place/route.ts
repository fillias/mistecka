import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import userInfo from '@/lib/userInfo';
import { createAdminClient } from '@/lib/supabase/admin';
import { processAndUploadPlaceImage, getPlaceholderImageUrls } from '@/lib/s3';

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

        let smallImageUrl: string;
        let largeImageUrl: string;

        if (image) {
            const folderPath = `mistecka/M-${misteckaId}/C-${countryId}/A-${areaId}`;
            const result = await processAndUploadPlaceImage({ file: image, name, folderPath });
            smallImageUrl = result.smallImageUrl;
            largeImageUrl = result.largeImageUrl;
        } else {
            const placeholders = getPlaceholderImageUrls(name);
            smallImageUrl = placeholders.smallImageUrl;
            largeImageUrl = placeholders.largeImageUrl;
        }

        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('place_mistecka')
            .insert({
                name,
                type,
                description,
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

        revalidateTag('navigation-data', { expire: 0 });

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Nepodařilo se vytvořit místo.' },
            { status: 500 }
        );
    }
}
