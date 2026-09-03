// lib/userInfo.ts
import 'server-only';

import { cache } from 'react';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export type UserInfo = {
    isAdmin: boolean;
    isEditor: boolean;
    email: string | null;
};

const getUserInfo = cache(async (): Promise<UserInfo> => {
    try {
        const headerList = await headers();
        const userEmail = headerList.get('x-user-email');
        const userRolesHeader = headerList.get('x-user-roles');

        if (userEmail !== null && userRolesHeader !== null) {
            let roles: string[] = [];
            try {
                roles = JSON.parse(userRolesHeader);
            } catch {
                roles = [];
            }
            return {
                isAdmin: roles.includes('admin'),
                isEditor: roles.includes('editor'),
                email: userEmail || null
            };
        }
    } catch {
        // Fallback to Supabase Auth API if headers() fail or are missing
    }

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
});

export default getUserInfo;
