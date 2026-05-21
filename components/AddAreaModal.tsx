'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SubmitEventHandler } from 'react';

type Props = {
    navId: number;
    countryId?: number; // number | undefined
    navSlug: string;
    countrySlug?: string; // string | undefined
};

export default function AddAreaModal({ navId, countryId, navSlug, countrySlug }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/add-area', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.trim(),
                    nav_id: navId,
                    country_id: countryId,
                    navSlug: navSlug,
                    countrySlug: countrySlug
                })
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Nepodařilo se vytvořit zemi');
            }

            setName('');
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
                + Přidat oblast
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm dark:bg-black/70">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Nová země</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Přidání nové oblasti do sekce {navSlug} {countrySlug && ` > ${countrySlug}`}
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
                                    htmlFor="area-name"
                                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                                >
                                    Název oblasti
                                </label>
                                <input
                                    id="area-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Např. sever"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700"
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
