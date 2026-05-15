import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { assertSameOrigin } from '@/lib/csrf';

export async function POST(req: NextRequest) {
    try {
        assertSameOrigin(req);

        const supabase = await createClient();
        await supabase.auth.signOut();

        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json(
            { ok: false, error: error instanceof Error ? error.message : 'Logout failed' },
            { status: 403 }
        );
    }
}
