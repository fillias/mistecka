'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const next = searchParams.get('next') || '/dashboard';

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            console.log('data: ', data);

            if (!res.ok || !data.ok) {
                throw new Error(data.error || 'Login failed');
            }

            router.push(next);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Přihlášení</h1>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Heslo"
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Přihlašuji...' : 'Přihlásit se'}
            </button>
            {error && <p>{error}</p>}
        </form>
    );
}
