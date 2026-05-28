import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import userInfo from '@/lib/userInfo';
import { createAdminClient } from '@/lib/supabase/admin';

import { slugify } from '@/lib/utils';

export async function POST(req: NextRequest) {
    try {
        const user = await userInfo();

        if (!user.isAdmin && !user.isEditor) {
            return NextResponse.json({ error: 'Nemáte oprávnění.' }, { status: 403 });
        }

        /*
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim(),
                    navId,
                    areaId,
                    countryId,
                    navSlug,
                    countrySlug,
                    areaSlug,
                    type,
                    gps,
                    imageUrl
                })
        */

        const body = await req.json();
        const navSlug = String(body.navSlug);
        // const countrySlug = String(body.countrySlug);
        // const areaSlug = String(body.areaSlug);
        // const slug = slugify(name);
        const name = String(body.name ?? '').trim();
        const type = String(body.type);
        const gps = String(body.gps ?? '').trim();
        const description = String(body.description ?? '').trim();
        const imageUrl = String(body.imageUrl ?? '').trim();
        const navId = Number(body.navId);
        const countryId = Number(body.countryId) || null;
        const areaId = Number(body.areaId);

        if (!name || !navId) {
            return NextResponse.json({ error: 'Chybí povinná data.' }, { status: 400 });
        }

        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('place')
            .insert({
                place_name: name,
                place_type: type,
                place_description: description,
                place_gps_coords: gps,
                place_image_url: imageUrl,
                nav_id: navId,
                country_id: countryId,
                area_id: areaId
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        revalidateTag('navigation-data', 'max');

        // !countrySlug && revalidatePath(`/dashboard/${navSlug}`);

        return NextResponse.json(data, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Nepodařilo se vytvořit area.' }, { status: 500 });
    }
}
