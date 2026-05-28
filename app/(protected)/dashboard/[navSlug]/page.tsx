import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getNavBySlug } from '@/lib/db/nav';
import userInfo from '@/lib/userInfo';
import AddCountryModal from '@/components/AddCountryModal';
import AddAreaModal from '@/components/AddAreaModal';
import CountriesList from './CountriesList';
import AreasList from './AreasList';
import Spinner from '@/app/UI/Spinner';

type Props = {
    params: Promise<{ navSlug: string }>;
};

export default async function NavPage({ params }: Props) {
    const { isAdmin, isEditor } = await userInfo();
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

                    {hasCountries
                        ? (isAdmin || isEditor) && <AddCountryModal navId={nav.id} navSlug={navSlug} />
                        : (isAdmin || isEditor) && <AddAreaModal navId={nav.id} navSlug={navSlug} />}
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
