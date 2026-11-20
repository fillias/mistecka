'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type MisteckoItem = {
    id: number | string;
    slug: string;
    name: string;
};

type DashboardNavClientProps = {
    mistecka: MisteckoItem[];
    device: string | null;
};

export default function DashboardNavClient({ mistecka, device }: DashboardNavClientProps) {
    const pathname = usePathname();

    const isMobileDashboardHP = device === 'm' && pathname === '/dashboard';

    if (isMobileDashboardHP) {
        return (
            <nav aria-label="Hlavní navigace" className="nav-scroll items-center justify-center">
                <Link
                    href="/dashboard"
                    className="mr-3 flex h-14 w-14 shrink-0 items-center justify-center sm:mr-4 sm:h-16 sm:w-16"
                    aria-label="Přejít na dashboard"
                >
                    <Image
                        src="/surfer-van.svg"
                        width={48}
                        height={48}
                        priority
                        alt="Místečka logo"
                        className="logo-img h-15 w-15 sm:h-12 sm:w-12"
                    />
                </Link>
            </nav>
        );
    }

    return (
        <nav aria-label="Hlavní navigace" className="nav-scroll items-center">
            <Link
                href="/dashboard"
                className="mr-3 flex h-14 w-14 shrink-0 items-center justify-center sm:mr-4 sm:h-16 sm:w-16"
                aria-label="Přejít na dashboard"
            >
                <Image
                    src="/surfer-van.svg"
                    width={48}
                    height={48}
                    priority
                    alt="Místečka logo"
                    className="logo-img h-10 w-10 sm:h-12 sm:w-12"
                />
            </Link>

            {mistecka.map((mistecko) => {
                const href = `/dashboard/${mistecko.id}-${mistecko.slug}`;
                const isActive = pathname.startsWith(href);

                return (
                    <Link
                        key={mistecko.id}
                        href={href}
                        aria-current={isActive ? 'page' : undefined}
                        className={`nav-pill ${isActive ? 'nav-pill-active' : ''}`}
                    >
                        {mistecko.name}
                    </Link>
                );
            })}
            <Link
                href="/dashboard/loupenicka"
                aria-current={pathname.includes('loupenicka') ? 'page' : undefined}
                className={`nav-pill ${pathname.includes('loupenicka') ? 'nav-pill-active' : ''}`}
            >
                Loupeníčka
            </Link>
            <Link
                href="/dashboard/search"
                aria-current={pathname.includes('search') ? 'page' : undefined}
                className={`nav-pill ${pathname.includes('search') ? 'nav-pill-active' : ''}`}
            >
                Hledat
            </Link>
        </nav>
    );
}
