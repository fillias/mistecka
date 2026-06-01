// app/dashboard/loupenicka/[navSlug]/PlacesList.tsx
import { getPlacesByLoupenickaId, getLoupenickaBySlug } from '@/lib/db/nav';
import PlaceCardWithDetail from '@/components/PlaceCardWirhDetail';
import userInfo from '@/lib/userInfo';

type Props = {
    params: Promise<{ navSlug: string }>;
};

export default async function PlacesList({ params }: Props) {
    const { navSlug } = await params;
    const loupenicka = await getLoupenickaBySlug(navSlug);

    const places = await getPlacesByLoupenickaId(loupenicka.id);

    const { isAdmin, isEditor } = await userInfo();

    if (places.length === 0) {
        return (
            <div className="card flex flex-col items-center py-12 text-center">
                <p className="mb-1 text-base font-medium" style={{ color: 'rgb(var(--text))' }}>
                    Zatím žádná místa
                </p>
                <p>V této oblasti ještě nejsou přidána žádná místa.</p>
            </div>
        );
    }

    return (
        <>
            <p>
                {places.length} {places.length === 1 ? 'místo' : 'míst'} v této oblasti
            </p>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {places.map((place) => (
                    <li key={place.id}>
                        <PlaceCardWithDetail kind="loupenicka" place={place} canManage={isAdmin || isEditor} />
                    </li>
                ))}
            </ul>
        </>
    );
}

/*
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



*/

/*

import PlaceCardWithDetail from '@/components/PlaceCardWirhDetail';
import { getPlacesById } from '@/lib/db/nav';
import userInfo from '@/lib/userInfo';

type Props = {
    navId: number;
    countryId: number;
    areaId: number;
};

export default async function PlacesSection({ navId, countryId, areaId }: Props) {
    const { isAdmin, isEditor } = await userInfo();

    const places = await getPlacesById(navId, countryId, areaId);

    if (places.length === 0) {
        return (
            <div className="card flex flex-col items-center py-12 text-center">
                <p className="mb-1 text-base font-medium" style={{ color: 'rgb(var(--text))' }}>
                    Zatím žádná místa
                </p>
                <p>V této oblasti ještě nejsou přidána žádná místa.</p>
            </div>
        );
    }

    return (
        <>
            <p>
                {places.length} {places.length === 1 ? 'místo' : 'míst'} v této oblasti
            </p>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {places.map((place) => (
                    <li key={place.id}>
                        <PlaceCardWithDetail place={place} canManage={isAdmin || isEditor} />{' '}
                    </li>
                ))}
            </ul>
        </>
    );
}

*/
