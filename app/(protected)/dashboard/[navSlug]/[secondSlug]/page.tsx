// app/(protected)/dashboard/[navSlug]/[secondSlug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
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
        // secondSlug je country slug → zobraz oblasti
        const country = await getCountryBySlug(secondSlug);
        if (!country) notFound();

        const areas = await getAreasByCountryId(country.id);

        return (
            <div>
                <Breadcrumb items={[{ label: nav.name, href: `/dashboard/${navSlug}` }, { label: country.name }]} />
                <h1>{country.name}</h1>
                <ul>
                    {areas.map((area) => (
                        <li key={area.id}>
                            <Link href={`/dashboard/${navSlug}/${secondSlug}/${area.slug}`}>{area.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // secondSlug je area slug → zobraz místa
    const area = await getAreaBySlug(secondSlug);
    if (!area) notFound();

    const places = await getPlacesByAreaId(area.id);

    return (
        <div>
            <Breadcrumb items={[{ label: nav.name, href: `/dashboard/${navSlug}` }, { label: area.name }]} />
            <h1>{area.name}</h1>
            <ul>
                {places.map((place) => (
                    <li key={place.id}>
                        <Link href={`/dashboard/${navSlug}/${secondSlug}/${place.id}`}>{place.place_name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
