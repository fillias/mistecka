// app/dashboard/loupenicka/[navSlug]/page.tsx
import { Suspense } from 'react';

import { Breadcrumb, BreadcrumbPlaceholder } from '@/components/Breadcrumb';
import EditorNav from '@/components/EditorNav';
import CountriesList from './CountriesList';
import FadeIn from '@/app/UI/FadeIn';

// import PlacesList from './PlacesList';

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

                {/* <Suspense fallback={<Spinner label={hasCountries ? 'Načítám země' : 'Načítám oblasti'} />}>
                {hasCountries ? (
                    <CountriesList navId={nav.id} navSlug={navSlug} />
                ) : (
                    <AreasList navId={nav.id} navSlug={navSlug} />
                )}
            </Suspense> */}
            </div>
            <Suspense>
                <CountriesList params={params} />
            </Suspense>
        </div>
    );
}

/*
       <div className="page-stack">


            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <Suspense>{ <HeaderSectionName params={params} /> }</Suspense>
                    </div>
                    { <Suspense fallback={null}>
                        <EditorNav table="loupenicko" type="misto" params={params} />
                    </Suspense> }
                </div>
            </div>

            <Suspense fallback={null}>{ <PlacesList params={params} /> }</Suspense>
        </div>

*/
