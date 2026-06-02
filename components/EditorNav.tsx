import userInfo from '@/lib/userInfo';
import AddCountryModal from '@/components/AddCountryModal';
import AddAreaModal from '@/components/AddAreaModal';
import AddLoupenickoModal from './AddLoupenickoModal';
import AddLoupenickoPlaceModal from './AddLoupenickoPlaceModal';
import {
    getLoupenickaBySlug,
    getMisteckaBySlug,
    getCountryMisteckaBySlug,
    getCountriesByMisteckaId
} from '@/lib/db/nav';
import { removeIdFromSlugs, getIdFromSlug } from '@/lib/utils';

type EditorNavProps = {
    table: string;
    type: string;
    data?: {};
    params?: Promise<{ navSlug: string; secondSlug?: string; thirdSlug?: string }>;
};

export default async function EditorNav({ table, type, params }: EditorNavProps) {
    const { navSlug, secondSlug, thirdSlug } = params ? await params : undefined;

    const { isAdmin, isEditor } = await userInfo();

    if (!isAdmin && !isEditor) {
        return;
    }

    if (table === 'loupenicko' && type === 'oblast') {
        return <AddLoupenickoModal />;
    }

    if (table === 'loupenicko' && type === 'misto') {
        const loupenicko = await getLoupenickaBySlug(navSlug);
        return <AddLoupenickoPlaceModal loupenickaId={loupenicko.id} />;
    }

    if (table === 'mistecko' && type === 'zeme') {
        const navId = getIdFromSlug(navSlug);
        return <AddCountryModal navId={navId} navSlug={navSlug} />;
    }

    if (table === 'mistecko' && type === 'oblast') {
        const navId = getIdFromSlug(navSlug);
        const countryId = getIdFromSlug(secondSlug);
        return <AddAreaModal misteckaId={navId} navSlug={navSlug} countryId={countryId} countrySlug={secondSlug} />;
    }

    return <></>;
}

// const countries = await getCountriesByMisteckaId(navId);
// const [slug] = removeIdFromSlugs([navSlug]);
