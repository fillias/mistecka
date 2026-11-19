'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type MisteckaProps = {
    misteckaTypes: string[];
};

type MisteckaCountryProps = {
    misteckaCountryNames: string[];
};

export function SearchTypesForm({ misteckaTypes }: MisteckaProps) {
    const [error, setError] = useState<string | null>(null);

    const [type, setType] = useState('');

    const router = useRouter();

    const onSetType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const typ = event.target.value;
        setType(typ);

        router.push(`/dashboard/search?typ=${encodeURIComponent(typ)}`);
    };

    return (
        <>
            <form className="space-y-4">
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
            </form>
        </>
    );
}

export function SearchCountriesForm({ misteckaCountryNames }: MisteckaCountryProps) {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const country = searchParams.get('country') ?? '';

    const typ = searchParams.get('typ');

    const onSetCountry = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const countryName = event.target.value;
        router.push(`/dashboard/search?typ=${encodeURIComponent(typ)}&country=${encodeURIComponent(countryName)}`);
    };

    return (
        <>
            <form className="space-y-4">
                <div>
                    {misteckaCountryNames && (
                        <>
                            <select
                                id="place-type"
                                value={country}
                                onChange={(e) => onSetCountry(e)}
                                required
                                className="mb-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                            >
                                <option value="" disabled>
                                    Vyber zemi
                                </option>
                                {misteckaCountryNames.map((name) => (
                                    <option key={name} value={name}>
                                        {name}
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
            </form>
        </>
    );
}
