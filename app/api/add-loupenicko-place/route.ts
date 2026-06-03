import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import userInfo from '@/lib/userInfo';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
    try {
        const user = await userInfo();

        if (!user.isAdmin && !user.isEditor) {
            return NextResponse.json({ error: 'Nemáte oprávnění.' }, { status: 403 });
        }

        const body = await req.json();
        const name = String(body.name ?? '').trim();
        const type = String(body.type);
        const gps = String(body.gps ?? '').trim();
        const description = String(body.description ?? '').trim();
        const imageUrl = String(body.imageUrl ?? '').trim();
        const loupenickaId = Number(body.loupenickaId);

        if (!name || !loupenickaId) {
            return NextResponse.json({ error: 'Chybí povinná data.' }, { status: 400 });
        }

        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('place_loupenicka')
            .insert({
                name: name,
                type: type,
                description: description,
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
        return NextResponse.json({ error: 'Nepodařilo se vytvořit area.' }, { status: 500 });
    }
}
