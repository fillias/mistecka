import { createClient } from '@/lib/supabase/server';

export default async function hasAdminRole() {
    const supabase = await createClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    const roles: string[] = user?.app_metadata?.roles ?? [];
    const isAdmin = roles.includes('admin');

    return isAdmin;
}
