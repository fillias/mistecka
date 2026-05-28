'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { Tables } from '@/types/supabase';
import LoadingLink from '@/components/LoadingLink';
import { getAllRootNav } from '@/lib/db/nav';

export default function DashboardNav() {
    const pathname = usePathname();
    const href = `/loupenicka`;
    const isActive = pathname.startsWith(href);

    return (
        <nav aria-label="Hlavní navigace" className="nav-scroll items-center">
            <LoadingLink
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
            </LoadingLink>

            <LoadingLink
                href="/dashboard/loupenicka"
                aria-current={isActive ? 'page' : undefined}
                className={`nav-pill ${isActive ? 'nav-pill-active' : ''}`}
            >
                Loupeníčka
            </LoadingLink>
        </nav>
    );
}

/*

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { Tables } from '@/types/supabase';
import LoadingLink from '@/components/LoadingLink';

type DashboardNavProps = {
    items: Tables<'main_nav'>[];
};

export default function DashboardNav({ items }: DashboardNavProps) {
    const pathname = usePathname();

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

            {items.map((item) => {
                const href = `/dashboard/${item.id}-${item.slug}`;
                const isActive = pathname.startsWith(href);

                return (
                    <LoadingLink
                        key={item.id}
                        href={href}
                        aria-current={isActive ? 'page' : undefined}
                        className={`nav-pill ${isActive ? 'nav-pill-active' : ''}`}
                    >
                        {item.name}
                    </LoadingLink>
                );
            })}
        </nav>
    );
}
*/
