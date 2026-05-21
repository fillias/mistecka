import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNavBySlug, getCountriesByNavId, getAreasByNavId } from '@/lib/db/nav';
import userInfo from '@/lib/userInfo';
import AddCountryModal from '@/components/AddCountryModal';
import AddAreaModal from '@/components/AddAreaModal';

type Props = {
    params: Promise<{ navSlug: string }>;
};

export default async function NavPage({ params }: Props) {
    const { isAdmin, isEditor } = await userInfo();
    const { navSlug } = await params;
    const nav = await getNavBySlug(navSlug);

    if (!nav) notFound();

    const hasCountries = nav.slug === 'parkovani';

    if (hasCountries) {
        const countries = await getCountriesByNavId(nav.id);

        return (
            <div className="page-stack">
                <div className="card">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <span className="eyebrow mb-3 block">{nav.name}</span>
                            <h2 className="mb-1">Vyber zemi</h2>
                        </div>

                        {(isAdmin || isEditor) && <AddCountryModal navId={nav.id} navSlug={navSlug} />}
                    </div>
                </div>

                <ul className="list-links">
                    {countries.map((country) => (
                        <li key={country.id}>
                            <Link href={`/dashboard/${navSlug}/${country.slug}`} className="list-link">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="text-base font-semibold" style={{ color: 'rgb(var(--text))' }}>
                                        {country.name}
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

    // Loupenicko / Ruzne — přímo oblasti
    const areas = await getAreasByNavId(nav.id);

    return (
        <div className="page-stack">
            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span className="eyebrow mb-3 block">{nav.name}</span>
                        <h2 className="mb-1">Vyber oblast</h2>
                    </div>

                    {(isAdmin || isEditor) && <AddAreaModal navId={nav.id} navSlug={navSlug} />}
                </div>
            </div>

            <ul className="list-links">
                {areas.map((area) => (
                    <li key={area.id}>
                        <Link href={`/dashboard/${navSlug}/${area.slug}`} className="list-link">
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
