// app/(protected)/dashboard/[navSlug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNavBySlug, getCountriesByNavId, getAreasByNavId } from '@/lib/db/nav';

type Props = {
    params: Promise<{ navSlug: string }>;
};

export default async function NavPage({ params }: Props) {
    const { navSlug } = await params;
    const nav = await getNavBySlug(navSlug);

    if (!nav) notFound();

    // Parkovani má strukturu přes country
    const hasCountries = nav.slug === 'parkovani';

    if (hasCountries) {
        const countries = await getCountriesByNavId(nav.id);

        return (
            <div>
                <h1>{nav.name}</h1>
                <ul>
                    {countries.map((country) => (
                        <li key={country.id}>
                            <Link href={`/dashboard/${navSlug}/${country.slug}`}>{country.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // Loupenicko / Ruzne — přímo oblasti
    const areas = await getAreasByNavId(nav.id);

    return (
        <div>
            <h1>{nav.name}</h1>
            <ul>
                {areas.map((area) => (
                    <li key={area.id}>
                        <Link href={`/dashboard/${navSlug}/${area.slug}`}>{area.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
