import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to handle route access based on authentication status.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token');

  // Allow access to /dashboard/board/[id] without token
  const boardPathPattern = /^\/dashboard\/board\/[^\/]+$/;

  // If there is no token and the path is / or starts with /dashboard (excluding /dashboard/board/[id]), redirect to /auth/login
  if (!token) {
    if (pathname === '/' || (pathname.startsWith('/dashboard') && !boardPathPattern.test(pathname))) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // If there is a token and the path starts with /auth/login or /auth/register, redirect to /dashboard
  if (token) {
    if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Proceed to the next middleware or request handler
  return NextResponse.next();
}

/**
 * Configuration object for the middleware.
 * Specifies the paths that the middleware should apply to.
 */
export const config = {
  matcher: ['/', '/auth/:path*', '/dashboard/:path*'],
};
