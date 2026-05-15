import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: (cs) => {
                    cs.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({ request });
                    cs.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
                }
            }
        }
    );

    // Obnov session — VŽDY musí být před čtením user
    const {
        data: { user }
    } = await supabase.auth.getUser();

    // Chráněné trasy — uprav regex podle svého projektu
    const isProtected =
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/profile');

    if (isProtected && !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Přihlášený uživatel nemá co dělat na /login nebo /signup
    if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
