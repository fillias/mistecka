// app/dashboard/loupenicka/[navSlug]/PlacesList.tsx
import { getPlacesByLoupenickaId } from '@/lib/db/nav';

type Props = {
    loupenickaId: number;
};

export default async function PlacesList({ loupenickaId }: Props) {
    const places = await getPlacesByLoupenickaId(loupenickaId);

    if (!places.length) {
        return (
            <div className="card">
                <p>Zatím tu nejsou žádná místa.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {places.map((place) => (
                <div key={place.id} className="card">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold">{place.name}</h3>
                            {place.type ? <p className="text-sm opacity-70">{place.type}</p> : null}
                        </div>
                    </div>

                    {place.description ? <p className="mt-3 text-sm opacity-80">{place.description}</p> : null}

                    <div className="mt-3 flex flex-wrap gap-3 text-sm opacity-70">
                        {place.gps_coords ? <span>GPS: {place.gps_coords}</span> : null}
                    </div>
                </div>
            ))}
        </div>
    );
}

/*

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
                    <LoadingLink href={`/dashboard/${navSlug}/${area.id}-${area.slug}`} className="list-link">
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

*/
