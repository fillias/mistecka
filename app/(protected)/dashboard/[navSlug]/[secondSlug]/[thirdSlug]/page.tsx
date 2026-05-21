import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import PlaceCard from '@/components/PlaceCard';
import { getNavBySlug, getCountryBySlug, getPlacesByAreaId, getAreaBySlug } from '@/lib/db/nav';

type Props = {
    params: Promise<{ navSlug: string; secondSlug: string; thirdSlug: string }>;
};

export default async function ThirdLevelPage({ params }: Props) {
    const { navSlug, secondSlug, thirdSlug } = await params;
    const nav = await getNavBySlug(navSlug);
    console.log('nav: ', nav);

    if (!nav) notFound();

    const country = await getCountryBySlug(secondSlug);
    if (!country) notFound();

    const area = await getAreaBySlug(thirdSlug);

    if (!area) notFound();

    const places = await getPlacesByAreaId(area.id);

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
                <span className="eyebrow mb-3">{country.name}</span>
                <h1 className="mb-1">{area.name}</h1>
                <p>
                    {places.length} {places.length === 1 ? 'místo' : 'míst'} v této oblasti
                </p>
            </div>

            {places.length === 0 ? (
                <div className="card flex flex-col items-center py-12 text-center">
                    <p className="mb-1 text-base font-medium" style={{ color: 'rgb(var(--text))' }}>
                        Zatím žádná místa
                    </p>
                    <p>V této oblasti ještě nejsou přidána žádná místa.</p>
                </div>
            ) : (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {places.map((place) => (
                        <li key={place.id}>
                            <PlaceCard place={place} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
