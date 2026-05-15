import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { assertSameOrigin } from '@/lib/csrf';

export async function POST(req: NextRequest) {
    try {
        assertSameOrigin(req);

        const body = await req.json().catch(() => null);
        const { email, password } = body ?? {};

        if (!email || !password) {
            return NextResponse.json({ ok: false, error: 'Missing email or password' }, { status: 400 });
        }

        const supabase = await createClient();
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
            return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
        }

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { ok: false, error: error instanceof Error ? error.message : 'Signup failed' },
            { status: 403 }
        );
    }
}
