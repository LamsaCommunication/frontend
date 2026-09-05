import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs before any request to the matching paths
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We only want to protect /admin/* routes
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/';
  if (pathname.startsWith('/admin') && !isLoginPage) {
    // Check for either:
    // 1. HttpOnly auth cookies (set by backend with SameSite=None)
    // 2. A lightweight marker cookie set by the frontend after login
    //    (needed because cross-origin HttpOnly cookies can still be blocked
    //    by some browser privacy settings)
    const hasAccessToken = request.cookies.has('access_token');
    const hasRefreshToken = request.cookies.has('refresh_token');
    const hasAuthMarker = request.cookies.has('lamsa_auth');

    // If no auth signal at all, redirect to login
    if (!hasAccessToken && !hasRefreshToken && !hasAuthMarker) {
      const loginUrl = new URL('/admin/login', request.url);
      
      // Add a parameter to tell the client to clear any stale localStorage state
      loginUrl.searchParams.set('clearState', 'true');
      
      // Optionally add a redirect reason
      if (pathname !== '/admin') {
        loginUrl.searchParams.set('redirect', pathname);
      }
      
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
};
