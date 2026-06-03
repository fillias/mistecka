'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SubmitEventHandler } from 'react';
import { removeIdFromSlugs } from '@/lib/utils';

type Props = {
    navId: number;
    navSlug: string;
};

export default function AddMisteckoCountryModal({ navId, navSlug }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/add-mistecko-country', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.trim(),
                    code: code.trim().toUpperCase(),
                    nav_id: navId,
                    navSlug: navSlug
                })
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Nepodařilo se vytvořit zemi');
            }

            setName('');
            setCode('');
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
                + Přidat zemi
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm dark:bg-black/70">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Nová země</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Přidání nové země do sekce {removeIdFromSlugs([navSlug]).toString()}
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
                                    htmlFor="country-name"
                                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                                >
                                    Název země
                                </label>
                                <input
                                    id="country-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Např. Chorvatsko"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="country-code"
                                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                                >
                                    Kód země
                                </label>
                                <input
                                    id="country-code"
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    required
                                    maxLength={2}
                                    pattern="[A-Za-z]{2}"
                                    title="Zadej 2písmenný kód země, např. CZ nebo HR"
                                    placeholder="Např. HR"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 uppercase text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700"
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
