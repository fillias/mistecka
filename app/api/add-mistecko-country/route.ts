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
        const navSlug = String(body.navSlug);
        const name = String(body.name ?? '').trim();
        const code = String(body.code ?? '')
            .trim()
            .toUpperCase();
        const navId = Number(body.nav_id);
        const slug = slugify(name);

        if (!name || !code || !navId) {
            return NextResponse.json({ error: 'Chybí povinná data.' }, { status: 400 });
        }

        if (!/^[A-Z]{2}$/.test(code)) {
            return NextResponse.json({ error: 'Kód země musí mít 2 písmena, např. CZ.' }, { status: 400 });
        }

        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('country_mistecka')
            .insert({
                name,
                slug,
                code,
                mistecka_id: navId
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        revalidateTag('navigation-data', { expire: 0 });

        return NextResponse.json(data, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Nepodařilo se vytvořit zemi.' }, { status: 500 });
    }
}
