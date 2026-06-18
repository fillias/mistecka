import PlaceCardWithDetail from '@/components/PlaceCardWirhDetail';
import { getPlacesByAreaMisteckaId } from '@/lib/db/nav';
import { removeIdFromSlugs, getIdFromSlug } from '@/lib/utils';
import PlacesListWrapper from '@/components/PlacesListWrapper';

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

    return <PlacesListWrapper kind="mistecka" places={places} canManage={isAdmin || isEditor} />;
}
