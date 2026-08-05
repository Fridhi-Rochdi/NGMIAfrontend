import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/auth/login', '/auth/register'];

// Base domain for generated websites
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'marketingai.dev';
const LOCAL_BASE_DOMAIN = 'localhost';

export function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // --- Subdomain detection for generated websites ---
  // On localhost, subdomains look like: subdomain.localhost:3000
  // In production: subdomain.maketingai.dev
  const isLocal = hostname === LOCAL_BASE_DOMAIN || hostname.startsWith(`${LOCAL_BASE_DOMAIN}:`);
  const isProd = hostname === BASE_DOMAIN || hostname.endsWith(`.${BASE_DOMAIN}`);

  let subdomain: string | null = null;

  if (isLocal) {
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[0] !== 'www') {
      subdomain = parts[0];
    }
  } else if (isProd && hostname !== BASE_DOMAIN) {
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[0] !== 'www') {
      subdomain = parts[0];
    }
  }

  // If subdomain is detected, rewrite to the website viewer page
  if (subdomain) {
    const url = request.nextUrl.clone();
    url.pathname = `/site/${subdomain}`;
    url.search = request.nextUrl.search;
    return NextResponse.rewrite(url);
  }

  // --- Auth middleware for the main app ---
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next();
  }

  // Allow /site/:subdomain route (public, no auth needed)
  if (pathname.startsWith('/site/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token && !publicPaths.some((path) => pathname.startsWith(path))) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
