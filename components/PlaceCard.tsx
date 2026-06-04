'use client';

import type { Tables } from '@/types/supabase';
import { createMapyCzLink } from '@/lib/utils';

type Place = Tables<'place_loupenicka'> | Tables<'place_mistecka'>;

type PlaceCardProps = {
    kind: 'loupenicka' | 'mistecka';
    place: Place;
    onOpenDetail: () => void;
};

export default function PlaceCard({ kind, place, onOpenDetail }: PlaceCardProps) {
    return (
        <article
            className="card flex h-full cursor-pointer flex-col gap-3"
            onClick={onOpenDetail}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenDetail();
                }
            }}
            aria-label={`Zobrazit detail místa ${place.name}`}
        >
            {place.small_image_url && (
                <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16/9' }}>
                    <img
                        src={place.small_image_url}
                        alt={place.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>
            )}

            <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-semibold leading-snug" style={{ color: 'rgb(var(--text))' }}>
                    {place.name}
                </h2>
                {place.type && <span className="eyebrow shrink-0">{place.type}</span>}
            </div>

            {place.description && <p className="line-clamp-3 text-sm leading-6">{place.description}</p>}

            {place.gps_coords && (
                <div className="mt-auto pt-2" style={{ borderTop: '1px solid rgb(var(--border))' }}>
                    <a
                        href={createMapyCzLink(place.gps_coords)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost !min-h-0 !px-0 !py-1 text-xs"
                        style={{ color: 'rgb(var(--primary))' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        📍 Zobrazit na Mapy.cz
                    </a>
                </div>
            )}
        </article>
    );
}
