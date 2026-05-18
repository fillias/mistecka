// app/(protected)/(admin)/invite-user/page.tsx
import { redirect } from 'next/navigation';
import userInfo from '@/lib/userInfo';
import InviteUserForm from './InviteUserForm';

export default async function InviteUserPage() {
    const { isAdmin } = await userInfo();

    if (!isAdmin) {
        redirect('/dashboard');
    }

    return (
        <main>
            <h1>Pozvat uživatele</h1>
            <p>Uživateli bude odeslán email s odkazem pro dokončení registrace.</p>
            <InviteUserForm />
        </main>
    );
}
