import Link from 'next/link';

export type BreadcrumbItem = {
    label: string;
    href?: string;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
    if (items.length <= 1) return null;

    return (
        <nav aria-label="breadcrumb" className="mb-2">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="flex items-center gap-2">
                            {!isLast && item.href ? (
                                <Link href={item.href} className="btn btn-ghost !min-h-0 !px-2 !py-1">
                                    ← {item.label}
                                </Link>
                            ) : (
                                <span className="font-medium text-slate-700">{item.label}</span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
