// app/api/admin/set-role/route.ts

/* pro rucni setnuti roli uzivatelu */

/*
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ← service role, ne anon key
);

export async function POST(req: NextRequest) {
    const { userId, role } = await req.json();

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        app_metadata: { roles: [role] }
    });

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
}
*/

/* 
export {}; 
tohle je tu kvuli tomu 
aby prosel build v netlify kdyz je vse zacommentovane
*/

export {};
