// app/dashboard/search/page.tsx

import { Suspense } from 'react';
import FadeIn from '@/app/UI/FadeIn';
import { SearchTypesForm, SearchCountriesForm } from '@/components/SearchForm';
import PlaceCardWithDetail from '@/components/PlaceCardWirhDetail';
import { getAllMisteckaTypes, getSearchedMisteckaByTypeAndCountryName, getCountryNamesByType } from '@/lib/db/search';
import userInfo from '@/lib/userInfo';
import type { Tables } from '@/types/supabase';

type MisteckaPlace = Tables<'place_mistecka'>;

type DashboardSearchPageProps = {
    params: Promise<{ navSlug: string }>;
    searchParams: Promise<{ typ?: string }>;
};

async function SearchCountryByType({ searchParams }) {
    let { typ } = await searchParams;

    const countryNames = await getCountryNamesByType(typ);

    return <Suspense>{typ && countryNames && <SearchCountriesForm misteckaCountryNames={countryNames} />}</Suspense>;
}

async function SearchedPlaces({ searchParams }) {
    const { isAdmin, isEditor } = await userInfo();

    const { typ, country } = await searchParams;

    const placeGroups = await getSearchedMisteckaByTypeAndCountryName(typ, country);

    // console.log('placeGroups: ', placeGroups);

    const [countryName, places] = placeGroups;

    return (
        <div>
            {countryName && (
                <>
                    <h2 className="mb-5 border-b border-slate-300 pb-1">{countryName}</h2>
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {Array.isArray(places) &&
                            places.map((place: MisteckaPlace) => (
                                <li key={place.id}>
                                    <PlaceCardWithDetail
                                        kind="mistecka"
                                        place={place}
                                        canManage={isAdmin || isEditor}
                                    />
                                </li>
                            ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default async function DashboardSearchPage({ searchParams }: DashboardSearchPageProps) {
    const misteckaTypes = await getAllMisteckaTypes();

    return (
        <div className="page-stack">
            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="">Hledat</h2>
                    </div>
                </div>
            </div>

            <Suspense>
                <SearchTypesForm misteckaTypes={misteckaTypes} />
            </Suspense>

            <Suspense>
                <FadeIn>
                    <SearchCountryByType searchParams={searchParams} />
                </FadeIn>
            </Suspense>

            <Suspense>
                <FadeIn>
                    <SearchedPlaces searchParams={searchParams} />
                </FadeIn>
            </Suspense>
        </div>
    );
}
