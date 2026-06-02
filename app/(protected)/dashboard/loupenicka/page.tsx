// app/dashboard/loupenicka/page.tsx

import { Suspense } from 'react';
import EditorNav from '@/components/EditorNav';
import LoupenickaList from './LoupenickaList';
import FadeIn from '@/app/UI/FadeIn';
import { Breadcrumb, BreadcrumbPlaceholder } from '@/components/Breadcrumb';

type Props = {
    params: Promise<{ navSlug: string }>;
};

export default async function DashboardLoupenickaPage({ params }: Props) {
    return (
        <div className="page-stack">
            <Suspense fallback={<BreadcrumbPlaceholder />}>
                <Breadcrumb mainSection={`loupenicka`} params={params} />
            </Suspense>
            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="mb-1">Loupeníčka</h2>
                        <p>Vyber místo</p>
                    </div>
                    <Suspense>
                        <FadeIn>
                            <EditorNav table="loupenicko" type="oblast" />
                        </FadeIn>
                    </Suspense>
                </div>
            </div>

            <Suspense>
                <LoupenickaList />
            </Suspense>
        </div>
    );
}
