'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogout() {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    origin: window.location.origin
                }
            });

            const data = await res.json();

            if (!data.ok) {
                setError(data.error ?? 'Odhlášení selhalo');
                setLoading(false);
                return;
            }

            router.push('/');
            router.refresh();
        } catch {
            setError('Nepodařilo se spojit se serverem');
            setLoading(false);
        }
    }

    return (
        <section className="flex min-h-[70vh] items-center justify-center py-10 sm:min-h-[80vh] sm:py-16">
            <div className="card w-full max-w-md">
                <div className="page-stack">
                    <div className="text-center">
                        <h1 className="mb-2">Odhlášení</h1>
                        <p>Opravdu se chceš odhlásit ze svého účtu?</p>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="rounded-xl border px-4 py-3 text-sm"
                            style={{
                                borderColor: 'rgb(var(--danger))',
                                background: 'color-mix(in srgb, rgb(var(--danger)) 12%, transparent)',
                                color: 'rgb(var(--danger))'
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={loading}
                            className="btn btn-secondary btn-lg w-full"
                        >
                            Zrušit
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loading}
                            className="btn btn-primary btn-lg w-full"
                            style={{
                                background: loading ? 'rgb(var(--primary-hover))' : undefined,
                                opacity: loading ? 0.9 : 1
                            }}
                        >
                            {loading ? 'Odhlašuji…' : 'Odhlásit se'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
