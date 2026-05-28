import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import AddAreaModal from '@/components/AddAreaModal';
import userInfo from '@/lib/userInfo';
import { getNavBySlug, getCountryBySlug, getAreaBySlug } from '@/lib/db/nav';
import Spinner from '@/app/UI/Spinner';
import AreasList from './AreasList';
import PlacesList from './PlacesList';
import AddPlaceModal from '@/components/AddPlaceModal';

type Props = {
    params: Promise<{ navSlug: string; secondSlug: string }>;
};

export default async function SecondLevelPage({ params }: Props) {
    const { isAdmin, isEditor } = await userInfo();
    const { navSlug, secondSlug } = await params;
    const { nav, debug } = await getNavBySlug(navSlug);

    if (!nav) notFound();

    const hasCountries = nav.slug === 'parkovani';

    if (hasCountries) {
        const country = await getCountryBySlug(secondSlug);
        if (!country) notFound();

        return (
            <div className="page-stack">
                <Breadcrumb items={[{ label: nav.name, href: `/dashboard/${navSlug}` }, { label: country.name }]} />

                <div className="card">
                    {debug}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <span className="eyebrow mb-3 block">{country.name}</span>
                            <h2 className="mb-1">Vyber oblast</h2>
                        </div>

                        {(isAdmin || isEditor) && (
                            <AddAreaModal
                                navId={nav.id}
                                countryId={country.id}
                                navSlug={navSlug}
                                countrySlug={secondSlug}
                            />
                        )}
                    </div>
                </div>

                <Suspense fallback={<Spinner label="Načítám oblasti" />}>
                    <AreasList navId={nav.id} countryId={country.id} navSlug={navSlug} secondSlug={secondSlug} />
                </Suspense>
            </div>
        );
    }

    const area = await getAreaBySlug(secondSlug);
    if (!area) notFound();

    return (
        <div className="page-stack">
            <Breadcrumb items={[{ label: nav.name, href: `/dashboard/${navSlug}` }, { label: area.name }]} />

            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span className="eyebrow mb-3 block">{nav.name}</span>
                        <h1 className="mb-1">{area.name}</h1>
                    </div>
                    {(isAdmin || isEditor) && (
                        <AddPlaceModal navId={nav.id} areaId={area.id} navSlug={navSlug} areaSlug={secondSlug} />
                    )}
                </div>
            </div>
            <Suspense fallback={<Spinner label="Načítám místa" />}>
                <PlacesList navId={nav.id} areaId={area.id} />
            </Suspense>
        </div>
    );
}
