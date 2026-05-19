'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function InviteUserForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [message, setMessage] = useState<string | null>(null);

    const isLoading = status === 'loading';
    const isError = status === 'error';
    const isSuccess = status === 'success';

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
            setMessage(`Pozvánka byla odeslána na ${email}.`);
            setEmail('');
        } catch {
            setStatus('error');
            setMessage('Nepodařilo se spojit se serverem.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card w-full max-w-xl">
            <div className="page-stack">
                <div className="grid gap-2">
                    <label htmlFor="invite-email" className="text-sm font-medium" style={{ color: 'rgb(var(--text))' }}>
                        E-mail uživatele
                    </label>

                    <input
                        id="invite-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="uzivatel@example.com"
                        required
                        disabled={isLoading}
                        autoComplete="off"
                        className="input"
                        aria-invalid={isError ? true : undefined}
                        aria-describedby={message ? 'invite-user-message' : undefined}
                    />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary btn-lg w-full sm:w-auto sm:min-w-56"
                    >
                        {isLoading ? 'Odesílám…' : 'Pozvat uživatele'}
                    </button>

                    <p className="meta-text">Pozvánka vytvoří přístup až po dokončení registrace uživatelem.</p>
                </div>

                {isSuccess && message && (
                    <div
                        id="invite-user-message"
                        role="status"
                        className="rounded-xl border px-4 py-3 text-sm"
                        style={{
                            borderColor: 'rgb(var(--success))',
                            background: 'color-mix(in srgb, rgb(var(--success)) 12%, transparent)',
                            color: 'rgb(var(--success))'
                        }}
                    >
                        {message}
                    </div>
                )}

                {isError && message && (
                    <div
                        id="invite-user-message"
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
                )}
            </div>
        </form>
    );
}
