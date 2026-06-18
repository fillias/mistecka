// app/dashboard/loupenicka/[navSlug]/PlacesList.tsx
import { getPlacesByLoupenickaId, getLoupenickaBySlug } from '@/lib/db/nav';
import PlaceCardWithDetail from '@/components/PlaceCardWirhDetail';
import userInfo from '@/lib/userInfo';
import PlacesListWrapper from '@/components/PlacesListWrapper';

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

    return <PlacesListWrapper kind="loupenicka" places={places} canManage={isAdmin || isEditor} />;
}
