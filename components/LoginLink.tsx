// components/LoginLink.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Spinner from '@/app/UI/Spinner';

export default function LoginLink() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <>
            <button
                className="btn btn-primary btn-lg w-full sm:w-auto sm:min-w-48"
                onClick={() => startTransition(() => router.push('/login'))}
            >
                {isPending ? 'Načítám...' : 'Login'}
            </button>

            {isPending && <Spinner />}
        </>
    );
}
