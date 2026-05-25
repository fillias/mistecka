'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function InviteAcceptClient() {
    const router = useRouter();

    const [ready, setReady] = useState(false);
    const [checking, setChecking] = useState(true);
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const run = async () => {
            try {
                const supabase = createClient();

                const { data, error } = await supabase.auth.getUser();

                if (error || !data.user) {
                    setError('Pozvánka je neplatná, expirovala nebo nevznikla relace uživatele.');
                    return;
                }

                setReady(true);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Nepodařilo se ověřit relaci');
            } finally {
                setChecking(false);
            }
        };

        run();
    }, []);

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

    if (checking) {
        return <p>Ověřuji pozvánku…</p>;
    }

    if (!ready) {
        return <p>{error ?? 'Pozvánku se nepodařilo zpracovat.'}</p>;
    }

    return (
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
            {error && <p>{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? 'Ukládám…' : 'Dokončit registraci'}
            </button>
        </form>
    );
}
