import { redirect } from 'next/navigation';
import userInfo from '@/lib/userInfo';
import InviteUserForm from './InviteUserForm';

export default async function FormWrapper() {
    const { isAdmin } = await userInfo();

    if (!isAdmin) {
        redirect('/dashboard');
    }
    return <InviteUserForm />;
}
