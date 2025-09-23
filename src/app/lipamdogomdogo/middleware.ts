import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  
  // Handle old category URLs with query parameters
  if (pathname === '/products' && searchParams.has('category')) {
    const category = searchParams.get('category')
    if (category && category !== 'all') {
      // Redirect to new category page format
      const newUrl = new URL(`/products/category/${category}`, request.url)
      return NextResponse.redirect(newUrl, 302) // Temporary redirect
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}