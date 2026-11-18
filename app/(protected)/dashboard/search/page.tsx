// app/dashboard/search/page.tsx

import { Suspense } from 'react';
import FadeIn from '@/app/UI/FadeIn';
import { Breadcrumb, BreadcrumbPlaceholder } from '@/components/Breadcrumb';
import SearchForm from '@/components/SearchForm';
import PlaceCardWithDetail from '@/components/PlaceCardWirhDetail';
import { getAllMisteckaTypes, getMisteckaByType, getSearchedMisteckaByCountryAndType } from '@/lib/db/search';
import userInfo from '@/lib/userInfo';
import type { Tables } from '@/types/supabase';

type MisteckaPlace = Tables<'place_mistecka'>;

type DashboardSearchPageProps = {
    params: Promise<{ navSlug: string }>;
    searchParams: Promise<{ typ?: string }>;
};

async function SearchedPlaces({ searchParams }) {
    const { isAdmin, isEditor } = await userInfo();
    const { typ } = await searchParams;
    const searchedPlaces = await getMisteckaByType(typ);
    console.log('searchedPlaces: ', searchedPlaces);

    const countryIds = extractUniqueCountryIds(searchedPlaces);

    const placeGroups = await Promise.all(countryIds.map((id) => getSearchedMisteckaByCountryAndType(id, typ)));

    console.log('placeGroups: ', placeGroups);

    return (
        <div>
            {placeGroups.map((countryPlaces) => {
                const [country, places] = countryPlaces;

                return (
                    <div key={country}>
                        <h3>{country}</h3>

                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {places.map((place: MisteckaPlace) => (
                                <li key={place.id}>
                                    <PlaceCardWithDetail
                                        kind="mistecka"
                                        place={place}
                                        canManage={isAdmin || isEditor}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}

export default async function DashboardSearchPage({ searchParams }: DashboardSearchPageProps) {
    const misteckaTypes = await getAllMisteckaTypes();

    return (
        <div className="page-stack">
            {/* <Suspense fallback={<BreadcrumbPlaceholder />}>
                <Breadcrumb mainSection={`search`} params={params} />
            </Suspense> */}
            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="mb-1">Hledat</h2>
                        <p>Vyber místo</p>
                    </div>
                </div>
            </div>

            <Suspense>
                <SearchForm misteckaTypes={misteckaTypes} />
            </Suspense>

            <Suspense>
                <FadeIn>
                    <SearchedPlaces searchParams={searchParams} />
                </FadeIn>
            </Suspense>
        </div>
    );
}

function extractUniqueCountryIds(items) {
    return [...new Set(items.map((item) => item.country_mistecka_id))];
}
