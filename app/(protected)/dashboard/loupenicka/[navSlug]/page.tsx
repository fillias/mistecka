// app/dashboard/loupenicka/[navSlug]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getLoupenickaBySlug } from '@/lib/db/nav';
import Breadcrumb from '@/components/Breadcrumb';

import PlacesList from './PlacesList';

type Props = {
    params: Promise<{ navSlug: string }>;
};

export default async function DashboardLoupenickaDetailPage({ params }: Props) {
    const { navSlug } = await params;

    const loupenicka = await getLoupenickaBySlug(navSlug);

    if (!loupenicka) notFound();

    return (
        <div className="page-stack">
            <Breadcrumb
                items={[
                    { label: 'Loupeníčka', href: `/dashboard/loupenicka` },
                    { label: loupenicka.name, href: `/dashboard/${navSlug}` }
                ]}
            />

            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="mb-1">{loupenicka.name}</h2>
                        <p>Seznam míst pro vybrané loupeníčko.</p>
                    </div>
                </div>
            </div>

            <Suspense>
                <PlacesList loupenickaId={loupenicka.id} />
            </Suspense>
        </div>
    );
}
