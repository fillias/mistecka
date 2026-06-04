'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Tables } from '@/types/supabase';

type Place = Tables<'place_loupenicka'> | Tables<'place_mistecka'>;

type Props = {
    kind: 'loupenicka' | 'mistecka';
    open: boolean;
    place: Place;
    onOpenChange: (open: boolean) => void;
    onSaved?: (place: Tables<'place_loupenicka'>) => void;
};

export default function EditPlaceModal({ kind, place, open, onOpenChange, onSaved }: Props) {
    const router = useRouter();
    const firstInputRef = useRef<HTMLInputElement | null>(null);

    const [name, setName] = useState(place.name ?? '');
    const [type, setType] = useState(place.type ?? '');
    const [description, setDescription] = useState(place.description ?? '');
    const [imageUrl, setImageUrl] = useState(place.large_image_url ?? '');
    const [gpsCoords, setGpsCoords] = useState(place.gps_coords ?? '');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        setName(place.name ?? '');
        setType(place.type ?? '');
        setDescription(place.description ?? '');
        setImageUrl(place.large_image_url ?? '');
        setGpsCoords(place.gps_coords ?? '');
        setError(null);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const timer = window.setTimeout(() => firstInputRef.current?.focus(), 0);

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onOpenChange(false);
        };

        document.addEventListener('keydown', onKeyDown);

        return () => {
            window.clearTimeout(timer);
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open, place, onOpenChange]);

    if (!open) return null;

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Název místa je povinný.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/place/${place.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.trim(),
                    type: type.trim() || null,
                    description: description.trim() || null,
                    image_url: imageUrl.trim() || null,
                    gps_coords: gpsCoords.trim() || null,
                    kind: kind
                })
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(json?.error || 'Nepodařilo se uložit změny');
            }

            onSaved?.(json.place);
            onOpenChange(false);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Nepodařilo se uložit změny');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-[70] bg-black/60" onClick={() => onOpenChange(false)} />

            <div className="fixed inset-0 z-[80] flex items-end sm:items-center sm:justify-center sm:p-6">
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="edit-place-title"
                    className="relative w-full max-w-2xl rounded-t-3xl border bg-[rgb(var(--surface))] shadow-2xl sm:rounded-3xl"
                    style={{ borderColor: 'rgb(var(--border))' }}
                >
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="absolute right-4 top-4 rounded-full px-3 py-2 text-sm"
                        style={{ backgroundColor: 'rgb(var(--surface-2))', color: 'rgb(var(--text))' }}
                        aria-label="Zavřít editaci místa"
                    >
                        ✕
                    </button>

                    <form onSubmit={handleSubmit} className="page-stack p-4 sm:p-6">
                        <div>
                            <h2
                                id="edit-place-title"
                                className="text-xl font-semibold"
                                style={{ color: 'rgb(var(--text))' }}
                            >
                                Upravit místo
                            </h2>
                        </div>

                        <label className="grid gap-2">
                            <span className="text-sm font-medium">Název</span>
                            <input
                                ref={firstInputRef}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input"
                                required
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className="text-sm font-medium">Typ</span>
                            <input value={type} onChange={(e) => setType(e.target.value)} className="input" />
                        </label>

                        <label className="grid gap-2">
                            <span className="text-sm font-medium">Popis</span>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="input min-h-32"
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className="text-sm font-medium">URL obrázku</span>
                            <input
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="input"
                                type="url"
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className="text-sm font-medium">GPS souřadnice</span>
                            <input
                                value={gpsCoords}
                                onChange={(e) => setGpsCoords(e.target.value)}
                                className="input"
                                placeholder="49.123456,15.123456"
                            />
                        </label>

                        {error && (
                            <p className="text-sm" style={{ color: 'rgb(var(--danger))' }}>
                                {error}
                            </p>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button type="button" onClick={() => onOpenChange(false)} className="btn">
                                Zrušit
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Ukládám…' : 'Uložit změny'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
