import userInfo from '@/lib/userInfo';
import AddCountryModal from '@/components/AddCountryModal';
import AddAreaModal from '@/components/AddAreaModal';
import AddLoupenickoModal from './AddLoupenickoModal';

type EditorNavProps = { table: string; type: string; data?: { name: string } };

export default async function EditorNav({ table, type, data }: EditorNavProps) {
    const { isAdmin, isEditor } = await userInfo();

    if (!isAdmin && !isEditor) {
        return;
    }

    const LoupenickoOblast = () => {
        return <AddLoupenickoModal />;
    };

    if (table === 'loupenicko' && type === 'oblast') {
        return <LoupenickoOblast />;
    }

    return <></>;
}
