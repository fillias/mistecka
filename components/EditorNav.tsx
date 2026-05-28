import userInfo from '@/lib/userInfo';
import AddCountryModal from '@/components/AddCountryModal';
import AddAreaModal from '@/components/AddAreaModal';
import AddLoupenickoModal from './AddLoupenickoModal';
import AddLoupenickoPlaceModal from './AddLoupenickoPlaceModal';
import { getLoupenickaBySlug } from '@/lib/db/nav';

type EditorNavProps = { table: string; type: string; data?: { slug: string } };

export default async function EditorNav({ table, type, data }: EditorNavProps) {
    const { isAdmin, isEditor } = await userInfo();

    if (!isAdmin && !isEditor) {
        return;
    }

    if (table === 'loupenicko' && type === 'oblast') {
        return <AddLoupenickoModal />;
    }

    if (table === 'loupenicko' && type === 'misto') {
        const loupenicko = await getLoupenickaBySlug(data.slug);
        return <AddLoupenickoPlaceModal loupenickaId={loupenicko.id} />;
    }

    return <></>;
}
