import Link from 'next/link';

export default function Page() {
    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section>
                <h1 className="mb-4">Netlify Platform Starter – Next.js</h1>
                <p className="mb-6 text-lg">
                    Deploy the latest version of Next.js — including Turbopack, React Compiler, and the new caching APIs
                    — on Netlify in seconds. No configuration or custom adapter required.
                </p>
                <Link href="https://docs.netlify.com/frameworks/next-js/overview/" className="btn btn-lg sm:min-w-64">
                    Read the Docs
                </Link>
            </section>

            <section className="flex flex-col gap-4"></section>
        </div>
    );
}
