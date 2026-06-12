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

        const body = await req.json();
        const name = String(body.name ?? '').trim();
        const misteckaId = Number(body.mistecka_id);
        const countryId = Number(body.country_id) || null;
        const slug = slugify(name);

        if (!name || !misteckaId) {
            return NextResponse.json({ error: 'Chybí povinná data.' }, { status: 400 });
        }

        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('area_mistecka')
            .insert({
                name,
                slug,
                country_mistecka_id: countryId,
                mistecka_id: misteckaId
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        revalidateTag('navigation-data', { expire: 0 });

        return NextResponse.json(data, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Nepodařilo se vytvořit area.' }, { status: 500 });
    }
}
