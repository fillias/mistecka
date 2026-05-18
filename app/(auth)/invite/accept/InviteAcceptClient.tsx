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
                    console.log('error.message: ', error.message);
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

    if (!ready) {
        return (
            <main>
                {error ? (
                    <>
                        <h1>Nelze dokončit registraci</h1>
                        <p role="alert">{error}</p>
                    </>
                ) : (
                    <h1>Ověřuji pozvánku…</h1>
                )}
            </main>
        );
    }

    return (
        <main>
            <h1>Dokončení registrace</h1>
            <p>Nastav si heslo pro svůj účet.</p>

            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nové heslo"
                    minLength={8}
                    required
                />
                <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Potvrzení hesla"
                    minLength={8}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Ukládám…' : 'Dokončit registraci'}
                </button>
                {error && <p role="alert">{error}</p>}
            </form>
        </main>
    );
}
