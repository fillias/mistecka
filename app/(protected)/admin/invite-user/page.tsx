import { redirect } from 'next/navigation';
import userInfo from '@/lib/userInfo';
import InviteUserForm from './InviteUserForm';

export default async function InviteUserPage() {
    const { isAdmin } = await userInfo();

    if (!isAdmin) {
        redirect('/dashboard');
    }

    return (
        <section className="page-stack">
            <div className="card">
                <span className="eyebrow mb-3">Admin</span>
                <h1 className="mb-2">Pozvat uživatele</h1>
            </div>

            <InviteUserForm />
        </section>
    );
}
