import { getLoupenickaBySlug } from '@/lib/db/nav';

type HeaderSectionNameProps = {
    params: Promise<{ navSlug: string }>;
};

export async function HeaderSectionName({ params }: HeaderSectionNameProps) {
    const { navSlug } = await params;

    const { name } = await getLoupenickaBySlug(navSlug);

    return <h2 className="mb-1 h-9">{name}</h2>;
}

export function HeaderSectionNamePlaceholder() {
    return <h2 className="mb-1 h-9"></h2>;
}
