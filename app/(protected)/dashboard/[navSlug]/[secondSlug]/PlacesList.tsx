import PlaceCard from '@/components/PlaceCard';
import { getPlacesById } from '@/lib/db/nav';

type Props = {
    navId: string;
    areaId: string;
};

export default async function PlacesList({ navId, areaId }: Props) {
    const places = await getPlacesById(navId, null, areaId);

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
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {places.map((place) => (
                <li key={place.id}>
                    <PlaceCard place={place} />
                </li>
            ))}
        </ul>
    );
}
