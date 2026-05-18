// app/(protected)/admin/invite-user/InviteUserForm.tsx
'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function InviteUserForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage(null);

        try {
            const res = await fetch('/api/admin/invite', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    origin: window.location.origin
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                setStatus('error');
                setMessage(data.error ?? 'Pozvánku se nepodařilo odeslat.');
                return;
            }

            setStatus('success');
            setMessage(`Pozvánka odeslána na ${email}`);
            setEmail('');
        } catch {
            setStatus('error');
            setMessage('Nepodařilo se spojit se serverem.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="invite-email">Email uživatele</label>
            <input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="uzivatel@example.com"
                required
                disabled={status === 'loading'}
                autoComplete="off"
            />

            <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Odesílám…' : 'Pozvat uživatele'}
            </button>

            {status === 'success' && message && <p role="status">{message}</p>}

            {status === 'error' && message && <p role="alert">{message}</p>}
        </form>
    );
}
