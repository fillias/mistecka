import Link from 'next/link';
import { getAreasById } from '@/lib/db/nav';
import LoadingLink from '@/components/LoadingLink';

type Props = {
    navId: string;
    countryId: string;
    navSlug: string;
    secondSlug: string;
};

export default async function AreasList({ navId, countryId, navSlug, secondSlug }: Props) {
    const areas = await getAreasById(navId, countryId);

    return (
        <ul className="list-links">
            {areas.map((area) => (
                <li key={area.id}>
                    <LoadingLink
                        href={`/dashboard/${navSlug}/${secondSlug}/${area.id}-${area.slug}`}
                        className="list-link"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-base font-semibold" style={{ color: 'rgb(var(--text))' }}>
                                {area.name}
                            </h2>
                            <span className="meta-text shrink-0">→</span>
                        </div>
                    </LoadingLink>
                </li>
            ))}
        </ul>
    );
}
