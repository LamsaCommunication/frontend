import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs before any request to the matching paths
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We only want to protect /admin/* routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check if the user has the HttpOnly tokens from the backend
    const hasAccessToken = request.cookies.has('access_token');
    const hasRefreshToken = request.cookies.has('refresh_token');

    // If no tokens are present, redirect to login page immediately
    if (!hasAccessToken && !hasRefreshToken) {
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
