import { createAdminClient } from '@/lib/supabase/admin';
import SharedPlaceClient from './SharedPlaceClient';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

type SharedPlacePageProps = {
    params: Promise<{ id: string }>;
};

export const metadata = {
    title: 'Sdílené místo'
};

const CreateSharedPlacePage = async ({ params }: SharedPlacePageProps) => {
    const { id } = await params;

    const supabase = createAdminClient();

    // 1. Zkontrolujeme token sdílení a ověříme expirační dobu
    const { data: shared, error: sharedError } = await supabase
        .from('shared_places')
        .select('kind, place_loupenicka_id, place_mistecka_id, expires_at')
        .eq('id', id)
        .gt('expires_at', new Date().toISOString())
        .single();

    if (sharedError || !shared) {
        return (
            <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden py-10 sm:py-16">
                <Image
                    src="/images/les.jpg"
                    alt=""
                    fill
                    priority
                    className="pointer-events-none object-cover opacity-20"
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(15,23,42,0.45), rgba(15,23,42,0.65))'
                    }}
                />

                <div
                    className="relative z-10 flex w-full max-w-md flex-col items-center text-center p-6 bg-[rgb(var(--surface))] rounded-3xl border shadow-xl"
                    style={{ borderColor: 'rgb(var(--border))' }}
                >
                    <Image
                        src="/surfer-van.svg"
                        width={100}
                        height={100}
                        alt="Místečka logo"
                        className="opacity-60 grayscale"
                    />

                    <h2 className="mt-6 text-xl font-bold" style={{ color: 'rgb(var(--text))' }}>
                        Odkaz neexistuje nebo vypršel
                    </h2>

                    <p className="mt-3 leading-6 text-sm" style={{ color: 'rgb(var(--text-muted))' }}>
                        Tento odkaz na sdílené místo již není platný. Platnost odkazu je omezena na 72 hodin od jeho
                        vytvoření.
                    </p>

                    <div className="mt-8 flex w-full justify-center">
                        <Link
                            href="/"
                            className="btn btn-primary w-full sm:w-auto sm:min-w-48 text-center py-3 rounded-full text-sm font-semibold transition hover:scale-[1.02]"
                        >
                            Přejít na hlavní stránku
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Načteme odpovídající místo z příslušné tabulky
    const tableName = shared.kind === 'loupenicka' ? 'place_loupenicka' : 'place_mistecka';
    const placeId = shared.kind === 'loupenicka' ? shared.place_loupenicka_id : shared.place_mistecka_id;

    if (!placeId) {
        return (
            <div className="relative flex min-h-dvh w-full flex-col items-center justify-center text-center p-4">
                <p>Neočekávaná chyba: Odkazované místo chybí.</p>
            </div>
        );
    }

    const { data: place, error: placeError } = await supabase.from(tableName).select('*').eq('id', placeId).single();

    if (placeError || !place) {
        return (
            <div className="relative flex min-h-dvh w-full flex-col items-center justify-center text-center p-4">
                <p>Požadované místo nebylo nalezeno nebo bylo smazáno.</p>
            </div>
        );
    }

    return <SharedPlaceClient place={place} kind={shared.kind} />;
};

export default async function SharedPlacePage({ params }: SharedPlacePageProps) {
    return (
        <Suspense>
            <CreateSharedPlacePage params={params} />
        </Suspense>
    );
}
