import Link from 'next/link';
import { getCountriesByMisteckaId } from '@/lib/db/nav';
import { getIdFromSlug } from '@/lib/utils';
import CountryFlag from '@/components/CountryFlag';

type Props = {
    params: Promise<{ navSlug: string }>;
};

export default async function CountriesList({ params }: Props) {
    const { navSlug } = await params;

    const misteckoId: number = getIdFromSlug(navSlug);

    const countries = await getCountriesByMisteckaId(misteckoId);

    return (
        <ul className="list-links">
            {countries.map((country) => (
                <li key={country.id}>
                    <Link href={`/dashboard/${navSlug}/${country.id}-${country.slug}`} className="list-link">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <CountryFlag
                                    code={country.code}
                                    name={country.name}
                                    className="h-4 w-6 rounded-sm shadow-sm"
                                />

                                <h2 className="truncate text-base font-semibold" style={{ color: 'rgb(var(--text))' }}>
                                    {country.name}
                                </h2>
                            </div>

                            <span className="meta-text shrink-0">→</span>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

/*

  

*/
