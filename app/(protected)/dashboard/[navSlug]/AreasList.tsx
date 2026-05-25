import Link from 'next/link';
import { getAreasById } from '@/lib/db/nav';

type Props = {
    navId: string;
    navSlug: string;
};

export default async function AreasList({ navId, navSlug }: Props) {
    const areas = await getAreasById(navId, null);

    return (
        <ul className="list-links">
            {areas.map((area) => (
                <li key={area.id}>
                    <Link href={`/dashboard/${navSlug}/${area.id}-${area.slug}`} className="list-link">
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
