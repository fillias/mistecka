import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    const protectedPaths = ['/account', '/app'];
    const isProtected = protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p));

    if (!isProtected) return NextResponse.next();

    const hasTokenHint = req.cookies.has('nf_jwt') || req.headers.get('authorization')?.startsWith('Bearer ');

    if (!hasTokenHint) {
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/account/:path*',
        '/app/:path*',
        '/((?!_next/static|_next/image|favicon.svg|images|.*\\.svg|.*\\.png|.*\\.jpg).*)'
    ]
};
