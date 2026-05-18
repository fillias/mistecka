import Link from 'next/link';

export default function page() {
    return (
        <>
            <h1>Registrace jen na pozvání</h1>
            <Link href="/" className="btn mt-5 btn-lg sm:min-w-32">
                Home
            </Link>
        </>
    );
}

/*

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setMessage(
        'Účet byl vytvořen. Pokud máš zapnuté potvrzení emailu, dokonči registraci přes odkaz v emailu.'
      );

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registrace</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Heslo"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Vytvářím účet...' : 'Vytvořit účet'}
      </button>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </form>
  );
}

*/
