import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
            error
        } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({
            ok: true,
            user: {
                id: user.id,
                email: user.email,
                roles: user.app_metadata?.roles ?? []
            }
        });
    } catch (error) {
        return NextResponse.json({ ok: false, error: 'Identity check failed' }, { status: 500 });
    }
}
