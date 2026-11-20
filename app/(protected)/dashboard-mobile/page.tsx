import { Suspense } from 'react';
import Image from 'next/image';

import DashboarNavMobileHP from '../../../components/DashboardNavMobileHP';

export default function MobileHome() {
    return (
        <section className="relative min-h-[70dvh]  overflow-hidden py-10 sm:min-h-[70dvh] sm:py-16">
            <Image src="/images/les.jpg" alt="" fill priority className="pointer-events-none object-cover opacity-40" />
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(to bottom, rgba(15,23,42,0.35), rgba(15,23,42,0.55))'
                }}
            />
            <div className="grid gap-3 relative z-10 p-2">
                {<Suspense fallback={null}>{<DashboarNavMobileHP />}</Suspense>}
            </div>
        </section>
    );
}
