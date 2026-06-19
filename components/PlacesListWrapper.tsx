'use client';

import PlaceCardWithDetail from './PlaceCardWirhDetail';
import type { Tables } from '@/types/supabase';
import { useState } from 'react';

type LoupenickaPlace = Tables<'place_loupenicka'>;
type MisteckaPlace = Tables<'place_mistecka'>;

type Props =
    | {
          kind: 'loupenicka';
          canManage?: boolean;
          places: LoupenickaPlace[];
      }
    | {
          kind: 'mistecka';
          canManage?: boolean;
          places: MisteckaPlace[];
      };

export default function PlacesListWrapper(props: Props) {
    const [selectedType, setSelectedType] = useState('vše');

    if (props.kind === 'mistecka') {
        const placeTypes = [...new Set(props.places.map((place) => place.type))];
        const filteredPlaces =
            selectedType === 'vše' ? props.places : props.places.filter((place) => place.type === selectedType);

        return (
            <>
                <form>
                    <label
                        htmlFor="place-type"
                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                        Vyber typ místa, {filteredPlaces.length} {filteredPlaces.length === 1 ? 'místo' : 'míst'}
                    </label>

                    <select
                        id="place-type"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="mb-3 w-full sm:w-auto  rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                    >
                        <option value="vše">vše</option>
                        {placeTypes.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </form>

                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {filteredPlaces.map((place) => (
                        <li key={place.id}>
                            <PlaceCardWithDetail kind="mistecka" place={place} canManage={props.canManage} />
                        </li>
                    ))}
                </ul>
            </>
        );
    }

    // loupenicka
    const placeTypes = [...new Set(props.places.map((place) => place.type))];
    const filteredPlaces =
        selectedType === 'vše' ? props.places : props.places.filter((place) => place.type === selectedType);

    return (
        <>
            <form>
                <label
                    htmlFor="place-type"
                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                    Vyber typ loupeníčka, {filteredPlaces.length} {filteredPlaces.length === 1 ? 'místo' : 'míst'}
                </label>

                <select
                    id="place-type"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="mb-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                >
                    <option value="vše">vše</option>
                    {placeTypes.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </form>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredPlaces.map((place) => (
                    <li key={place.id}>
                        <PlaceCardWithDetail kind="loupenicka" place={place} canManage={props.canManage} />
                    </li>
                ))}
            </ul>
        </>
    );
}
