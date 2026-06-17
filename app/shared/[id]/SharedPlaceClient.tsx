'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PlaceDetail from '@/components/PlaceDetail';
import type { Tables } from '@/types/supabase';

type Place = Tables<'place_loupenicka'> | Tables<'place_mistecka'>;

type Props = {
    place: Place;
    kind: 'loupenicka' | 'mistecka';
};

export default function SharedPlaceClient({ place, kind }: Props) {
    const router = useRouter();

    const handleClose = () => {
        router.push('/');
    };

    return (
        <div className="relative min-h-dvh w-full overflow-hidden">
            {/* Background images and layout matching the dashboard */}
            <Image
                src="/images/les.jpg"
                alt=""
                fill
                priority
                className="pointer-events-none object-cover opacity-40"
            />
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(to bottom, rgba(15,23,42,0.35), rgba(15,23,42,0.55))'
                }}
            />

            {/* Main overlay wrapper */}
            <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center p-4">
                <div className="flex flex-col items-center text-center opacity-30 select-none">
                    <Image
                        src="/surfer-van.svg"
                        width={80}
                        height={80}
                        alt="Místečka logo"
                        className="h-16 w-16"
                    />
                    <h1 className="mt-2 text-2xl font-bold text-white">Místečka</h1>
                </div>

                <PlaceDetail
                    kind={kind}
                    place={place}
                    canManage={false}
                    showShare={false}
                    onClose={handleClose}
                />
            </div>
        </div>
    );
}
