import { Suspense } from 'react';
import { Breadcrumb, BreadcrumbPlaceholder } from '@/components/Breadcrumb';
import { SectionLabel, SectionLabelPlaceholder } from '@/components/SectionLabel';
import Spinner from '@/app/UI/Spinner';
import EditorNav from '@/components/EditorNav';
import FadeIn from '@/app/UI/FadeIn';
import PlacesSection from './PlacesSection';

type Props = {
    params: Promise<{ navSlug: string; secondSlug: string; thirdSlug: string }>;
};

export default async function ThirdLevelPage({ params }: Props) {
    return (
        <div className="page-stack">
            <Suspense fallback={<BreadcrumbPlaceholder />}>
                <Breadcrumb mainSection={`mistecka`} params={params} />
            </Suspense>
            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <Suspense fallback={<SectionLabelPlaceholder />}>
                            <FadeIn>
                                <SectionLabel params={params} />
                            </FadeIn>
                        </Suspense>
                        <h2 className="mb-1">místečka</h2>
                    </div>

                    <Suspense fallback={null}>
                        <FadeIn>
                            <EditorNav table="mistecko" type="misto" params={params} />
                        </FadeIn>
                    </Suspense>
                </div>
            </div>

            <Suspense fallback={<Spinner />}>
                <PlacesSection params={params} />
            </Suspense>
        </div>
    );
}
