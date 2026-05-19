import Link from 'next/link';
import userInfo from '@/lib/userInfo';

export default async function Page() {
    const { isAdmin, email } = await userInfo();

    return (
        <div className="page-stack">
            <section className="card">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <span className="eyebrow mb-3">{isAdmin ? 'Admin' : 'Uživatel'}</span>
                        <h1 className="mb-2 text-2xl sm:text-3xl">Dashboard {isAdmin ? 'admin' : 'uživatel'}</h1>
                        <p>Ahoj {email}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Link href="/dashboard" className="btn btn-secondary btn-lg sm:min-w-40">
                        Dashboard
                    </Link>
                </div>
            </section>

            <section className="card-muted">
                <h2 className="mb-2 text-lg sm:text-xl">Co dál</h2>
                <p>Vyber sekci v horní navigaci a pokračuj do zemí, oblastí nebo konkrétních míst.</p>
            </section>
        </div>
    );
}
