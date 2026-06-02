// app/dashboard/loupenicka/[navSlug]/page.tsx
import { Suspense } from 'react';

import { Breadcrumb, BreadcrumbPlaceholder } from '@/components/Breadcrumb';
import EditorNav from '@/components/EditorNav';
import { HeaderSectionName, HeaderSectionNamePlaceholder } from './HeaderSectionName';
import Spinner from '@/app/UI/Spinner';

import PlacesList from './PlacesList';
import FadeIn from '@/app/UI/FadeIn';

type Props = {
    params: Promise<{ navSlug: string }>;
};

export default async function DashboardLoupenickaDetailPage({ params }: Props) {
    return (
        <div className="page-stack">
            <Suspense fallback={<BreadcrumbPlaceholder />}>
                <Breadcrumb path={`loupenicka`} params={params} />
            </Suspense>

            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <Suspense fallback={<HeaderSectionNamePlaceholder />}>
                            <FadeIn>
                                <HeaderSectionName params={params} />
                            </FadeIn>
                        </Suspense>
                        <p>Seznam loupeníček</p>
                    </div>
                    <Suspense fallback={null}>
                        <FadeIn>
                            <EditorNav table="loupenicko" type="misto" params={params} />
                        </FadeIn>
                    </Suspense>
                </div>
            </div>

            <Suspense fallback={<Spinner />}>
                <PlacesList params={params} />
            </Suspense>
        </div>
    );
}
