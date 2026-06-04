'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ChangeEventHandler, SubmitEventHandler } from 'react';
import type { Tables } from '@/types/supabase';
import { isValidGpsString } from '@/lib/utils';

type LoupenickaPlace = Tables<'place_loupenicka'>;
type MisteckaPlace = Tables<'place_mistecka'>;

type Props =
    | {
          kind: 'loupenicka';
          open: boolean;
          place: LoupenickaPlace;
          onOpenChange: (open: boolean) => void;
          onSaved?: (place: LoupenickaPlace) => void;
      }
    | {
          kind: 'mistecka';
          open: boolean;
          place: MisteckaPlace;
          onOpenChange: (open: boolean) => void;
          onSaved?: (place: MisteckaPlace) => void;
      };

export default function EditPlaceModal(props: Props) {
    const router = useRouter();
    const firstInputRef = useRef<HTMLInputElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [gpsCoords, setGpsCoords] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!props.open) return;

        setName(props.place.name ?? '');
        setType(props.place.type ?? '');
        setDescription(props.place.description ?? '');
        setGpsCoords(props.place.gps_coords ?? '');
        setImageFile(null);
        setError(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const timer = window.setTimeout(() => firstInputRef.current?.focus(), 0);

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') props.onOpenChange(false);
        };

        document.addEventListener('keydown', onKeyDown);

        return () => {
            window.clearTimeout(timer);
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [props]);

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.currentTarget.files?.[0] ?? null;

        if (!file) {
            setImageFile(null);
            return;
        }

        const allowed = ['image/jpeg', 'image/png', 'image/webp'];

        if (!allowed.includes(file.type)) {
            setError('Povoleny jsou jen JPG, PNG a WEBP.');
            e.currentTarget.value = '';
            setImageFile(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Soubor je větší než 5 MB.');
            e.currentTarget.value = '';
            setImageFile(null);
            return;
        }

        setError(null);
        setImageFile(file);
    };

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Název místa je povinný.');
            return;
        }

        if (gpsCoords.trim() && !isValidGpsString(gpsCoords.trim())) {
            setError('Špatný formát GPS.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('kind', props.kind);
            formData.append('name', name.trim());
            formData.append('type', type.trim());
            formData.append('description', description.trim());
            formData.append('gps_coords', gpsCoords.trim());

            if (imageFile) {
                formData.append('image', imageFile);
            }

            const res = await fetch(`/api/place/${props.place.id}`, {
                method: 'PATCH',
                body: formData
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(json?.error || 'Nepodařilo se uložit změny');
            }

            if (props.kind === 'loupenicka') {
                props.onSaved?.(json.place as LoupenickaPlace);
            } else {
                props.onSaved?.(json.place as MisteckaPlace);
            }

            props.onOpenChange(false);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Nepodařilo se uložit změny');
        } finally {
            setLoading(false);
        }
    };

    if (!props.open) return null;

    return (
        <>
            <div className="fixed inset-0 z-[70] bg-black/60" onClick={() => props.onOpenChange(false)} />

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
                        onClick={() => props.onOpenChange(false)}
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
                            <span className="text-sm font-medium">GPS souřadnice</span>
                            <input
                                value={gpsCoords}
                                onChange={(e) => setGpsCoords(e.target.value)}
                                className="input"
                                placeholder="49.123456,15.123456"
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className="text-sm font-medium">Nahrát nový obrázek</span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileChange}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:file:bg-slate-800 dark:file:text-slate-200 dark:hover:file:bg-slate-700"
                            />
                            <span className="text-xs" style={{ color: 'rgb(var(--text-muted))' }}>
                                Když nic nevybereš, zůstane stávající obrázek.
                            </span>
                        </label>

                        {imageFile && (
                            <p className="text-sm" style={{ color: 'rgb(var(--text-muted))' }}>
                                Vybraný soubor: {imageFile.name}
                            </p>
                        )}

                        {error && (
                            <p className="text-sm" style={{ color: 'rgb(var(--danger))' }}>
                                {error}
                            </p>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button type="button" onClick={() => props.onOpenChange(false)} className="btn">
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
