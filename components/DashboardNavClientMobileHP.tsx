'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MisteckoItem = {
    id: number | string;
    slug: string;
    name: string;
};

type DashboardNavClientProps = {
    mistecka: MisteckoItem[];
    device?: string | null;
};

export default function DashboardNavClient({ mistecka }: DashboardNavClientProps) {
    const pathname = usePathname();

    return (
        <nav aria-label="Hlavní navigace" className="nav-scroll items-center grid gap-3">
            {mistecka.map((mistecko) => {
                const href = `/dashboard/${mistecko.id}-${mistecko.slug}`;
                const isActive = pathname.startsWith(href);

                return (
                    <Link
                        key={mistecko.id}
                        href={href}
                        aria-current={isActive ? 'page' : undefined}
                        className={`nav-pill ${isActive ? 'nav-pill-active' : ''}; nav-pill-mobile-hp`}
                    >
                        {mistecko.name}
                    </Link>
                );
            })}
            <Link
                href="/dashboard/loupenicka"
                aria-current={pathname.includes('loupenicka') ? 'page' : undefined}
                className={`nav-pill ${pathname.includes('loupenicka') ? 'nav-pill-active' : ''}; nav-pill-mobile-hp`}
            >
                Loupeníčka
            </Link>
            <Link
                href="/dashboard/search"
                aria-current={pathname.includes('search') ? 'page' : undefined}
                className={`nav-pill ${pathname.includes('search') ? 'nav-pill-active' : ''}; nav-pill-mobile-hp`}
            >
                Hledat
            </Link>
        </nav>
    );
}
