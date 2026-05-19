import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import userInfo from '@/lib/userInfo';

export async function Footer() {
    const { email } = await userInfo();
    return (
        <footer className="mt-auto border-t py-2 sm:py-2" style={{ borderColor: 'rgb(var(--border))' }}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center justify-start">
                    <ThemeToggle />
                </div>

                {email && (
                    <Link href="/logout" className="btn btn-ghost text-sm" style={{ color: 'rgb(var(--text-soft))' }}>
                        Odhlásit →
                    </Link>
                )}
            </div>
        </footer>
    );
}
