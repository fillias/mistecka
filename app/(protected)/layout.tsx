import { getMainNav } from '@/lib/db/nav';
import DashboardNav from '@/components/DashboardNav';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const navItems = await getMainNav();

    return (
        <>
            <div className="page-section">
                <header className="topbar -mx-4 mb-4 px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="app-container px-0">
                        <div className="flex flex-col gap-3">
                            <DashboardNav items={navItems} />
                        </div>
                    </div>
                </header>

                <main className="page-stack">{children}</main>
            </div>
        </>
    );
}
