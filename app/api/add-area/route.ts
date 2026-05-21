import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
        const navSlug = String(body.navSlug);
        const countrySlug = String(body.countrySlug);
        const name = String(body.name ?? '').trim();
        const navId = Number(body.nav_id);
        const countryId = Number(body.country_id) || null;
        const slug = slugify(name);

        if (!name || !navId) {
            return NextResponse.json({ error: 'Chybí povinná data.' }, { status: 400 });
        }

        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('area')
            .insert({
                name,
                slug,
                country_id: countryId,
                nav_id: navId
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        revalidatePath(`/dashboard/${navSlug}`);

        // !countrySlug && revalidatePath(`/dashboard/${navSlug}`);

        return NextResponse.json(data, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Nepodařilo se vytvořit area.' }, { status: 500 });
    }
}
