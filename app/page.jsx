import Link from 'next/link';

export default function Page() {
    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section>
                <h1 className="mb-4">Netlify Platform Starter – Next.js</h1>
                <p className="mb-6 text-lg">Deploy the latest version of Next.js —</p>
                <Link href="/login" className="btn btn-lg sm:min-w-32">
                    Login
                </Link>
            </section>

            <section className="flex flex-col gap-4"></section>
        </div>
    );
}
