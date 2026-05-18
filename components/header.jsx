import Image from 'next/image';
import Link from 'next/link';

export function Header() {
    return (
        <nav className="flex flex-wrap items-center gap-4 pt-6 pb-12 sm:pt-12 md:pb-24">
            <Link href="/">
                <Image src="/surfer-van.svg" height={60} width={60} priority alt="Netlify logo" />
            </Link>
        </nav>
    );
}
