import Image from 'next/image';
import { Suspense } from 'react';
import LoggedUserEmail from './LoggedUserEmail';
import FadeIn from '@/app/UI/FadeIn';

type pageProps = {};

export default async function page({}: pageProps) {
    return (
        <>
            <section className="relative flex min-h-[70dvh] items-center justify-center overflow-hidden py-10 sm:min-h-[70dvh] sm:py-16">
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

                <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center text-center">
                    <h2 className="mb-2">Ahoj</h2>
                    <Suspense fallback={<span className="eyebrow opacity-50">načítám…</span>}>
                        <FadeIn delay={0.15}>
                            <LoggedUserEmail />
                        </FadeIn>
                    </Suspense>
                </div>
            </section>
        </>
    );
}
