import { createClient } from '@/lib/supabase/server';

export default async function userInfo() {
    const supabase = await createClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return { isAdmin: false, email: null };
    }

    const roles: string[] = user?.app_metadata?.roles ?? [];
    const isAdmin = roles.includes('admin');

    return { isAdmin, email: user.email };
}
