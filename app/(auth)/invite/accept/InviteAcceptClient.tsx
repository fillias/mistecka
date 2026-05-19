'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function InviteAcceptClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [ready, setReady] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const run = async () => {
            try {
                const supabase = createClient();
                const token_hash = searchParams.get('token_hash');
                const type = searchParams.get('type');

                if (!token_hash || type !== 'invite') {
                    setError('Pozvánka je neplatná nebo expirovala.');
                    return;
                }

                const { error } = await supabase.auth.verifyOtp({
                    token_hash,
                    type: 'invite'
                });

                if (error) {
                    setError(error.message);
                    return;
                }

                setReady(true);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Nepodařilo se ověřit pozvánku');
            }
        };

        run();
    }, [searchParams]);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            setError('Heslo musí mít alespoň 8 znaků.');
            return;
        }

        if (password !== passwordConfirm) {
            setError('Hesla se neshodují.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({ password });

            if (error) throw error;

            router.push('/dashboard');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Nepodařilo se nastavit heslo');
        } finally {
            setLoading(false);
        }
    };

    const ErrorBlock = ({ message }: { message: string }) => (
        <div
            role="alert"
            className="rounded-xl border px-4 py-3 text-sm"
            style={{
                borderColor: 'rgb(var(--danger))',
                background: 'color-mix(in srgb, rgb(var(--danger)) 12%, transparent)',
                color: 'rgb(var(--danger))'
            }}
        >
            {message}
        </div>
    );

    // Stav: ověřování nebo chyba ověření
    if (!ready) {
        return (
            <div className="card w-full">
                <div className="page-stack items-center text-center">
                    {error ? (
                        <>
                            <h1 className="mb-1">Nelze dokončit registraci</h1>
                            <ErrorBlock message={error} />
                        </>
                    ) : (
                        <>
                            <h1 className="mb-1">Ověřuji pozvánku</h1>
                            <p>Chvíli strpení, ověřujeme platnost pozvánky…</p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // Stav: formulář pro nastavení hesla
    return (
        <form onSubmit={handleSubmit} className="card w-full">
            <div className="page-stack">
                <div className="text-center">
                    <h1 className="mb-2">Dokončení registrace</h1>
                    <p>Nastav si heslo pro svůj nový účet.</p>
                </div>

                <div className="grid gap-2">
                    <label htmlFor="password" className="text-sm font-medium" style={{ color: 'rgb(var(--text))' }}>
                        Nové heslo
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Alespoň 8 znaků"
                        minLength={8}
                        required
                        className="input"
                        aria-describedby={error ? 'invite-error' : undefined}
                        aria-invalid={error ? true : undefined}
                    />
                </div>

                <div className="grid gap-2">
                    <label
                        htmlFor="password-confirm"
                        className="text-sm font-medium"
                        style={{ color: 'rgb(var(--text))' }}
                    >
                        Potvrzení hesla
                    </label>
                    <input
                        id="password-confirm"
                        type="password"
                        autoComplete="new-password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="Zopakuj heslo"
                        minLength={8}
                        required
                        className="input"
                        aria-describedby={error ? 'invite-error' : undefined}
                        aria-invalid={error ? true : undefined}
                    />
                </div>

                {error && (
                    <div id="invite-error">
                        <ErrorBlock message={error} />
                    </div>
                )}

                <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
                    {loading ? 'Ukládám…' : 'Dokončit registraci'}
                </button>
            </div>
        </form>
    );
}
