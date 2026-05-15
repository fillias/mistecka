'use client';

import { useRouter } from 'next/navigation';
import { useIdentity } from '@/contexts/identity';

export function UserMenu() {
  const router = useRouter();
  const { user, ready, refreshUser } = useIdentity();

  if (!ready) return <div>Načítám...</div>;
  if (!user) return <a href="/login">Přihlásit se</a>;

  async function handleLogout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });

    await refreshUser();
    router.push('/login');
    router.refresh();
  }

  return (
    <div>
      <div>{user.email}</div>
      <button onClick={handleLogout}>Odhlásit se</button>
    </div>
  );
}
