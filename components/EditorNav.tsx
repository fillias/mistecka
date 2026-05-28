import userInfo from '@/lib/userInfo';
import AddCountryModal from '@/components/AddCountryModal';
import AddAreaModal from '@/components/AddAreaModal';

type EditorNavProps = { nav: object; navigation: object; country: object | null };

export default async function EditorNav({ nav, navigation, country }: EditorNavProps) {
    console.log('nav: ', nav);
    console.log('navigation: ', navigation);
    const { isAdmin, isEditor } = await userInfo();

    if (!isAdmin && !isEditor) {
        return;
    }

    const AddCountryOrArea = () => {
        return (
            <>
                {navigation.navSlug && !navigation.secondSlug && (
                    <AddCountryModal navId={nav.id} navSlug={navigation.navSlug} />
                )}

                {navigation.navSlug && navigation.secondSlug && (
                    <AddAreaModal
                        navId={nav.id}
                        countryId={country.id}
                        navSlug={navigation.navSlug}
                        countrySlug={navigation.secondSlug}
                    />
                )}
            </>
        );
    };

    return (
        <>
            <AddCountryOrArea></AddCountryOrArea>
        </>
    );
}

/*

                secondslug

                                    {(isAdmin || isEditor) && (
                                        <AddPlaceModal navId={nav.id} areaId={area.id} navSlug={navSlug} areaSlug={secondSlug} />
                                    )}


                                    third

                                        {(isAdmin || isEditor) && (
                                            <AddPlaceModal
                                                navId={nav.id}
                                                countryId={country.id}
                                                areaId={area.id}
                                                navSlug={navSlug}
                                                countrySlug={secondSlug}
                                                areaSlug={thirdSlug}
                                            />
                                        )}
*/
