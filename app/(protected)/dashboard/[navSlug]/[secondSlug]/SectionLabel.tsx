import { getIdFromSlug, removeIdFromSlugs } from '@/lib/utils';
import { getCountryMisteckaBySlug, getMisteckaBySlug } from '@/lib/db/nav';

type SectionLabelProps = {
    params?: Promise<{ navSlug: string; secondSlug?: string; thirdSlug?: string }>;
};

export default async function SectionLabel({ params }: SectionLabelProps) {
    const { navSlug, secondSlug, thirdSlug } = await params;

    const navId = getIdFromSlug(navSlug);
    const [mainNavSlug, countryNavSlug, areaNavSlug] = removeIdFromSlugs([navSlug, secondSlug, thirdSlug]);

    const mainNav = await getMisteckaBySlug(mainNavSlug);
    const countryNav = await getCountryMisteckaBySlug(navId, countryNavSlug);

    const label = countryNav ? countryNav.name : null;

    return <span className="eyebrow mb-3 block">{label}</span>;
}
