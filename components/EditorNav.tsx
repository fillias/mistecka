import userInfo from '@/lib/userInfo';
import AddCountryModal from '@/components/AddCountryModal';
import AddAreaModal from '@/components/AddAreaModal';
import AddLoupenickoModal from './AddLoupenickoModal';
import AddLoupenickoPlaceModal from './AddLoupenickoPlaceModal';
import { getLoupenickaBySlug } from '@/lib/db/nav';

type EditorNavProps = { table: string; type: string; data?: {}; params?: Promise<{ navSlug: string }> };

export default async function EditorNav({ table, type, params }: EditorNavProps) {
    const navSlug = params ? (await params).navSlug : undefined;

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

    return <></>;
}
