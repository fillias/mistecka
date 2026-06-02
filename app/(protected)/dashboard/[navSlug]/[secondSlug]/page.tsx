import { Suspense } from 'react';
import { Breadcrumb, BreadcrumbPlaceholder } from '@/components/Breadcrumb';

import Spinner from '@/app/UI/Spinner';
import AreasList from './AreasList';
import EditorNav from '@/components/EditorNav';

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
                        <span className="eyebrow mb-3 block">TODO</span>
                        <h2 className="mb-1">Vyber oblast</h2>
                    </div>

                    {/* <Suspense>
                        <EditorNav nav={nav} navigation={{ navSlug, secondSlug }} country={country} />
                    </Suspense> */}
                </div>
            </div>

            <Suspense fallback={<Spinner />}>
                {/* <AreasList navId={nav.id} countryId={country.id} navSlug={navSlug} secondSlug={secondSlug} /> */}
            </Suspense>
        </div>
    );
}
