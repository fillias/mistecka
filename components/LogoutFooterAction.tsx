import Link from 'next/link';

import userInfo from '@/lib/userInfo';

export async function LogoutFooterAction() {
    const { email } = await userInfo();

    if (!email) return null;

    return (
        <div className="bottom-2 right-4">
            <Link href="/logout" className="btn btn-ghost text-sm" style={{ color: 'rgb(var(--text-soft))' }}>
                Odhlásit →
            </Link>
        </div>
    );
}
