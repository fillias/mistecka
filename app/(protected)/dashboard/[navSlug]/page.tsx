// app/dashboard/loupenicka/[navSlug]/page.tsx
import { Suspense } from 'react';

import { Breadcrumb, BreadcrumbPlaceholder } from '@/components/Breadcrumb';
import EditorNav from '@/components/EditorNav';
import CountriesList from './CountriesList';
import FadeIn from '@/app/UI/FadeIn';

type Props = {
    params: Promise<{ navSlug: string }>;
};

export default async function DashboardLoupenickaDetailPage({ params }: Props) {
    return (
        <div className="page-stack">
            <Suspense fallback={<BreadcrumbPlaceholder />}>
                <Breadcrumb mainSection={`mistecka`} params={params} />
            </Suspense>
            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="mb-1">Vyber zemi</h2>
                    </div>
                    <Suspense fallback={null}>
                        <FadeIn>
                            <EditorNav table="mistecko" type="zeme" params={params} />
                        </FadeIn>
                    </Suspense>
                </div>
            </div>
            <Suspense>
                <CountriesList params={params} />
            </Suspense>
        </div>
    );
}
