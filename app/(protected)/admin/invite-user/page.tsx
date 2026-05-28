import FormWrapper from './FormWrapper';
import { Suspense } from 'react';

export default async function InviteUserPage() {
    return (
        <section className="page-stack">
            <div className="card">
                <span className="eyebrow mb-3">Admin</span>
                <h1 className="mb-2">Pozvat uživatele</h1>
            </div>
            <Suspense>
                <FormWrapper />
            </Suspense>
        </section>
    );
}
