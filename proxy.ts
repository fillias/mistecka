import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);

    requestHeaders.delete('x-user-id');
    requestHeaders.delete('x-user-email');
    requestHeaders.delete('x-user-roles');

    let response = NextResponse.next({
        request: {
            headers: requestHeaders
        }
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => {
                        request.cookies.set(name, value);
                    });

                    response = NextResponse.next({
                        request: {
                            headers: requestHeaders
                        }
                    });

                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                }
            }
        }
    );

    const { data } = await supabase.auth.getClaims();
    const claims = data?.claims ?? null;

    const pathname = request.nextUrl.pathname;

    const isProtected =
        pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/profile');

    const isAuthPage = pathname === '/' || pathname === '/login';

    if (isProtected && !claims) {
        return copyCookiesToRedirect(response, NextResponse.redirect(new URL('/login', request.url)));
    }

    if (isAuthPage && claims) {
        return copyCookiesToRedirect(response, NextResponse.redirect(new URL('/dashboard', request.url)));
    }

    return response;
}

function copyCookiesToRedirect(source: NextResponse, target: NextResponse) {
    for (const cookie of source.cookies.getAll()) {
        target.cookies.set(cookie);
    }

    return target;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
