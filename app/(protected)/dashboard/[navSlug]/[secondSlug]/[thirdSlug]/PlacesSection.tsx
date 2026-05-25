import PlaceCard from '@/components/PlaceCard';
import { getPlacesById } from '@/lib/db/nav';

type Props = {
    navId: string;
    countryId: string;
    areaId: string;
};

export default async function PlacesSection({ navId, countryId, areaId }: Props) {
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
                        <PlaceCard place={place} />
                    </li>
                ))}
            </ul>
        </>
    );
}
