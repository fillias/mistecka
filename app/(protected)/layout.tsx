import DashboardNav from '@/components/DashboardNav';
import { Suspense } from 'react';
import Spinner from '../UI/Spinner';

import 'flag-icons/css/flag-icons.min.css';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <header className="topbar -mx-4 mb-4 px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="app-container px-0">
                    <div className="flex flex-col gap-3">
                        <Suspense fallback={<Spinner />}>{<DashboardNav />}</Suspense>
                    </div>
                </div>
            </header>
            <main className="page-stack">{children}</main>
        </>
    );
}

/*




    */
