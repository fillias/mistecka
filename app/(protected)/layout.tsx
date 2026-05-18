// app/(protected)/dashboard/layout.tsx
import { getMainNav } from '@/lib/db/nav';
import DashboardNav from '@/components/DashboardNav';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const navItems = await getMainNav();

    return (
        <div>
            <header>
                <DashboardNav items={navItems} />
            </header>
            <main>{children}</main>
        </div>
    );
}
