// app/dashboard/loupenicka/page.tsx
import LoadingLink from '@/components/LoadingLink';
import { getNavigationData } from '@/lib/db/nav';

export default async function DashboardLoupenickaPage() {
    const data = await getNavigationData();
    const loupenicka = data.loupenicka;

    return (
        <div className="page-stack">
            <div className="card">
                <span className="eyebrow mb-3 block">Dashboard</span>
                <h2 className="mb-1">Loupeníčka</h2>
                <p>Vyber loupeníčko pro zobrazení míst.</p>
            </div>

            <div className="grid gap-4">
                {loupenicka.map((item) => (
                    <LoadingLink
                        key={item.id}
                        href={`/dashboard/loupenicka/${item.slug}`}
                        className="card transition hover:bg-black/5"
                    >
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                    </LoadingLink>
                ))}
            </div>
        </div>
    );
}

/*
import { Suspense } from 'react';
import { getNavigationData, getAreasByLoupenickaId } from '@/lib/db/nav';

import AreasList from './AreasList';
import Spinner from '@/app/UI/Spinner';

export default async function LoupenickaIndexPage() {
    const { loupenicka } = await getNavigationData();

    return (
        <div className="page-stack">
            {loupenicka.map((item) => (
                <div key={item.id} className="card">
                    <div className="mb-4">
                        <span className="eyebrow mb-3 block">Loupeníčko</span>
                        <h2>{item.name}</h2>
                    </div>

                    <Suspense fallback={<Spinner label="Načítám oblasti" />}>
                        <AreasList loupenickaId={item.id} navSlug={item.slug} />
                    </Suspense>
                </div>
            ))}
        </div>
    );
}
*/
