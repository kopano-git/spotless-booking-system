import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // If the request is for /admin, let it pass through to the Vercel router
  // which will forward it to the Django backend based on vercel.json
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }
}

// Only run this middleware for the /admin path
export const config = {
  matcher: '/admin/:path*',
}