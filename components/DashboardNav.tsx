// src/components/DashboardNav.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { Tables } from '@/types/supabase';

type DashboardNavProps = {
    items: Tables<'main_nav'>[];
};

export default function DashboardNav({ items }: DashboardNavProps) {
    const pathname = usePathname();

    return (
        <nav className="flex flex-wrap items-center gap-4 pt-6 pb-12 sm:pt-12 md:pb-24" aria-label="Hlavní navigace">
            <Link href="/dashboard">
                <Image src="/surfer-van.svg" height={60} width={60} priority alt="Netlify logo" />
            </Link>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {items.map((item) => {
                    const href = `/dashboard/${item.slug}`;
                    const isActive = pathname.startsWith(href);

                    return (
                        <li key={item.id}>
                            <Link
                                href={href}
                                aria-current={isActive ? 'page' : undefined}
                                className="inline-flex px-1.5 py-1 sm:px-3 sm:py-2"
                            >
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
