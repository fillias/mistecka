type pageProps = {};
import Link from 'next/link';

export default function page({}: pageProps) {
    return (
        <>
            <h1>dashboard</h1>
            <Link href="/logout" className="btn btn-lg sm:min-w-64">
                logout
            </Link>
        </>
    );
}
