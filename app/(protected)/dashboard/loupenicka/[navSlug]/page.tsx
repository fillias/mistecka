// app/dashboard/loupenicka/[navSlug]/page.tsx
import { Suspense } from 'react';

import Breadcrumb from '@/components/Breadcrumb';
import EditorNav from '@/components/EditorNav';
import HeaderSectionName from './HeaderSectionName';

import PlacesList from './PlacesList';

type Props = {
    params: Promise<{ navSlug: string }>;
};

export default async function DashboardLoupenickaDetailPage({ params }: Props) {
    return (
        <div className="page-stack">
            <Suspense fallback={null}>
                <Breadcrumb path={`loupenicka`} params={params} />
            </Suspense>

            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <Suspense>
                            <HeaderSectionName params={params} />
                        </Suspense>
                        <p>Seznam míst pro vybrané loupeníčko.</p>
                    </div>
                    <Suspense fallback={null}>
                        <EditorNav table="loupenicko" type="misto" params={params} />
                    </Suspense>
                </div>
            </div>

            <Suspense fallback={null}>
                <PlacesList params={params} />
            </Suspense>
        </div>
    );
}
