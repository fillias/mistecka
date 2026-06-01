import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getNavBySlug } from '@/lib/db/nav';

import CountriesList from './CountriesList';
import AreasList from './AreasList';
import Spinner from '@/app/UI/Spinner';
import EditorNav from '@/components/EditorNav';

type Props = {
    params: Promise<{ navSlug: string }>;
};

export default async function NavPage({ params }: Props) {
    const { navSlug } = await params;
    const { nav, debug } = await getNavBySlug(navSlug);

    if (!nav) notFound();
    const hasCountries = nav.slug === 'parkovani';
    return (
        <div className="page-stack">
            {debug}
            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span className="eyebrow mb-3 block">{nav.name}</span>
                        <h2 className="mb-1">{hasCountries ? 'Vyber zemi' : 'Vyber oblast'}</h2>
                    </div>
                    <Suspense>
                        <EditorNav nav={nav} navigation={{ navSlug }} />
                    </Suspense>
                </div>
            </div>

            <Suspense fallback={<Spinner label={hasCountries ? 'Načítám země' : 'Načítám oblasti'} />}>
                {hasCountries ? (
                    <CountriesList navId={nav.id} navSlug={navSlug} />
                ) : (
                    <AreasList navId={nav.id} navSlug={navSlug} />
                )}
            </Suspense>
        </div>
    );
}
