import { getIdFromSlug, removeIdFromSlugs } from '@/lib/utils';
import { getCountryMisteckaBySlug, getMisteckaBySlug, getAreaMisteckaBySlug } from '@/lib/db/nav';

type SectionLabelProps = {
    params?: Promise<{ navSlug: string; secondSlug?: string; thirdSlug?: string }>;
};

export async function SectionLabel({ params }: SectionLabelProps) {
    const { navSlug, secondSlug, thirdSlug } = await params;

    const navId = getIdFromSlug(navSlug);
    const [mainNavSlug, countryNavSlug, areaNavSlug] = removeIdFromSlugs([navSlug, secondSlug, thirdSlug]);

    const countryNav = await getCountryMisteckaBySlug(navId, countryNavSlug);

    const areaNav = thirdSlug && (await getAreaMisteckaBySlug(getIdFromSlug(secondSlug), areaNavSlug));

    const label = areaNavSlug ? areaNav.name : countryNav.name;

    return <span className="eyebrow mb-3 min-h-5">{label}</span>;
}

export function SectionLabelPlaceholder() {
    return <span className="mb-3 h-5.5 block"></span>;
}
