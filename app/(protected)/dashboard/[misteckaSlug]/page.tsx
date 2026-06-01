// app/dashboard/loupenicka/page.tsx

import { Suspense } from 'react';
import EditorNav from '@/components/EditorNav';
// import LoupenickaList from './LoupenickaList';

export default async function Page() {
    return (
        <div className="page-stack">
            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="mb-1">TODO</h2>
                        <p>TODO.</p>
                    </div>
                    <Suspense>{/* <EditorNav table="mistecko" type="zeme" /> */}</Suspense>
                </div>
            </div>

            <Suspense>{/* <LoupenickaList /> */}</Suspense>
        </div>
    );
}
