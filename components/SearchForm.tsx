'use client';

import type { SubmitEventHandler } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type MisteckaProps = {
    misteckaTypes: string[];
};

export default function SearchForm({ misteckaTypes }: MisteckaProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('');

    const router = useRouter();

    const onSetType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const typ = event.target.value;
        setType(typ);

        router.push(`/dashboard/search?typ=${encodeURIComponent(typ)}`);
    };

    const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        /*

    try {
        const res = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name.trim(),
                slug: slugify(name)
            })
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.error || 'Nepodařilo se vytvořit Loupeníčko');
        }

        router.refresh();
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Nastala chyba pri hledani');
    } finally {
        setLoading(false);
    }
        */
    };

    return (
        <>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    {misteckaTypes && (
                        <>
                            <label
                                htmlFor="place-type"
                                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                            >
                                vyber typ místa
                            </label>
                            <select
                                id="place-type"
                                value={type}
                                onChange={(e) => onSetType(e)}
                                required
                                className="mb-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                            >
                                <option value="" disabled>
                                    Vyber typ místa
                                </option>
                                {misteckaTypes.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                            {error}
                        </div>
                    )}
                </div>

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
        </>
    );
}
