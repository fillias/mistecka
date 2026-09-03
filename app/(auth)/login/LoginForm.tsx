'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
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

            if (!res.ok || !data.ok) {
                throw new Error(data.error || 'Login failed');
            }

            router.push(next);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="card mx-auto w-full max-w-md">
            <div className="page-stack">
                <div className="text-center">
                    <h1 className="mb-2">Přihlášení</h1>
                </div>

                <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium" style={{ color: 'rgb(var(--text))' }}>
                        E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vas@email.cz"
                        required
                        className="input"
                        aria-invalid={error ? true : false}
                        aria-describedby={error ? 'login-error' : undefined}
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="password" className="text-sm font-medium" style={{ color: 'rgb(var(--text))' }}>
                        Heslo
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Zadejte heslo"
                        required
                        className="input"
                        aria-invalid={error ? true : false}
                        aria-describedby={error ? 'login-error' : undefined}
                    />
                </div>

                {error && (
                    <div
                        id="login-error"
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

                <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
                    {loading ? 'Přihlašuji...' : 'Přihlásit se'}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={loading}
                    className="btn btn-secondary btn-lg w-full"
                >
                    Zrušit
                </button>
            </div>
        </form>
    );
}
