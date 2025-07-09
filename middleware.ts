import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './app/_lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return await updateSession(request);
  }
  // In development mode, we can skip the session update
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth/callback|login|test|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}