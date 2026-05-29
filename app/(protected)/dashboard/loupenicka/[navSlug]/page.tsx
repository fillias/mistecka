// app/dashboard/loupenicka/[navSlug]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import EditorNav from '@/components/EditorNav';

import PlacesList from './PlacesList';

type Props = {
    params: Promise<{ navSlug: string }>;
};

export default async function DashboardLoupenickaDetailPage({ params }: Props) {
    const { navSlug } = await params;

    return (
        <div className="page-stack">
            <Suspense>
                <Breadcrumb path={`loupenicka/${navSlug}`} />
            </Suspense>

            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="mb-1">{navSlug}</h2>
                        <p>Seznam míst pro vybrané loupeníčko.</p>
                    </div>
                    <Suspense>
                        <EditorNav table="loupenicko" type="misto" data={{ slug: navSlug }} />
                    </Suspense>
                </div>
            </div>

            <Suspense>
                <PlacesList navSlug={navSlug} />
            </Suspense>
        </div>
    );
}
