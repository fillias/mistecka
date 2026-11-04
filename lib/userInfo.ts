// lib/userInfo.ts
import 'server-only';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type UserInfo = {
    isAdmin: boolean;
    isEditor: boolean;
    email: string | null;
    userId: string | null;
};

const getUserInfo = cache(async (): Promise<UserInfo> => {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error
        } = await supabase.auth.getUser();

        if (error || !user) {
            return {
                isAdmin: false,
                isEditor: false,
                email: null,
                userId: null
            };
        }

        const roles: string[] = user.app_metadata?.roles ?? [];

        return {
            isAdmin: roles.includes('admin'),
            isEditor: roles.includes('editor'),
            email: user.email ?? null,
            userId: user.id
        };
    } catch {
        return {
            isAdmin: false,
            isEditor: false,
            email: null,
            userId: null
        };
    }
});

export default getUserInfo;
