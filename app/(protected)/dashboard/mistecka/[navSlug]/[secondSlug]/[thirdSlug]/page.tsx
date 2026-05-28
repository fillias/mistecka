import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import AddPlaceModal from '@/components/AddPlaceModal';
import userInfo from '@/lib/userInfo';
import Spinner from '@/app/UI/Spinner';
import { getNavBySlug, getCountryBySlug, getAreaBySlug } from '@/lib/db/nav';
import PlacesSection from './PlacesSection';

type Props = {
    params: Promise<{ navSlug: string; secondSlug: string; thirdSlug: string }>;
};

export default async function ThirdLevelPage({ params }: Props) {
    const { isAdmin, isEditor } = await userInfo();
    const { navSlug, secondSlug, thirdSlug } = await params;

    const { nav, debug } = await getNavBySlug(navSlug);
    if (!nav) notFound();

    const country = await getCountryBySlug(secondSlug);
    if (!country) notFound();

    const area = await getAreaBySlug(thirdSlug);
    if (!area) notFound();

    return (
        <div className="page-stack">
            <Breadcrumb
                items={[
                    { label: nav.name, href: `/dashboard/${navSlug}` },
                    { label: country.name, href: `/dashboard/${navSlug}/${secondSlug}` },
                    { label: area.name }
                ]}
            />

            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span className="eyebrow mb-3 block">{country.name}</span>
                        <h1 className="mb-1">{area.name}</h1>
                        {debug}
                    </div>

                    {(isAdmin || isEditor) && (
                        <AddPlaceModal
                            navId={nav.id}
                            countryId={country.id}
                            areaId={area.id}
                            navSlug={navSlug}
                            countrySlug={secondSlug}
                            areaSlug={thirdSlug}
                        />
                    )}
                </div>
            </div>

            <Suspense key={thirdSlug} fallback={<Spinner label="Načítám místa" />}>
                <PlacesSection navId={nav.id} countryId={country.id} areaId={area.id} />
            </Suspense>
        </div>
    );
}
