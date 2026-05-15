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
        <main>
            <h1>Odhlášení</h1>
            <p>Opravdu se chceš odhlásit?</p>

            {error && <p role="alert">{error}</p>}

            <div>
                <button onClick={() => router.back()} disabled={loading}>
                    Zrušit
                </button>
                <button onClick={handleLogout} disabled={loading}>
                    {loading ? 'Odhlašuji…' : 'Odhlásit se'}
                </button>
            </div>
        </main>
    );
}
