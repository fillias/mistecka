'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import type { SubmitEventHandler, ChangeEventHandler } from 'react';

import { isValidGpsString, removeIdFromSlugs } from '@/lib/utils';

type Props = {
    misteckaId: number;
    countryId?: number;
    areaId: number;
    navSlug: string;
    countrySlug?: string;
    areaSlug: string;
};

export default function AddMisteckoPlaceModal({
    misteckaId,
    countryId,
    areaId,
    navSlug,
    countrySlug,
    areaSlug
}: Props) {
    [navSlug, areaSlug] = removeIdFromSlugs([navSlug, areaSlug]);
    countrySlug && ([countrySlug] = removeIdFromSlugs([countrySlug]));

    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [otherType, setOtherType] = useState('');
    const [gps, setGPS] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const parkingTypes = ['parkoviště', 'kemp', 'stání se spaním', 'stání bez spaní', 'hřbitov', 'pláž', 'jiné'];
    const loupenickoTypes = [
        'jablíčka',
        'švestky',
        'třešně',
        'lusky',
        'hrušky',
        'ořechy',
        'houby',
        'borůvky',
        'brusinky',
        'jiné'
    ];
    let options;

    switch (navSlug) {
        case 'mistecka':
            options = parkingTypes;
            break;
        case 'loupenicko':
            options = loupenickoTypes;
            break;
        default:
            options = null;
    }

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

    const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!isValidGpsString(gps)) {
            setError('Špatný formát GPS.');
            setLoading(false);
            return;
        }

        const finalType = type === 'jiné' ? otherType.trim() : type;

        try {
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('description', description.trim());
            formData.append('type', finalType);
            formData.append('misteckaId', String(misteckaId));
            formData.append('countryId', String(countryId));
            formData.append('areaId', String(areaId));
            formData.append('gps', gps.trim());
            imageFile && formData.append('image', imageFile);

            const res = await fetch('/api/add-mistecko-place', {
                method: 'POST',
                body: formData
                // pozor: Content-Type nenastavuj ručně, browser ho nastaví sám včetně boundary
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Nepodařilo se vytvořit místo');
            }

            setName('');
            setDescription('');
            setType('');
            setOtherType('');
            setGPS('');
            setImageFile(null);
            setOpen(false);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Nastala chyba');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex shrink-0 items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
                + Přidat místo
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm dark:bg-black/70">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Nové místo do sekce{' '}
                                    <strong>
                                        {' '}
                                        {navSlug} {countrySlug && ` > ${countrySlug}`}
                                        {` > ${areaSlug}`}
                                    </strong>
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-md px-2 py-1 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                aria-label="Zavřít modal"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="place-name"
                                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                                >
                                    Název místa
                                </label>
                                <input
                                    id="place-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Např. Bota"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700 mb-3"
                                />

                                <label
                                    htmlFor="place-type"
                                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                                >
                                    Typ místa
                                </label>

                                {options && (
                                    <select
                                        id="place-type"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700 mb-3"
                                    >
                                        <option value="" disabled>
                                            Vyber typ místa
                                        </option>
                                        {options?.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {(type === 'jiné' || !options) && (
                                    <input
                                        id="place-type-other"
                                        type="text"
                                        value={otherType}
                                        onChange={(e) => setOtherType(e.target.value)}
                                        required
                                        placeholder="Zadej vlastní typ místa"
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700 mb-3"
                                    />
                                )}

                                <label
                                    htmlFor="place-gps"
                                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                                >
                                    GPS souřadnice
                                </label>
                                <input
                                    id="place-gps"
                                    type="text"
                                    value={gps}
                                    onChange={(e) => setGPS(e.target.value)}
                                    required
                                    placeholder="zkopíruj z Mapy.cz"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700 mb-3"
                                />

                                <label
                                    htmlFor="place-description"
                                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                                >
                                    Popis místa
                                </label>
                                <input
                                    id="place-description"
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    placeholder="Např. placatá voda na SZ vítr"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700 mb-3"
                                />

                                <label
                                    htmlFor="place-image"
                                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                                >
                                    Obrázek
                                </label>
                                <input
                                    id="place-image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFileChange}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:file:bg-slate-800 dark:file:text-slate-200 dark:hover:file:bg-slate-700"
                                />
                            </div>

                            {error && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    Zrušit
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                                >
                                    {loading ? 'Ukládám…' : 'Vytvořit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
