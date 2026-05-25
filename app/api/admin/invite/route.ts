import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient as createUserClient } from '@/lib/supabase/server';
import { assertSameOrigin } from '@/lib/csrf';

function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Missing Supabase admin environment variables');
    }

    return createAdminClient(supabaseUrl, serviceRoleKey);
}

export async function POST(req: NextRequest) {
    try {
        assertSameOrigin(req);

        const supabase = await createUserClient();
        const {
            data: { user }
        } = await supabase.auth.getUser();

        const roles: string[] = user?.app_metadata?.roles ?? [];

        if (!user || !roles.includes('admin')) {
            return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json().catch(() => null);
        const email = body?.email?.trim()?.toLowerCase();

        if (!email) {
            return NextResponse.json({ ok: false, error: 'Missing email' }, { status: 400 });
        }
        const origin = req.nextUrl.origin;
        const supabaseAdmin = getSupabaseAdmin();

        const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
            redirectTo: `${origin}/invite/accept`
        });

        if (error) {
            return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
        }

        return NextResponse.json({
            ok: true,
            invitedUserId: data.user?.id ?? null,
            email
        });
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                error: error instanceof Error ? error.message : 'Invite failed'
            },
            { status: 500 }
        );
    }
}
