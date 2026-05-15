type pageProps = {};
import Link from 'next/link';

import hasAdminRole from '@/lib/hasAdminRole';

export default async function page({}: pageProps) {
    const isAdmin = await hasAdminRole();

    return (
        <>
            <h1>dashboard {isAdmin ? 'admin' : 'uzivatel'}</h1>
            <Link href="/logout" className="btn btn-lg sm:min-w-64">
                logout
            </Link>
        </>
    );
}
