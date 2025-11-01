import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if accessing protected routes
  if (request.nextUrl.pathname.startsWith('/photographers') || 
      request.nextUrl.pathname.startsWith('/photographer/')) {
    
    const isAuthenticated = request.cookies.get('authenticated')?.value === 'true';
    
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/photographers/:path*', '/photographer/:path*']
};