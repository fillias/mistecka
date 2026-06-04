'use client';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useEffect, useRef, useState } from 'react';
import type { Tables } from '@/types/supabase';
import { createMapyCzLink, createGoogleMapsLink } from '@/lib/utils';

type Place = Tables<'place_loupenicka'> | Tables<'place_mistecka'>;

type Props = {
    kind: 'loupenicka' | 'mistecka';
    place: Place;
    canManage?: boolean;
    onClose: () => void;
    onEdit?: (place: Place) => void;
    onDelete?: (place: Place) => void;
    deleteLoading?: boolean;
    deleteError?: string | null;
};

export default function PlaceDetail(props: Props) {
    const [imageOpen, setImageOpen] = useState(false);
    const [gpsCopied, setGpsCopied] = useState(false);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);

    const place = props.place;
    const canManage = props.canManage ?? false;
    const deleteLoading = props.deleteLoading ?? false;
    const deleteError = props.deleteError ?? null;

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeButtonRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (imageOpen) setImageOpen(false);
                else props.onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [imageOpen, props]);

    const handleCopyGps = async () => {
        if (!place.gps_coords) return;

        try {
            await navigator.clipboard.writeText(place.gps_coords);
            setGpsCopied(true);
            window.setTimeout(() => setGpsCopied(false), 1500);
        } catch (error) {
            console.error('Failed to copy GPS coords:', error);
        }
    };

    const handleEdit = () => {
        props.onEdit?.(props.place);
    };

    const handleDelete = () => {
        props.onDelete?.(props.place);
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/60" onClick={props.onClose} />

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
                        onClick={props.onClose}
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
                            {place.small_image_url && (
                                <button
                                    type="button"
                                    onClick={() => setImageOpen(true)}
                                    className="block overflow-hidden rounded-2xl text-left"
                                    aria-label={`Otevřít obrázek místa ${place.name} v plné kvalitě`}
                                >
                                    <img
                                        src={place.small_image_url}
                                        alt={place.name}
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
                                        {place.name}
                                    </h2>

                                    {place.type && <span className="eyebrow shrink-0">{place.type}</span>}
                                </div>

                                {place.description ? (
                                    <p className="leading-7">{place.description}</p>
                                ) : (
                                    <p style={{ color: 'rgb(var(--text-muted))' }}>Místo zatím nemá popis.</p>
                                )}
                            </div>

                            <div className="flex flex-row items-center gap-3">
                                {place.gps_coords && (
                                    <>
                                        <div
                                            className="flex flex-row items-center gap-3"
                                            role="group"
                                            aria-label="Map links"
                                        >
                                            <a
                                                href={createMapyCzLink(place.gps_coords)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex h-11 w-11 items-center justify-center transition hover:scale-[1.03]"
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
                                                href={createGoogleMapsLink(place.gps_coords)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex h-11 w-11 items-center justify-center transition hover:scale-[1.03]"
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

                                        <button
                                            type="button"
                                            onClick={handleCopyGps}
                                            className="ml-auto inline-flex h-11 items-center justify-center rounded-full border px-4 text-sm font-medium transition hover:bg-black/5"
                                            style={{
                                                borderColor: 'rgb(var(--border))',
                                                backgroundColor: gpsCopied ? 'rgb(var(--surface-2))' : 'transparent',
                                                color: 'rgb(var(--text))'
                                            }}
                                            aria-label="Zkopírovat GPS souřadnice"
                                            title="Zkopírovat GPS souřadnice"
                                        >
                                            {gpsCopied ? 'Zkopírováno' : 'Zkopírovat GPS'}
                                        </button>
                                    </>
                                )}
                            </div>

                            {canManage && (
                                <div
                                    className="flex gap-2 border-t pt-4"
                                    style={{ borderColor: 'rgb(var(--border))' }}
                                    role="group"
                                    aria-label="Akce pro správu místa"
                                >
                                    <button
                                        type="button"
                                        onClick={handleEdit}
                                        className="inline-flex h-11 w-18 items-center justify-center rounded-full border transition hover:bg-black/5"
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
                                        onClick={handleDelete}
                                        className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border transition hover:bg-red-500/10 disabled:opacity-50"
                                        style={{
                                            borderColor: 'rgb(var(--danger) / 0.35)',
                                            color: 'rgb(var(--danger))',
                                            backgroundColor: 'rgb(var(--danger) / 0.06)'
                                        }}
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

            {imageOpen && place.large_image_url && (
                <div className="fixed inset-0 z-[60] bg-black">
                    <button
                        type="button"
                        onClick={() => setImageOpen(false)}
                        className="absolute right-4 top-4 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition hover:scale-[1.03]"
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

                    <TransformWrapper
                        initialScale={1}
                        minScale={1}
                        maxScale={16}
                        centerOnInit
                        doubleClick={{ mode: 'zoomIn', step: 2 }}
                        pinch={{ step: 5 }}
                        wheel={{ step: 0.2 }}
                        panning={{ velocityDisabled: true }}
                    >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                            <>
                                <div
                                    className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border px-3 py-2 backdrop-blur-md"
                                    style={{
                                        backgroundColor: 'rgb(var(--surface-2) / 0.85)',
                                        borderColor: 'rgb(var(--border))',
                                        color: 'rgb(var(--text))'
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => zoomOut()}
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border"
                                        style={{ borderColor: 'rgb(var(--border))' }}
                                        aria-label="Zoom out"
                                    >
                                        −
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => resetTransform()}
                                        className="inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm"
                                        style={{ borderColor: 'rgb(var(--border))' }}
                                    >
                                        Reset
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => zoomIn()}
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border"
                                        style={{ borderColor: 'rgb(var(--border))' }}
                                        aria-label="Zoom in"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="flex h-[100dvh] w-full items-center justify-center overflow-hidden p-4">
                                    <TransformComponent wrapperClass="!h-full !w-full" contentClass="!h-full !w-full">
                                        <div className="flex h-full w-full items-center justify-center">
                                            <img
                                                src={place.large_image_url}
                                                alt={place.name}
                                                className="block max-h-none max-w-none object-contain select-none"
                                                draggable={false}
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    width: 'auto',
                                                    height: 'auto',
                                                    touchAction: 'none'
                                                }}
                                            />
                                        </div>
                                    </TransformComponent>
                                </div>
                            </>
                        )}
                    </TransformWrapper>
                </div>
            )}
        </>
    );
}
