import { NextRequest } from 'next/server';

function normalizeOrigin(origin: string | null) {
    if (!origin) return null;
    try {
        return new URL(origin).origin;
    } catch {
        return null;
    }
}

export function assertSameOrigin(req: NextRequest) {
    const origin = normalizeOrigin(req.headers.get('origin'));
    const host = req.headers.get('host');

    // console.log('origin: ', origin);
    // console.log('host: ', host);

    if (!origin || !host) {
        throw new Error('CSRF validation failed: missing origin or host');
    }

    const expectedOrigin = process.env.NODE_ENV === 'production' ? `https://${host}` : `http://${host}`;

    if (origin !== expectedOrigin) {
        throw new Error('CSRF validation failed: origin mismatch');
    }
}
