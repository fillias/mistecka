// lib/userInfo.ts
import 'server-only';

import { createClient } from '@/lib/supabase/server';

export type UserInfo = {
    isAdmin: boolean;
    isEditor: boolean;
    email: string | null;
};

export default async function userInfo(): Promise<UserInfo> {
    const supabase = await createClient();

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            isAdmin: false,
            isEditor: false,
            email: null
        };
    }

    const roles: string[] = user.app_metadata?.roles ?? [];

    return {
        isAdmin: roles.includes('admin'),
        isEditor: roles.includes('editor'),
        email: user.email ?? null
    };
}
