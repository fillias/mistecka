import Link from 'next/link';
import { getAreaMisteckaBySlug, getAreasByCountryMisteckaId } from '@/lib/db/nav';
import { removeIdFromSlugs, getIdFromSlug } from '@/lib/utils';

type Props = {
    params: Promise<{ navSlug?: string; secondSlug?: string; thirdSlug?: string }>;
};

export default async function AreasList({ params }: Props) {
    const { navSlug, secondSlug, thirdSlug } = await params;
    const countryId = getIdFromSlug(secondSlug);
    const [mainNavSlug, countryNavSlug, areaNavSlug] = removeIdFromSlugs([navSlug, secondSlug, thirdSlug]);

    const areas = await getAreasByCountryMisteckaId(countryId);

    return (
        <ul className="list-links">
            {areas.map((area) => (
                <li key={area.id}>
                    <Link href={`/dashboard/${navSlug}/${secondSlug}/${area.id}-${area.slug}`} className="list-link">
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
    );
}
