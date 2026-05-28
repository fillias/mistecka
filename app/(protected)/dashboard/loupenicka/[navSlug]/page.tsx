// app/dashboard/loupenicka/[navSlug]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getLoupenickaBySlug } from '@/lib/db/nav';

import PlacesList from './PlacesList';
import Spinner from '@/app/UI/Spinner';

type Props = {
    params: Promise<{ navSlug: string }>;
};

export default async function DashboardLoupenickaDetailPage({ params }: Props) {
    const { navSlug } = await params;

    const loupenicka = await getLoupenickaBySlug(navSlug);

    if (!loupenicka) notFound();

    return (
        <div className="page-stack">
            <div className="card">
                <span className="eyebrow mb-3 block">Loupeníčko</span>
                <h2 className="mb-1">{loupenicka.name}</h2>
                <p>Seznam míst pro vybrané loupeníčko.</p>
            </div>

            <Suspense fallback={<Spinner label="Načítám místa" />}>
                <PlacesList loupenickaId={loupenicka.id} />
            </Suspense>
        </div>
    );
}
