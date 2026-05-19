import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PlaceCard from '@/components/PlaceCard';
import { getNavBySlug, getCountryBySlug, getAreaBySlug, getAreasByCountryId, getPlacesByAreaId } from '@/lib/db/nav';

type Props = {
    params: Promise<{ navSlug: string; secondSlug: string }>;
};

export default async function SecondLevelPage({ params }: Props) {
    const { navSlug, secondSlug } = await params;
    const nav = await getNavBySlug(navSlug);

    if (!nav) notFound();

    const hasCountries = nav.slug === 'parkovani';

    if (hasCountries) {
        const country = await getCountryBySlug(secondSlug);
        if (!country) notFound();

        const areas = await getAreasByCountryId(country.id);

        return (
            <div className="page-stack">
                <Breadcrumb items={[{ label: nav.name, href: `/dashboard/${navSlug}` }, { label: country.name }]} />

                <div className="card">
                    <span className="eyebrow mb-3">{country.name}</span>
                    <h2 className="mb-1">Vyber oblast</h2>
                </div>

                <ul className="list-links">
                    {areas.map((area) => (
                        <li key={area.id}>
                            <Link href={`/dashboard/${navSlug}/${secondSlug}/${area.slug}`} className="list-link">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="text-base font-semibold" style={{ color: 'rgb(var(--text))' }}>
                                        {area.name}
                                    </h2>
                                    <span className="meta-text shrink-0">→</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // Loupenicko / Ruzne — secondSlug je area → zobraz places jako cards
    const area = await getAreaBySlug(secondSlug);
    if (!area) notFound();

    const places = await getPlacesByAreaId(area.id);

    return (
        <div className="page-stack">
            <Breadcrumb items={[{ label: nav.name, href: `/dashboard/${navSlug}` }, { label: area.name }]} />

            <div className="card">
                <span className="eyebrow mb-3">{nav.name}</span>
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
