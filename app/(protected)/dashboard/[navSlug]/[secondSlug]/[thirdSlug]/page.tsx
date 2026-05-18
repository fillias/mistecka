// app/(protected)/dashboard/[navSlug]/[secondSlug]/[thirdSlug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { getNavBySlug, getCountryBySlug, getAreaBySlug, getPlacesByAreaId } from '@/lib/db/nav';

type Props = {
    params: Promise<{ navSlug: string; secondSlug: string; thirdSlug: string }>;
};

export default async function ThirdLevelPage({ params }: Props) {
    const { navSlug, secondSlug, thirdSlug } = await params;
    const nav = await getNavBySlug(navSlug);

    if (!nav) notFound();

    // Jen parkovani má třetí úroveň přes country → area → places
    const country = await getCountryBySlug(secondSlug);
    if (!country) notFound();

    const area = await getAreaBySlug(thirdSlug);
    if (!area) notFound();

    const places = await getPlacesByAreaId(area.id);

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: nav.name, href: `/dashboard/${navSlug}` },
                    { label: country.name, href: `/dashboard/${navSlug}/${secondSlug}` },
                    { label: area.name }
                ]}
            />
            <h1>{area.name}</h1>
            <ul>
                {places.map((place) => (
                    <li key={place.id}>
                        <div>
                            <strong>{place.place_name}</strong>
                            {place.place_type && <span> · {place.place_type}</span>}
                            {place.place_description && <p>{place.place_description}</p>}
                            {place.place_gps_coords && (
                                <a
                                    href={`https://maps.google.com/?q=${place.place_gps_coords}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Zobrazit na mapě
                                </a>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
