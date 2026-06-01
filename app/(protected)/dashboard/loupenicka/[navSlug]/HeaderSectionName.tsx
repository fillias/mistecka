type HeaderSectionNameProps = {
    params: Promise<{ navSlug: string }>;
};

export default async function HeaderSectionName({ params }: HeaderSectionNameProps) {
    const { navSlug } = await params;
    return <h2 className="mb-1">{navSlug}</h2>;
}
