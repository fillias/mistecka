import Link from 'next/link';
import { getCountriesByNavId } from '@/lib/db/nav';
import CountryFlag from '@/components/CountryFlag';
import LoadingLink from '@/components/LoadingLink';

type Props = {
    navId: string;
    navSlug: string;
};

export default async function CountriesList({ navId, navSlug }: Props) {
    const countries = await getCountriesByNavId(navId);

    return (
        <ul className="list-links">
            {countries.map((country) => (
                <li key={country.id}>
                    <LoadingLink href={`/dashboard/${navSlug}/${country.id}-${country.slug}`} className="list-link">
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
                    </LoadingLink>
                </li>
            ))}
        </ul>
    );
}
