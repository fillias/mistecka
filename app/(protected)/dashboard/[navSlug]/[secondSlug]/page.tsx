import { Suspense } from 'react';
import { Breadcrumb, BreadcrumbPlaceholder } from '@/components/Breadcrumb';
import SectionLabel from './SectionLabel';
import Spinner from '@/app/UI/Spinner';
import AreasList from './AreasList';
import EditorNav from '@/components/EditorNav';
import FadeIn from '@/app/UI/FadeIn';

type Props = {
    params: Promise<{ navSlug: string; secondSlug: string }>;
};

export default async function SecondLevelPage({ params }: Props) {
    return (
        <div className="page-stack">
            <Suspense fallback={<BreadcrumbPlaceholder />}>
                <Breadcrumb mainSection={`mistecka`} params={params} />
            </Suspense>
            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <Suspense fallback={null}>
                            <FadeIn>
                                <SectionLabel params={params} />
                            </FadeIn>
                        </Suspense>
                        <h2 className="mb-1">Vyber oblast</h2>
                    </div>

                    <Suspense fallback={null}>
                        <FadeIn>
                            <EditorNav table="mistecko" type="oblast" params={params} />
                        </FadeIn>
                    </Suspense>
                </div>
            </div>

            <Suspense fallback={<Spinner />}>
                <AreasList params={params} />
            </Suspense>
        </div>
    );
}
