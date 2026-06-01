import Link from 'next/link';
import { getLoupenickaBySlug, getLoupenicka } from '@/lib/db/nav';

export type Props = {
    path?: string;
    params: Promise<{ navSlug: string }>;
};

export default async function Breadcrumb({ path, params }: Props) {
    if (!path) return null;

    const { navSlug } = await params;

    const sections = path.split('/');
    console.log('sections: ', sections);

    const mainSection = sections[0];

    const items = [];

    const createLoupenickaBreadCrumb = async () => {
        items.push({ label: 'Loupeníčka', href: '/dashboard/loupenicka' });
        const oblast = await getLoupenickaBySlug(navSlug);
        items.push({ label: oblast.name, href: path });
    };

    mainSection === 'loupenicka' && (await createLoupenickaBreadCrumb());

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
                                <span className="font-medium text-slate-500">{item.label}</span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
