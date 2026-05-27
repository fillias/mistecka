'use client';

import { useEffect, useRef, useState } from 'react';
import type { Tables } from '@/types/supabase';
import { createMapyCzLink, createGoogleMapsLink } from '@/lib/utils';

type Props = {
    place: Tables<'place'>;
    canManage?: boolean;
    onClose: () => void;
    onEdit?: (place: Tables<'place'>) => void;
    onDelete?: (place: Tables<'place'>) => void;
    deleteLoading?: boolean;
    deleteError?: string | null;
};

export default function PlaceDetail({
    place,
    canManage = false,
    onClose,
    onEdit,
    onDelete,
    deleteLoading = false,
    deleteError = null
}: Props) {
    const [imageOpen, setImageOpen] = useState(false);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeButtonRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (imageOpen) setImageOpen(false);
                else onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [imageOpen, onClose]);

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />

            <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-6">
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="place-detail-title"
                    className="relative flex max-h-[100dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border bg-[rgb(var(--surface))] shadow-2xl sm:max-h-[90vh] sm:rounded-3xl"
                    style={{ borderColor: 'rgb(var(--border))' }}
                >
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        className="absolute right-4 top-4 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border shadow-sm backdrop-blur transition hover:scale-[1.03]"
                        style={{
                            backgroundColor: 'rgb(var(--surface-2))',
                            borderColor: 'rgb(var(--border))',
                            color: 'rgb(var(--text))'
                        }}
                        aria-label="Zavřít detail místa"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path d="M6 6l12 12" />
                            <path d="M18 6L6 18" />
                        </svg>
                    </button>

                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                        <div className="page-stack">
                            {place.place_image_url && (
                                <button
                                    type="button"
                                    onClick={() => setImageOpen(true)}
                                    className="block overflow-hidden rounded-2xl text-left"
                                    aria-label={`Otevřít obrázek místa ${place.place_name} v plné kvalitě`}
                                >
                                    <img
                                        src={place.place_image_url}
                                        alt={place.place_name}
                                        className="h-auto max-h-[48vh] w-full object-cover"
                                    />
                                </button>
                            )}

                            <div>
                                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                                    <h2
                                        id="place-detail-title"
                                        className="text-xl font-semibold"
                                        style={{ color: 'rgb(var(--text))' }}
                                    >
                                        {place.place_name}
                                    </h2>

                                    {place.place_type && <span className="eyebrow shrink-0">{place.place_type}</span>}
                                </div>

                                {place.place_description ? (
                                    <p className="leading-7">{place.place_description}</p>
                                ) : (
                                    <p style={{ color: 'rgb(var(--text-muted))' }}>Místo zatím nemá popis.</p>
                                )}
                            </div>

                            <div className="flex flex-row gap-3">
                                {place.place_gps_coords && (
                                    <div
                                        className="flex flex-row items-center gap-3"
                                        role="group"
                                        aria-label="Map links"
                                    >
                                        <a
                                            href={createMapyCzLink(place.place_gps_coords)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex h-11 w-11 items-center justify-center  transition hover:scale-[1.03]"
                                            aria-label="Open in Mapy.cz"
                                            title="Open in Mapy.cz"
                                        >
                                            <img
                                                src="/images/Mapycz_icon.svg"
                                                alt=""
                                                aria-hidden="true"
                                                className="h-10 w-auto"
                                            />
                                        </a>

                                        <a
                                            href={createGoogleMapsLink(place.place_gps_coords)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex h-11 w-11 items-center justify-center  transition hover:scale-[1.03]"
                                            aria-label="Open in Google Maps"
                                            title="Open in Google Maps"
                                        >
                                            <img
                                                src="/images/Google_Maps_icon.svg"
                                                alt=""
                                                aria-hidden="true"
                                                className="h-10 w-auto"
                                            />
                                        </a>
                                    </div>
                                )}
                            </div>

                            {canManage && (
                                <div
                                    className="flex items-center gap-2 border-t pt-4"
                                    style={{ borderColor: 'rgb(var(--border))' }}
                                    role="group"
                                    aria-label="Akce pro správu místa"
                                >
                                    <button
                                        type="button"
                                        onClick={() => onEdit?.(place)}
                                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition hover:bg-black/5"
                                        style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--text))' }}
                                        aria-label="Upravit místo"
                                        title="Upravit místo"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 20h9" />
                                            <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                                        </svg>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onDelete?.(place)}
                                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition hover:bg-red-500/10 disabled:opacity-50"
                                        style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--text))' }}
                                        aria-label="Smazat místo"
                                        title="Smazat místo"
                                        disabled={deleteLoading}
                                    >
                                        {deleteLoading ? (
                                            <span
                                                className="h-4 w-4 animate-pulse rounded-full bg-current"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            >
                                                <path d="M3 6h18" />
                                                <path d="M8 6V4h8v2" />
                                                <path d="M19 6l-1 14H6L5 6" />
                                                <path d="M10 11v6" />
                                                <path d="M14 11v6" />
                                            </svg>
                                        )}
                                    </button>

                                    {deleteError && (
                                        <p className="ml-2 text-sm" style={{ color: 'rgb(var(--danger))' }}>
                                            {deleteError}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {imageOpen && place.place_image_url && (
                <div className="fixed inset-0 z-[60] bg-black">
                    <button
                        type="button"
                        onClick={() => setImageOpen(false)}
                        className="absolute right-4 top-4 z-10 inline-flex h-14 w-14 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition hover:scale-[1.03]"
                        style={{
                            backgroundColor: 'rgb(var(--surface-2) / 0.85)',
                            borderColor: 'rgb(var(--border))',
                            color: 'rgb(var(--text))'
                        }}
                        aria-label="Close image"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                            aria-hidden="true"
                        >
                            <path d="M6 6l12 12" />
                            <path d="M18 6L6 18" />
                        </svg>
                    </button>

                    <div
                        className="h-[100dvh] w-full overflow-auto p-4"
                        style={{
                            touchAction: 'pan-x pan-y pinch-zoom',
                            WebkitOverflowScrolling: 'touch'
                        }}
                    >
                        <div className="flex min-h-full min-w-full items-center justify-center">
                            <img
                                src={place.place_image_url}
                                alt={place.place_name}
                                className="block max-w-none object-contain"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    width: 'auto',
                                    height: 'auto'
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
