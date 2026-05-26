import Link from 'next/link';
import Image from 'next/image';
import LoadingLink from '@/components/LoadingLink';

export default async function Page() {
    return (
        <section className="flex min-h-[70vh] items-center justify-center py-10 sm:min-h-[80vh] sm:py-16">
            <div className="flex w-full max-w-md flex-col items-center text-center">
                <Image
                    src="/surfer-van.svg"
                    width={120}
                    height={120}
                    priority
                    alt="Místečka logo"
                    className="logo-img h-20 w-20 sm:h-28 sm:w-28"
                />

                <h1 className="mt-6">Místečka</h1>

                <p className="mt-3 max-w-sm">Přihlaste se a pokračujte do přehledu svých oblíbených míst.</p>

                <div className="mt-8 flex w-full justify-center">
                    <LoadingLink href="/login" className="btn btn-primary btn-lg w-full sm:w-auto sm:min-w-48">
                        Login
                    </LoadingLink>
                </div>
            </div>
        </section>
    );
}
