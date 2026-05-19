import { Suspense } from 'react';
import InviteAcceptClient from './InviteAcceptClient';

export default function InviteAcceptPage() {
    return (
        <section className="flex min-h-screen items-center justify-center py-6">
            <div className="w-full max-w-md">
                <Suspense
                    fallback={
                        <div className="card w-full">
                            <div className="page-stack items-center text-center">
                                <p className="meta-text">Načítám pozvánku…</p>
                            </div>
                        </div>
                    }
                >
                    <InviteAcceptClient />
                </Suspense>
            </div>
        </section>
    );
}
