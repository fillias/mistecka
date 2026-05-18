import Link from 'next/link';

export default function Page() {
    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section>
                <h1 className="mb-4">Místečka</h1>

                <Link href="/login" className="btn btn-lg sm:min-w-32">
                    Login
                </Link>
            </section>
        </div>
    );
}
