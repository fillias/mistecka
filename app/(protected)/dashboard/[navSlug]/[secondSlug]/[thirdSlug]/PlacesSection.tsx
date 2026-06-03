import PlaceCardWithDetail from '@/components/PlaceCardWirhDetail';
import { getPlacesByAreaMisteckaId } from '@/lib/db/nav';
import { removeIdFromSlugs, getIdFromSlug } from '@/lib/utils';

import userInfo from '@/lib/userInfo';

type Props = {
    params: Promise<{ navSlug?: string; secondSlug?: string; thirdSlug?: string }>;
};

export default async function PlacesSection({ params }: Props) {
    const { isAdmin, isEditor } = await userInfo();
    const { navSlug, secondSlug, thirdSlug } = await params;

    const areaId = getIdFromSlug(thirdSlug);

    const places = await getPlacesByAreaMisteckaId(areaId);

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
                        <PlaceCardWithDetail kind="mistecka" place={place} canManage={isAdmin || isEditor} />
                    </li>
                ))}
            </ul>
        </>
    );

    return <></>;
}
