import { NextRequest, NextResponse } from 'next/server';
import userInfo from '@/lib/userInfo';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
    try {
        const user = await userInfo();

        if (!user.email) {
            return NextResponse.json({ error: 'Nemáte oprávnění.' }, { status: 401 });
        }

        const body = await req.json().catch(() => null);
        if (!body) {
            return NextResponse.json({ error: 'Chybí tělo požadavku.' }, { status: 400 });
        }

        const { placeId, kind } = body;
        if (!placeId || !kind || (kind !== 'loupenicka' && kind !== 'mistecka')) {
            return NextResponse.json({ error: 'Chybí povinné parametry (placeId, kind).' }, { status: 400 });
        }

        const supabase = createAdminClient();

        // 1. Zkontrolujeme, zda cílové místo vůbec existuje
        const tableName = kind === 'loupenicka' ? 'place_loupenicka' : 'place_mistecka';
        const { data: place, error: placeError } = await supabase
            .from(tableName)
            .select('id')
            .eq('id', placeId)
            .single();

        if (placeError || !place) {
            return NextResponse.json({ error: 'Místo neexistuje.' }, { status: 404 });
        }

        // 2. Vložíme nový odkaz
        const { data: shared, error: insertError } = await supabase
            .from('shared_places')
            .insert({
                kind,
                place_loupenicka_id: kind === 'loupenicka' ? placeId : null,
                place_mistecka_id: kind === 'mistecka' ? placeId : null
            })
            .select()
            .single();

        if (insertError || !shared) {
            return NextResponse.json({ error: insertError?.message || 'Nepodařilo se vytvořit odkaz.' }, { status: 500 });
        }

        const origin = req.nextUrl.origin;
        const shareUrl = `${origin}/shared/${shared.id}`;

        return NextResponse.json({ ok: true, shareUrl, expiresAt: shared.expires_at }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Nastala neočekávaná chyba.' },
            { status: 500 }
        );
    }
}
