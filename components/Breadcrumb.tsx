// src/components/Breadcrumb.tsx
import Link from 'next/link';

export type BreadcrumbItem = {
    label: string;
    href?: string;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
    if (items.length <= 1) return null;

    return (
        <nav aria-label="breadcrumb">
            <ol>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={index}>
                            {!isLast && item.href ? (
                                <Link href={item.href}>← {item.label}</Link>
                            ) : (
                                <span>{item.label}</span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
