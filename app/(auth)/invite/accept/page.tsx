// app/invite/accept/page.tsx
import { Suspense } from 'react';
import InviteAcceptClient from './InviteAcceptClient';

export default function InviteAcceptPage() {
    return (
        <Suspense fallback={<p>Načítám pozvánku…</p>}>
            <InviteAcceptClient />
        </Suspense>
    );
}
