// app/dashboard/loupenicka/page.tsx

import { Suspense } from 'react';
import EditorNav from '@/components/EditorNav';
import LoupenickaList from './LoupenickaList';

export default async function DashboardLoupenickaPage() {
    return (
        <div className="page-stack">
            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="mb-1">Loupeníčka</h2>
                        <p>Vyber loupeníčko pro zobrazení míst.</p>
                    </div>
                    <Suspense>
                        <EditorNav table="loupenicko" type="oblast" />
                    </Suspense>
                </div>
            </div>

            <Suspense>
                <LoupenickaList />
            </Suspense>
        </div>
    );
}
