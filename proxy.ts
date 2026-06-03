import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
                }
            }
        }
    );

    const {
        data: { user }
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    const isProtected =
        pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/profile');

    const isAuthPage = pathname === '/' || pathname === '/login' || pathname === '/signup';

    if (isProtected && !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAuthPage && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/admin/:path*',
        '/profile/:path*',
        '/invite/:path*',
        '/login',
        '/signup',
        '/logout'
    ]
};
