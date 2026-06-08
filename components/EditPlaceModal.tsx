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

        if (fileInputRef.current) fileInputRef.current.value = '';

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
            if (imageFile) formData.append('image', imageFile);

            if (props.kind === 'loupenicka') {
                formData.append('loupenicka_id', String(props.place.loupenicka_id));
            }

            if (props.kind === 'mistecka') {
                formData.append('mistecka_id', String(props.place.mistecka_id));
                formData.append('country_mistecka_id', String(props.place.country_mistecka_id));
                formData.append('area_mistecka_id', String(props.place.area_mistecka_id));
            }

            const res = await fetch(`/api/place/${props.place.id}`, {
                method: 'PATCH',
                body: formData
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) throw new Error(json?.error || 'Nepodařilo se uložit změny');

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

    const inputCls =
        'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm dark:bg-black/70">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-place-title"
                className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
                {/* Header */}
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2
                            id="edit-place-title"
                            className="text-base font-semibold text-slate-800 dark:text-slate-100"
                        >
                            Upravit místo
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Uprav údaje místa v sekci{' '}
                            <strong>{props.kind === 'loupenicka' ? 'Loupeníčko' : 'Místečka'}</strong>
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => props.onOpenChange(false)}
                        className="rounded-md px-2 py-1 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                        aria-label="Zavřít modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="edit-name"
                            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                            Název místa
                        </label>
                        <input
                            id="edit-name"
                            ref={firstInputRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Např. Bota"
                            className={`mb-3 ${inputCls}`}
                        />

                        <label
                            htmlFor="edit-type"
                            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                            Typ místa
                        </label>
                        <input
                            id="edit-type"
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            placeholder="Např. jablíčka"
                            className={`mb-3 ${inputCls}`}
                        />

                        <label
                            htmlFor="edit-gps"
                            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                            GPS souřadnice
                        </label>
                        <input
                            id="edit-gps"
                            type="text"
                            value={gpsCoords}
                            onChange={(e) => setGpsCoords(e.target.value)}
                            placeholder="49.123456,15.123456"
                            className={`mb-3 ${inputCls}`}
                        />

                        <label
                            htmlFor="edit-description"
                            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                            Popis místa
                        </label>
                        <textarea
                            id="edit-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Např. placatá voda na SZ vítr"
                            className={`mb-3 ${inputCls}`}
                        />

                        <label
                            htmlFor="edit-image"
                            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                            Nahrát nový obrázek
                        </label>
                        <input
                            id="edit-image"
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:file:bg-slate-800 dark:file:text-slate-200 dark:hover:file:bg-slate-700"
                        />
                        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                            Když nic nevybereš, zůstane stávající obrázek.
                        </p>
                    </div>

                    {imageFile && (
                        <p className="text-sm text-slate-500 dark:text-slate-400">Vybraný soubor: {imageFile.name}</p>
                    )}

                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => props.onOpenChange(false)}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                            Zrušit
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                        >
                            {loading ? 'Ukládám…' : 'Uložit změny'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
