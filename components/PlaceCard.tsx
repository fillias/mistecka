// src/components/PlaceCard.tsx
import type { Tables } from '@/types/supabase';

type PlaceCardProps = {
    place: Tables<'place'>;
};

export default function PlaceCard({ place }: PlaceCardProps) {
    return (
        <article className="card flex h-full flex-col gap-3">
            {/* Obrázek */}
            {place.place_image_url && (
                <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16/9' }}>
                    <img
                        src={place.place_image_url}
                        alt={place.place_name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>
            )}

            {/* Hlavička */}
            <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-semibold leading-snug" style={{ color: 'rgb(var(--text))' }}>
                    {place.place_name}
                </h2>
                {place.place_type && <span className="eyebrow shrink-0">{place.place_type}</span>}
            </div>

            {/* Popis */}
            {place.place_description && <p className="line-clamp-3 text-sm leading-6">{place.place_description}</p>}

            {/* GPS odkaz — zatlačen na konec karty */}
            {place.place_gps_coords && (
                <div className="mt-auto pt-2" style={{ borderTop: '1px solid rgb(var(--border))' }}>
                    <a
                        href={`https://maps.google.com/?q=${place.place_gps_coords}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost !min-h-0 !px-0 !py-1 text-xs"
                        style={{ color: 'rgb(var(--primary))' }}
                    >
                        📍 Zobrazit na mapě
                    </a>
                </div>
            )}
        </article>
    );
}
