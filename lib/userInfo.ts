// lib/userInfo.ts
import 'server-only';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type UserInfo = {
    isAdmin: boolean;
    isEditor: boolean;
    email: string | null;
};

const getUserInfo = cache(async (): Promise<UserInfo> => {
    try {
        const supabase = await createClient();

        const { data } = await supabase.auth.getClaims();
        const claims = data?.claims ?? null;

        if (!claims) {
            return {
                isAdmin: false,
                isEditor: false,
                email: null
            };
        }

        const roles: string[] = claims.app_metadata?.roles ?? [];

        return {
            isAdmin: roles.includes('admin'),
            isEditor: roles.includes('editor'),
            email: claims.email ?? null
        };
    } catch {
        return {
            isAdmin: false,
            isEditor: false,
            email: null
        };
    }
});

export default getUserInfo;
