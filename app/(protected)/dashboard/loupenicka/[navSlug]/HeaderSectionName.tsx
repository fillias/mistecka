import { getLoupenickaBySlug } from '@/lib/db/nav';

type HeaderSectionNameProps = {
    params: Promise<{ navSlug: string }>;
};

export default async function HeaderSectionName({ params }: HeaderSectionNameProps) {
    const { navSlug } = await params;

    const { name } = await getLoupenickaBySlug(navSlug);

    return <h2 className="mb-1">{name}</h2>;
}
