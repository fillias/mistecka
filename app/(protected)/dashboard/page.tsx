type pageProps = {};
import Link from 'next/link';

import userInfo from '@/lib/userInfo';

export default async function page({}: pageProps) {
    const { isAdmin, email } = await userInfo();

    return (
        <>
            <Link href="/logout" className="btn btn-lg sm:min-w-64">
                logout
            </Link>
        </>
    );
}
