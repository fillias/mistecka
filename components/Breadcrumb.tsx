import Link from 'next/link';
import {
    getLoupenickaBySlug,
    getMisteckaBySlug,
    getCountryMisteckaBySlug,
    getCountriesByMisteckaId
} from '@/lib/db/nav';
import { removeIdFromSlugs, getIdFromSlug } from '@/lib/utils';

export type Props = {
    mainSection: string;
    params?: Promise<{ navSlug: string }>;
};

export async function Breadcrumb({ mainSection, params }: Props) {
    if (!mainSection) return null;

    const { navSlug } = await params;
    console.log('navSlug: ', navSlug);

    const items = [];

    const createLoupenickaBreadCrumb = async () => {
        items.push({ label: 'Loupeníčka', href: '/dashboard/loupenicka' });
        const oblast = await getLoupenickaBySlug(navSlug);
        oblast && items.push({ label: oblast.name, href: oblast.slug });
    };

    const createMisteckaBreadCrumb = async () => {
        const navId = getIdFromSlug(navSlug);
        const [slug] = removeIdFromSlugs([navSlug]);

        const oblast = await getMisteckaBySlug(slug);
        console.log('oblast: ', oblast);
        const x = await getCountryMisteckaBySlug(navId, slug);
        console.log('x: ', x);

        const countryList = await getCountriesByMisteckaId(navId);

        items.push({ label: oblast.name, href: `/dashboard/${navSlug}` });

        // oblast && items.push({ label: oblast.name, href: oblast.slug });
    };

    mainSection === 'loupenicka' && (await createLoupenickaBreadCrumb());
    mainSection === 'mistecka' && (await createMisteckaBreadCrumb());

    return (
        <nav aria-label="breadcrumb" className="h-5">
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
                                <span className="font-medium text-slate-500">{item.label}</span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export function BreadcrumbPlaceholder() {
    return <nav aria-hidden="true" className="h-5"></nav>;
}
